type PdfOrientation = 'p' | 'l';
type PdfUnit = 'pt';
type PdfImageCompression = 'FAST' | 'MEDIUM' | 'SLOW' | 'NONE';
type PdfImageType = 'PNG' | 'JPEG';

export type ExportElementToPdfOptions = {
    fileName: string;
    orientation?: PdfOrientation;
    format?: 'a4';
    unit?: PdfUnit;
    marginPt?: number;
    /**
     * Higher = sharper, but slower and heavier.
     * Recommended: 2
     */
    scale?: number;
    /**
     * Set to '#fff' to force white background.
     */
    backgroundColor?: string | null;
    /**
     * PNG keeps sharp UI edges; JPEG makes smaller files.
     * Default: PNG
     */
    imageType?: PdfImageType;
    /**
     * Trade off speed vs quality when embedding images into PDF.
     * Default: SLOW (best looking for UI screenshots)
     */
    imageCompression?: PdfImageCompression;
    /**
     * Wait for fonts to be ready before capture (prevents "flash of fallback font" in PDF).
     * Default: true
     */
    waitForFonts?: boolean;
    /**
     * Wait for <img> tags inside the element to load before capture.
     * Default: true
     */
    waitForImages?: boolean;
    /**
     * Safety timeout for waiting resources (fonts/images).
     * Default: 2500
     */
    resourceTimeoutMs?: number;
    /**
     * Called with a value between 0..1.
     */
    onProgress?: (progress: number) => void;
};

const INVALID_FILENAME_CHARS = new Set(['<', '>', ':', '"', '/', '\\', '|', '?', '*']);

export const sanitizeFileName = (input: string) => {
    const trimmed = input.trim();
    let cleaned = '';
    for (const ch of trimmed) {
        const code = ch.charCodeAt(0);
        // Disallow ASCII control chars (0..31)
        if (code >= 0 && code < 32) continue;
        if (INVALID_FILENAME_CHARS.has(ch)) continue;
        cleaned += ch;
    }

    return cleaned
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 120);
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T | undefined> => {
    let timeoutId: number | undefined;
    try {
        const timeoutPromise = new Promise<undefined>((resolve) => {
            timeoutId = window.setTimeout(() => resolve(undefined), timeoutMs);
        });
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        if (timeoutId) window.clearTimeout(timeoutId);
    }
};

const waitForDocumentFonts = async (timeoutMs: number) => {
    // Not supported in all environments; keep it best-effort.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fonts = (document as any).fonts as FontFaceSet | undefined;
    if (!fonts?.ready) return;
    await withTimeout(fonts.ready, timeoutMs);
};

const waitForElementImages = async (element: HTMLElement, timeoutMs: number) => {
    const imgs = Array.from(element.querySelectorAll('img'));
    if (!imgs.length) return;

    await Promise.all(
        imgs.map(
            (img) =>
                new Promise<void>((resolve) => {
                    if (img.complete) return resolve();
                    const onDone = () => resolve();
                    img.addEventListener('load', onDone, { once: true });
                    img.addEventListener('error', onDone, { once: true });
                    window.setTimeout(onDone, timeoutMs);
                }),
        ),
    );
};

/**
 * Export a DOM element to PDF while preserving the current UI.
 * Implementation uses html2canvas -> jsPDF with page-by-page slicing (clean pagination).
 */
export async function exportElementToPdf(element: HTMLElement, options: ExportElementToPdfOptions): Promise<void> {
    const {
        fileName,
        orientation = 'p',
        format = 'a4',
        unit = 'pt',
        marginPt = 24,
        scale = 2,
        backgroundColor = '#ffffff',
        imageType = 'PNG',
        imageCompression = 'SLOW',
        waitForFonts = true,
        waitForImages = true,
        resourceTimeoutMs = 2500,
        onProgress,
    } = options;

    if (!element) return;

    const safeName = sanitizeFileName(fileName.replace(/\.pdf$/i, '')) || 'document';
    const finalName = `${safeName}.pdf`;

    onProgress?.(0.05);

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

    // Best-effort: ensure fonts/images are ready so the PDF matches the UI.
    if (waitForFonts) {
        onProgress?.(0.08);
        await waitForDocumentFonts(resourceTimeoutMs);
    }
    if (waitForImages) {
        onProgress?.(0.12);
        await waitForElementImages(element, resourceTimeoutMs);
    }

    // Capture full element (including overflow content).
    const rect = element.getBoundingClientRect();
    const captureWidth = Math.ceil(Math.max(1, element.scrollWidth || 0, rect.width || 0));
    const captureHeight = Math.ceil(Math.max(1, element.scrollHeight || 0, rect.height || 0));

    const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        useCORS: true,
        // If the canvas becomes tainted (cross-origin assets without CORS), toDataURL will fail and PDF export breaks.
        // Keep this false so we get a best-effort render without breaking export.
        allowTaint: false,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: captureWidth,
        height: captureHeight,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
    });

    onProgress?.(0.35);

    const pdf = new jsPDF({ orientation, unit, format, compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const contentWidthPt = Math.max(1, pageWidth - marginPt * 2);
    const contentHeightPt = Math.max(1, pageHeight - marginPt * 2);

    // We render each page at the same width, then slice the canvas by the height that fits per page.
    const sliceHeightPx = Math.floor((contentHeightPt * canvas.width) / contentWidthPt);
    const totalSlices = Math.max(1, Math.ceil(canvas.height / Math.max(1, sliceHeightPx)));

    for (let pageIndex = 0; pageIndex < totalSlices; pageIndex++) {
        const sy = pageIndex * sliceHeightPx;
        const sHeight = Math.min(sliceHeightPx, canvas.height - sy);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sHeight;
        const ctx = pageCanvas.getContext('2d');

        if (!ctx) continue;

        ctx.drawImage(canvas, 0, sy, canvas.width, sHeight, 0, 0, canvas.width, sHeight);

        const mimeType = imageType === 'JPEG' ? 'image/jpeg' : 'image/png';
        const jpegQuality = 0.92;
        let imgData: string;
        try {
            imgData =
                imageType === 'JPEG' ? pageCanvas.toDataURL(mimeType, jpegQuality) : pageCanvas.toDataURL(mimeType);
        } catch {
            // Most common cause: tainted canvas due to cross-origin images without proper CORS headers.
            throw new Error('Failed to encode canvas to image data for PDF export.');
        }
        const imgHeightPt = (sHeight * contentWidthPt) / canvas.width;

        if (pageIndex > 0) {
            pdf.addPage();
        }

        const compression = imageCompression === 'NONE' ? undefined : imageCompression;
        pdf.addImage(imgData, imageType, marginPt, marginPt, contentWidthPt, imgHeightPt, undefined, compression);

        onProgress?.(0.35 + (0.6 * (pageIndex + 1)) / totalSlices);
    }

    onProgress?.(0.98);
    pdf.save(finalName);
    onProgress?.(1);
}


