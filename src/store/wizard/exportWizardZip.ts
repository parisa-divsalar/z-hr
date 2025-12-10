import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import type { AllFileItem, WizardData } from './wizardSchema';

interface BuildWizardZipOptions {
    rootFolderName?: string;
    zipFileName?: string;
}

export const buildWizardZipBlob = async (wizardData: WizardData, options?: BuildWizardZipOptions): Promise<Blob> => {
    const zip = new JSZip();

    const root = zip;

    const { allFiles } = wizardData;

    (allFiles as AllFileItem[]).forEach((item) => {
        if (item.kind === 'file') {
            const file = item.payload as File | undefined;
            if (!file) return;

            const originalName = file.name;
            const extension = originalName.includes('.') ? originalName.split('.').pop() : 'bin';

            const fileNameOnZip = `${item.id}.${extension}`;

            root.file(fileNameOnZip, file);
            return;
        }

        if (item.kind === 'voice') {
            const payload = item.payload as { id?: string; url: string; blob: Blob; duration: number } | undefined;

            if (!payload || !payload.blob) return;

            const mime = payload.blob.type || 'audio/webm';
            let ext = 'webm';
            if (mime.includes('wav')) ext = 'wav';
            else if (mime.includes('mpeg') || mime.includes('mp3')) ext = 'mp3';
            else if (mime.includes('ogg')) ext = 'ogg';
            else if (mime.includes('m4a') || mime.includes('mp4')) ext = 'm4a';

            const fileNameOnZip = `${item.id}.${ext}`;

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

    root.file('wizard-data.txt', JSON.stringify(serializable, null, 2));

    return zip.generateAsync({ type: 'blob' });
};

export const buildWizardZip = async (wizardData: WizardData, options?: BuildWizardZipOptions): Promise<void> => {
    const rootName = options?.rootFolderName?.trim() || 'nv';
    const zipBlob = await buildWizardZipBlob(wizardData, { ...options, rootFolderName: rootName });
    const zipName = options?.zipFileName?.trim() || `${rootName}.zip`;
    saveAs(zipBlob, zipName);
};
