import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import type { AllFileItem, WizardData } from './wizardSchema';

interface BuildWizardZipOptions {
    rootFolderName?: string;
    zipFileName?: string;
}

/**
 * Build the wizard zip **as a Blob** (without downloading).
 * This is useful when you want to send the zip file to an API.
 */
export const buildWizardZipBlob = async (
    wizardData: WizardData,
    options?: BuildWizardZipOptions,
): Promise<Blob> => {
    const zip = new JSZip();

    const rootName = options?.rootFolderName?.trim() || 'nv';
    const root = zip.folder(rootName) ?? zip;

    const { allFiles } = wizardData;

    (allFiles as AllFileItem[]).forEach((item) => {
        if (item.kind === 'file') {
            const file = item.payload as File | undefined;
            if (!file) {
                return;
            }

            const safeStep =
                item.step === 'background'
                    ? 'background'
                    : item.step === 'experiences'
                      ? 'experience'
                      : item.step === 'certificates'
                        ? 'certificate'
                        : item.step === 'jobDescription'
                          ? 'job'
                          : 'additional';

            const indexSuffix =
                typeof item.entryIndex === 'number' && Number.isFinite(item.entryIndex) ? `-${item.entryIndex}` : '';

            // Example: experience-0-portfolio.pdf
            const fileNameOnZip = `${safeStep}${indexSuffix}-${file.name}`;

            // JSZip accepts File/Blob directly.
            root.file(fileNameOnZip, file);
            return;
        }

        if (item.kind === 'voice') {
            const payload = item.payload as
                | {
                      id?: string;
                      url: string;
                      blob: Blob;
                      duration: number;
                  }
                | undefined;

            if (!payload || !payload.blob) {
                return;
            }

            const safeStep =
                item.step === 'background'
                    ? 'background'
                    : item.step === 'experiences'
                      ? 'experience'
                      : item.step === 'certificates'
                        ? 'certificate'
                        : item.step === 'jobDescription'
                          ? 'job'
                          : 'additional';

            const indexSuffix =
                typeof item.entryIndex === 'number' && Number.isFinite(item.entryIndex) ? `-${item.entryIndex}` : '';

            const mime = payload.blob.type || 'audio/webm';
            let ext = 'webm';

            if (mime.includes('wav')) ext = 'wav';
            else if (mime.includes('mpeg') || mime.includes('mp3')) ext = 'mp3';
            else if (mime.includes('ogg')) ext = 'ogg';
            else if (mime.includes('m4a') || mime.includes('mp4')) ext = 'm4a';

            const id = payload.id ?? item.id;
            const baseName = `${safeStep}${indexSuffix}-voice-${id}`;
            const fileNameOnZip = `${baseName}.${ext}`;

            root.file(fileNameOnZip, payload.blob);
        }
    });

    const { allFiles: _discardAllFiles, ...rest } = wizardData;

    const serializable = {
        ...rest,
        allFilesSummary: (allFiles as AllFileItem[]).map((item) => ({
            id: item.id,
            step: item.step,
            entryIndex: item.entryIndex ?? null,
            kind: item.kind,
            name: item.name ?? null,
        })),
    };

    const jsonText = JSON.stringify(serializable, null, 2);
    root.file('wizard-data.txt', jsonText);

    return zip.generateAsync({ type: 'blob' });
};

/**
 * Previous behaviour: build the wizard zip and **download** it.
 * This now reuses `buildWizardZipBlob` internally.
 */
export const buildWizardZip = async (
    wizardData: WizardData,
    options?: BuildWizardZipOptions,
): Promise<void> => {
    const rootName = options?.rootFolderName?.trim() || 'nv';
    const zipBlob = await buildWizardZipBlob(wizardData, { ...options, rootFolderName: rootName });
    const zipName = options?.zipFileName?.trim() || `${rootName}.zip`;
    saveAs(zipBlob, zipName);
};
