import JSZip from 'jszip';
import type { AllFileItem, WizardData } from './wizardSchema';

interface BuildWizardZipOptions {
    rootFolderName?: string;
    zipFileName?: string;
}

export const buildWizardZipBlob = async (
    wizardData: WizardData,
    _options?: BuildWizardZipOptions,
): Promise<{ zipBlob: Blob; serializable: any }> => {
    const zip = new JSZip();
    const { allFiles } = wizardData;

    (allFiles as AllFileItem[]).forEach((item) => {
        if (item.kind === 'file') {
            const file = item.payload as File | undefined;
            if (!file) return;

            const ext = file.name.split('.').pop() || 'bin';
            zip.file(`${item.id}.${ext}`, file);
            return;
        }

        if (item.kind === 'voice') {
            const payload = item.payload as {
                blob?: Blob;
            };

            if (!payload?.blob) return;

            const mime = payload.blob.type || 'audio/webm';
            let ext = 'webm';
            if (mime.includes('wav')) ext = 'wav';
            else if (mime.includes('mp3')) ext = 'mp3';
            else if (mime.includes('ogg')) ext = 'ogg';
            else if (mime.includes('m4a')) ext = 'm4a';

            zip.file(`${item.id}.${ext}`, payload.blob);
        }
    });

    const { allFiles: _discard, ...rest } = wizardData;

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

    zip.file('wizard-data.txt', JSON.stringify(serializable, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return { zipBlob, serializable };
};
