import JSZip from 'jszip';

import type { AllFileItem, WizardData } from './wizardSchema';

interface BuildWizardZipOptions {
    rootFolderName?: string;
    zipFileName?: string;
}

export const buildWizardSerializable = (wizardData: WizardData): any => {
    const { allFiles } = wizardData;
    const { allFiles: _discard, ...rest } = wizardData as any;

    const fileRefList = (files: any[] | undefined) => {
        if (!Array.isArray(files) || files.length === 0) return [];
        return files
            .map((file) => {
                const directMatch = (allFiles as AllFileItem[]).find((item) => item.kind === 'file' && item.payload === file);
                if (directMatch) return { id: directMatch.id };

                const fileId = (file as any)?.id;
                if (fileId) return { id: String(fileId) };

                return null;
            })
            .filter(Boolean);
    };

    const voiceRefList = (voices: any[] | undefined) => {
        if (!Array.isArray(voices) || voices.length === 0) return [];
        return voices
            .map((voice) => {
                const directMatch = (allFiles as AllFileItem[]).find((item) => item.kind === 'voice' && item.payload === voice);
                if (directMatch) return { id: directMatch.id };

                const voiceId = (voice as any)?.id;
                if (voiceId) return { id: String(voiceId) };

                return null;
            })
            .filter(Boolean);
    };

    /**
     * Backend expects section payloads to reference attachments by id:
     *   files: [{ id: "..." }]
     *   voices: [{ id: "..." }]
     * NOT the raw File/Blob objects (those are shipped as separate zip entries).
     */
    const normalizeSection = (section: any) => ({
        text: section?.text ?? '',
        voices: voiceRefList(section?.voices),
        files: fileRefList(section?.files),
    });

    return {
        ...rest,
        background: normalizeSection((rest as any).background),
        experiences: Array.isArray((rest as any).experiences) ? (rest as any).experiences.map((item: any) => normalizeSection(item)) : [],
        certificates: Array.isArray((rest as any).certificates) ? (rest as any).certificates.map((item: any) => normalizeSection(item)) : [],
        jobDescription: normalizeSection((rest as any).jobDescription),
        additionalInfo: normalizeSection((rest as any).additionalInfo),
        allFilesSummary: (allFiles as AllFileItem[]).map((item) => ({
            id: item.id,
            step: item.step,
            entryIndex: item.entryIndex ?? 0,
            kind: item.kind,
            name: item.name ?? null,
        })),
    };
};

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

    const serializable = buildWizardSerializable(wizardData);

    zip.file('wizard-data.txt', JSON.stringify(serializable, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return { zipBlob, serializable };
};
