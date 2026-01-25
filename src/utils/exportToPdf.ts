type html2canvasType = (typeof import('html2canvas'))['default'];
type JsPDFCtor = typeof import('jspdf').jsPDF;

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
    /**
     * Chromium sometimes blocks downloads after long async work. We optionally pre-open a tab/window
     * (within the original user gesture) and later navigate it to the generated PDF.
     *
     * Set to false to avoid opening a new tab (at the risk of the browser blocking the download).
     * Default: auto (enabled on Chromium, disabled elsewhere)
     */
    preOpenWindow?: boolean;
};

export type ExportElementToPdfPreviewImageOptions = Omit<
    ExportElementToPdfOptions,
    'fileName' | 'onProgress' | 'imageCompression' | 'preOpenWindow'
> & {
    /**
     * JPEG quality (0..1) when imageType is JPEG.
     * Default: 0.82
     */
    jpegQuality?: number;
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

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T | undefined> => {
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
 * Render an element into an image that matches the **first page** of our PDF export pipeline.
 * This is used for UI thumbnails / previews ("PDF image") without generating a full PDF file.
 */
export async function exportElementToPdfPreviewImage(
    element: HTMLElement,
    options: ExportElementToPdfPreviewImageOptions = { imageType: 'JPEG' },
): Promise<string | null> {
    const {
        orientation = 'p',
        format = 'a4',
        unit = 'pt',
        marginPt = 24,
        scale = 1,
        backgroundColor = '#ffffff',
        imageType = 'JPEG',
        waitForFonts = true,
        waitForImages = true,
        resourceTimeoutMs = 2500,
        jpegQuality = 0.82,
    } = options;

    if (!element) return null;

    // Best-effort: ensure fonts/images are ready so the preview matches the exported PDF.
    if (waitForFonts) {
        await waitForDocumentFonts(resourceTimeoutMs);
    }
    if (waitForImages) {
        await waitForElementImages(element, resourceTimeoutMs);
    }

    const [html2canvasModule, jsPdfModule] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const html2canvas = resolveHtml2Canvas(html2canvasModule);
    const jsPDFConstructor = resolveJsPdfConstructor(jsPdfModule);
    if (!jsPDFConstructor) {
        throw new Error('Failed to load jsPDF constructor.');
    }

    const pdf = new jsPDFConstructor({ orientation, unit, format, compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const contentWidthPt = Math.max(1, pageWidth - marginPt * 2);
    const contentHeightPt = Math.max(1, pageHeight - marginPt * 2);

    // Capture only enough DOM height for the first PDF page (fast, and guarantees the preview matches PDF framing).
    const rect = element.getBoundingClientRect();
    const captureWidthCss = Math.ceil(Math.max(1, element.scrollWidth || 0, rect.width || 0));
    const fullHeightCss = Math.ceil(Math.max(1, element.scrollHeight || 0, rect.height || 0));

    // Derivation: sliceHeightPx = (contentHeightPt * canvas.width) / contentWidthPt.
    // canvas.width ≈ captureWidthCss * scale, so CSS height needed is:
    // sliceHeightCss ≈ (contentHeightPt * captureWidthCss) / contentWidthPt.
    const firstPageHeightCss = Math.ceil((contentHeightPt * captureWidthCss) / contentWidthPt) + 6;
    const captureHeightCss = Math.min(fullHeightCss, firstPageHeightCss);

    const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        useCORS: true,
        allowTaint: false,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: captureWidthCss,
        height: captureHeightCss,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
    });

    const sliceHeightPx = Math.min(canvas.height, Math.floor((contentHeightPt * canvas.width) / contentWidthPt));
    if (sliceHeightPx <= 0 || canvas.width <= 0) return null;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) return null;

    // Force an opaque white background (prevents "gray/dirty" look when alpha is present).
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.restore();

    ctx.drawImage(canvas, 0, 0, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

    const mimeType = imageType === 'JPEG' ? 'image/jpeg' : 'image/png';
    try {
        return imageType === 'JPEG' ? pageCanvas.toDataURL(mimeType, jpegQuality) : pageCanvas.toDataURL(mimeType);
    } catch {
        // Most common cause: tainted canvas due to cross-origin images without proper CORS headers.
        return null;
    }
}

/**
 * Export a DOM element to PDF while preserving the current UI.
 * Implementation uses html2canvas -> jsPDF with page-by-page slicing (clean pagination).
 */
const resolveHtml2Canvas = (module: unknown): html2canvasType => {
    if (typeof module === 'function') {
        return module as unknown as html2canvasType;
    }

    if (module && typeof module === 'object' && 'default' in module) {
        return (module as { default: html2canvasType }).default;
    }

    return module as html2canvasType;
};

const resolveJsPdfConstructor = (module: unknown): JsPDFCtor | undefined => {
    if (!module) return undefined;

    if (typeof module === 'function') {
        return module as unknown as JsPDFCtor;
    }

    if (module && typeof module === 'object') {
        const asModule = module as { jsPDF?: JsPDFCtor; default?: JsPDFCtor };
        return asModule.jsPDF ?? asModule.default;
    }

    return undefined;
};

const isNearlyWhite = (r: number, g: number, b: number, a: number) => {
    // Treat transparent as white (common for canvas backgrounds).
    if (a < 10) return true;
    return r >= 248 && g >= 248 && b >= 248;
};

/**
 * Try to find a horizontal "blog" row (mostly white pixels) close to the target break.
 * This helps avoid cutting text lines in half when we slice the canvas into pages.
 */
const findWhitespaceBreakY = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    regionStartY: number,
    regionHeight: number,
): number | undefined => {
    if (regionHeight <= 2) return undefined;

    const imageData = ctx.getImageData(0, regionStartY, canvasWidth, regionHeight);
    const { data, width } = imageData;

    // Scan from bottom to top to keep as much content as possible.
    for (let row = regionHeight - 1; row >= 0; row--) {
        let whiteCount = 0;
        const rowStart = row * width * 4;
        for (let x = 0; x < width; x++) {
            const i = rowStart + x * 4;
            if (isNearlyWhite(data[i], data[i + 1], data[i + 2], data[i + 3])) whiteCount++;
        }
        const ratio = whiteCount / Math.max(1, width);
        if (ratio >= 0.995) {
            return regionStartY + row;
        }
    }
    return undefined;
};

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
        preOpenWindow,
    } = options;

    if (!element) return;

    const safeName = sanitizeFileName(fileName.replace(/\.pdf$/i, '')) || 'document';
    const finalName = `${safeName}.pdf`;

    onProgress?.(0.05);

    // Chrome/Chromium often blocks downloads that happen after long async work because the original "user gesture"
    // activation is lost. Firefox is usually more permissive. To make Chrome reliable, we pre-open a window/tab
    // synchronously (still within the click event) and later navigate it to the generated PDF.
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isFirefox = /Firefox\//i.test(ua);
    const isChromium = /Chrome\//i.test(ua) || /Chromium\//i.test(ua) || /Edg\//i.test(ua);
    const shouldPreOpen = preOpenWindow === undefined ? isChromium && !isFirefox : preOpenWindow;
    let preOpenedWindow: Window | null = null;
    if (shouldPreOpen) {
        try {
            preOpenedWindow = window.open('', '_blank', 'noopener,noreferrer');
            if (preOpenedWindow?.document) {
                preOpenedWindow.document.title = 'Preparing PDF…';
                preOpenedWindow.document.body.innerHTML =
                    '<p style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 16px;">Preparing PDF…</p>';
            }
        } catch {
            preOpenedWindow = null;
        }
    }

    const [html2canvasModule, jsPdfModule] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const html2canvas = resolveHtml2Canvas(html2canvasModule);
    const jsPDFConstructor = resolveJsPdfConstructor(jsPdfModule);

    if (!jsPDFConstructor) {
        throw new Error('Failed to load jsPDF constructor.');
    }

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

    const pdf = new jsPDFConstructor({ orientation, unit, format, compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const contentWidthPt = Math.max(1, pageWidth - marginPt * 2);
    const contentHeightPt = Math.max(1, pageHeight - marginPt * 2);

    // We render each page at the same width, then slice the canvas by the height that fits per page.
    // To prevent cutting text lines across pages, we try to shift each cut to a nearby blog row.
    const sliceHeightPx = Math.floor((contentHeightPt * canvas.width) / contentWidthPt);
    const estimatedTotalSlices = Math.max(1, Math.ceil(canvas.height / Math.max(1, sliceHeightPx)));

    const fullCtx = canvas.getContext('2d', { willReadFrequently: true } as
        | CanvasRenderingContext2DSettings
        | undefined);

    const slices: Array<{ sy: number; sHeight: number }> = [];
    let sy = 0;
    while (sy < canvas.height) {
        const remaining = canvas.height - sy;
        const desired = Math.min(sliceHeightPx, remaining);

        // Last slice: just take the remaining content.
        if (desired >= remaining) {
            slices.push({ sy, sHeight: remaining });
            break;
        }

        let sHeight = desired;
        if (fullCtx) {
            const desiredBreakY = sy + desired;
            const searchRangePx = 140;
            const minSlicePx = Math.min(desired - 40, 240);
            const regionStartY = Math.max(sy + Math.max(60, minSlicePx), desiredBreakY - searchRangePx);
            const regionHeight = Math.max(0, desiredBreakY - regionStartY);
            if (regionHeight > 0) {
                const breakY = findWhitespaceBreakY(fullCtx, canvas.width, regionStartY, regionHeight);
                if (breakY && breakY > sy + 120) {
                    sHeight = breakY - sy;
                }
            }
        }

        // Tiny overlap reduces visible seams if the break isn't perfectly blog.
        const overlapPx = 2;
        sHeight = Math.min(remaining, Math.max(1, sHeight + overlapPx));
        slices.push({ sy, sHeight });
        sy += sHeight;
    }

    for (let pageIndex = 0; pageIndex < slices.length; pageIndex++) {
        const { sy, sHeight } = slices[pageIndex];

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

        onProgress?.(0.35 + (0.6 * (pageIndex + 1)) / Math.max(1, Math.max(slices.length, estimatedTotalSlices)));
    }

    onProgress?.(0.98);
    // Some browsers/webviews silently block downloads after async work.
    // We generate a Blob and try multiple download strategies.
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    let didAttemptDownload = false;
    let lastError: unknown;

    // 1) file-saver (best on most desktop browsers)
    try {
        const { saveAs } = await import('file-saver');
        saveAs(blob, finalName);
        didAttemptDownload = true;
    } catch (e) {
        lastError = e;
    }

    // 2) Native <a download> (works well in many environments; file-saver internally does similar but can be blocked)
    try {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = finalName;
        a.rel = 'noopener';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        didAttemptDownload = true;
    } catch (e) {
        lastError = e;
    }

    // 3) Navigate pre-opened window (Chrome-friendly) or open a new tab so user can manually save/share
    try {
        if (preOpenedWindow && !preOpenedWindow.closed) {
            preOpenedWindow.location.href = blobUrl;
            didAttemptDownload = true;
        } else if (!didAttemptDownload && preOpenWindow !== false) {
            window.open(blobUrl, '_blank', 'noopener,noreferrer');
            didAttemptDownload = true;
        }
    } catch (e) {
        lastError = e;
    } finally {
        // Give the browser a bit of time to start reading the blob URL before revoking it.
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
    }

    // 4) Ultimate fallback: jsPDF's own save. If this also gets blocked, surface an error to the caller.
    if (!didAttemptDownload) {
        try {
            pdf.save(finalName);
            didAttemptDownload = true;
        } catch (e) {
            lastError = e;
        }
    }

    if (!didAttemptDownload) {
        throw new Error(
            `PDF was generated but the browser blocked the download. ${
                lastError instanceof Error ? lastError.message : 'Please try another browser.'
            }`,
        );
    }

    onProgress?.(1);
}
