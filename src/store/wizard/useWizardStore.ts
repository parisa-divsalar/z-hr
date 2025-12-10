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
