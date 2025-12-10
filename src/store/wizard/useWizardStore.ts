'use client';
import { create } from 'zustand';

import { WizardData, wizardSchema } from './wizardSchema';

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
     */
    backgroundFiles: File[];
    backgroundVoices: BackgroundVoice[];

    setData: (data: WizardData) => void;
    updateField: <K extends keyof WizardData>(field: K, value: WizardData[K]) => void;
    /**
     */
    addToAllFiles: (items: unknown | unknown[]) => void;
    /** Rebuild allFiles from current data sections (background, experiences, certificates, jobDescription, additionalInfo). */
    recomputeAllFiles: () => void;
    addFile: (fileName: string) => void;
    removeFile: (fileName: string) => void;

    setBackgroundFiles: (updater: (prev: File[]) => File[]) => void;
    setBackgroundVoices: (updater: (prev: BackgroundVoice[]) => BackgroundVoice[]) => void;

    resetWizard: () => void;
    validate: () => boolean;
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
    updateField: (field, value) => set((state) => ({ data: { ...state.data, [field]: value } })),
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

        const collected: unknown[] = [];

        if (current.background) {
            if (Array.isArray((current.background as any).files)) {
                collected.push(...((current.background as any).files as unknown[]));
            }
            if (Array.isArray((current.background as any).voices)) {
                collected.push(...((current.background as any).voices as unknown[]));
            }
        }

        if (Array.isArray(current.experiences)) {
            for (const exp of current.experiences as any[]) {
                if (Array.isArray(exp?.files)) {
                    collected.push(...(exp.files as unknown[]));
                }
                if (Array.isArray(exp?.voices)) {
                    collected.push(...(exp.voices as unknown[]));
                }
            }
        }

        if (Array.isArray(current.certificates)) {
            for (const cert of current.certificates as any[]) {
                if (Array.isArray(cert?.files)) {
                    collected.push(...(cert.files as unknown[]));
                }
                if (Array.isArray(cert?.voices)) {
                    collected.push(...(cert.voices as unknown[]));
                }
            }
        }

        if (current.jobDescription) {
            const jd = current.jobDescription as any;
            if (Array.isArray(jd.files)) {
                collected.push(...(jd.files as unknown[]));
            }
            if (Array.isArray(jd.voices)) {
                collected.push(...(jd.voices as unknown[]));
            }
        }

        if (current.additionalInfo) {
            const add = current.additionalInfo as any;
            if (Array.isArray(add.files)) {
                collected.push(...(add.files as unknown[]));
            }
            if (Array.isArray(add.voices)) {
                collected.push(...(add.voices as unknown[]));
            }
        }

        set({
            data: {
                ...current,
                allFiles: collected,
            },
        });
    },
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

    resetWizard: () => set({ data: initailData, uploadedFiles: [], backgroundFiles: [], backgroundVoices: [] }),

    validate: () => {
        try {
            wizardSchema.parse(get().data);
            return true;
        } catch (error) {
            return false;
        }
    },
}));
