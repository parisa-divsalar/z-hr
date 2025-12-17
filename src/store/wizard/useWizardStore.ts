'use client';
import { create } from 'zustand';

import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import { AllFileItem, wizardSchema, WizardData } from './wizardSchema';

interface BackgroundVoice {
    id: string;
    url: string;
    blob: Blob;
    duration: number;
}

interface WizardStore {
    data: WizardData;
    uploadedFiles: string[];

    /**
     * Runtime copies of background files / voices (used by SelectSkill step).
     */
    backgroundFiles: File[];
    backgroundVoices: BackgroundVoice[];

    setData: (data: WizardData) => void;
    updateField: <K extends keyof WizardData>(field: K, value: WizardData[K]) => void;

    /**
     * Manually append one or more items into `data.allFiles`.
     * Usually you won't need this, because `recomputeAllFiles` builds the list automatically.
     */
    addToAllFiles: (items: AllFileItem | AllFileItem[]) => void;

    /**
     * Rebuild `data.allFiles` from current data sections
     * (background, experiences, certificates, jobDescription, additionalInfo).
     *
     * Every file / voice gets a **unique id** and meta info about where it lives.
     */
    recomputeAllFiles: () => void;

    addFile: (fileName: string) => void;
    removeFile: (fileName: string) => void;

    setBackgroundFiles: (updater: (prev: File[]) => File[]) => void;
    setBackgroundVoices: (updater: (prev: BackgroundVoice[]) => BackgroundVoice[]) => void;

    resetWizard: () => void;
    validate: () => boolean;
    requestId: string | null;
    setRequestId: (requestId: string | null) => void;
}

const initailData: WizardData = {
    fullName: '',
    mainSkill: '',
    dateOfBirth: '',
    //
    visaStatus: '',
    contactWay: [''],
    languages: [],
    //
    background: { text: '', voices: [], files: [] },
    skills: [''],
    //
    experiences: [],
    certificates: [],
    //
    jobDescription: { text: '', voices: [], files: [] },
    additionalInfo: { text: '', voices: [], files: [] },
    //
    allFiles: [],
};

export const useWizardStore = create<WizardStore>((set, get) => ({
    data: initailData,
    uploadedFiles: [],
    backgroundFiles: [],
    backgroundVoices: [],

    setData: (data) => set({ data }),
    updateField: <K extends keyof WizardData>(field: K, value: WizardData[K]) =>
        set((state) => ({
            data: {
                ...state.data,
                [field]: value,
            },
        })),

    addToAllFiles: (items) =>
        set((state) => {
            const itemsArray = Array.isArray(items) ? items : [items];
            return {
                data: {
                    ...state.data,
                    allFiles: [...(state.data.allFiles ?? []), ...itemsArray],
                },
            };
        }),

    recomputeAllFiles: () => {
        const current = get().data;

        const collected: AllFileItem[] = [];

        /**
         * Make sure every File that is part of the wizard data
         * has a **stable unique id**.
         *
         * We attach the id directly onto the File instance so that:
         *  - section data (`background.files`, `experiences[i].files`, ...)
         *    can be logged and still expose the id.
         *  - the same id is reused inside `data.allFiles`.
         */
        const ensureFileId = (file: File): string => {
            const anyFile = file as File & { id?: string };
            if (!anyFile.id) {
                anyFile.id = generateFakeUUIDv4();
            }
            return anyFile.id;
        };

        const pushFile = (step: AllFileItem['step'], file: File, entryIndex?: number) => {
            const stableId = ensureFileId(file);
            collected.push({
                id: stableId,
                step,
                entryIndex,
                kind: 'file',
                name: file.name,
                payload: file,
            });
        };

        const pushVoice = (
            step: AllFileItem['step'],
            voice: { id?: string; url: string; blob: Blob; duration: number },
            entryIndex?: number,
        ) => {
            const stableId = voice.id ?? generateFakeUUIDv4();
            collected.push({
                id: stableId,
                step,
                entryIndex,
                kind: 'voice',
                name: `voice-${stableId}`,
                payload: {
                    ...voice,
                    id: stableId,
                },
            });
        };

        // 1) Background (single section)
        if (current.background) {
            const bg = current.background as any;
            if (Array.isArray(bg.files)) {
                (bg.files as File[]).forEach((file) => pushFile('background', file, 0));
            }
            if (Array.isArray(bg.voices)) {
                (bg.voices as BackgroundVoice[]).forEach((voice) => pushVoice('background', voice, 0));
            }
        }

        if (Array.isArray(current.experiences)) {
            (current.experiences as any[]).forEach((exp, expIndex) => {
                if (Array.isArray(exp?.files)) {
                    (exp.files as File[]).forEach((file: File) => pushFile('experiences', file, expIndex));
                }
                if (Array.isArray(exp?.voices)) {
                    (exp.voices as BackgroundVoice[]).forEach((voice) => pushVoice('experiences', voice, expIndex));
                }
            });
        }

        if (Array.isArray(current.certificates)) {
            (current.certificates as any[]).forEach((cert, certIndex) => {
                if (Array.isArray(cert?.files)) {
                    (cert.files as File[]).forEach((file: File) => pushFile('certificates', file, certIndex));
                }
                if (Array.isArray(cert?.voices)) {
                    (cert.voices as BackgroundVoice[]).forEach((voice) => pushVoice('certificates', voice, certIndex));
                }
            });
        }

        if (current.jobDescription) {
            const jd = current.jobDescription as any;
            if (Array.isArray(jd.files)) {
                (jd.files as File[]).forEach((file) => pushFile('jobDescription', file, 0));
            }
            if (Array.isArray(jd.voices)) {
                (jd.voices as BackgroundVoice[]).forEach((voice) => pushVoice('jobDescription', voice, 0));
            }
        }

        // 5) Additional info (single section)
        if (current.additionalInfo) {
            const add = current.additionalInfo as any;
            if (Array.isArray(add.files)) {
                (add.files as File[]).forEach((file) => pushFile('additionalInfo', file, 0));
            }
            if (Array.isArray(add.voices)) {
                (add.voices as BackgroundVoice[]).forEach((voice) => pushVoice('additionalInfo', voice, 0));
            }
        }

        set({
            data: {
                ...current,
                allFiles: collected,
            },
        });
    },

    requestId: null,
    setRequestId: (requestId) => set({ requestId }),

    addFile: (fileName) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, fileName] })),
    removeFile: (fileName) => set((state) => ({ uploadedFiles: state.uploadedFiles.filter((f) => f !== fileName) })),

    setBackgroundFiles: (updater) =>
        set((state) => ({
            backgroundFiles: updater(state.backgroundFiles),
        })),
    setBackgroundVoices: (updater) =>
        set((state) => ({
            backgroundVoices: updater(state.backgroundVoices),
        })),

    resetWizard: () => set({ data: initailData, uploadedFiles: [], backgroundFiles: [], backgroundVoices: [], requestId: null }),

    validate: () => {
        try {
            wizardSchema.parse(get().data);
            return true;
        } catch {
            return false;
        }
    },
}));
