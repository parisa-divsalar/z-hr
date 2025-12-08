'use client';
import { create } from 'zustand';
import { WizardData, wizardSchema } from './wizardSchema';

interface WizardStore {
    data: WizardData;
    uploadedFiles: string[];
    setData: (data: WizardData) => void;
    updateField: <K extends keyof WizardData>(field: K, value: WizardData[K]) => void;
    addFile: (fileName: string) => void;
    removeFile: (fileName: string) => void;
    resetWizard: () => void;
    validate: () => boolean;
}

const initailData = {
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

    setData: (data) => set({ data }),
    updateField: (field, value) => set((state) => ({ data: { ...state.data, [field]: value } })),
    addFile: (fileName) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, fileName] })),
    removeFile: (fileName) => set((state) => ({ uploadedFiles: state.uploadedFiles.filter((f) => f !== fileName) })),
    resetWizard: () => set({ data: initailData, uploadedFiles: [] }),

    validate: () => {
        try {
            wizardSchema.parse(get().data);
            return true;
        } catch (error) {
            return false;
        }
    },
}));
