// app/store/wizardSchema.ts
import { z } from 'zod';

export const languageSchema = z.object({
    name: z.string().min(1, 'Language name is required'),
    level: z.string().min(1, 'Level is required'),
});

export const sectionSchema = z.object({
    text: z.string(),
    voices: z.array(z.string()),
    files: z.array(z.string()),
});

export const wizardSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    mainSkill: z.string().min(1, 'Main skill is required'),
    dateOfBirth: z
        .string()
        .regex(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/, 'Date of birth must be in DD/MM/YYYY format'),
    //
    visaStatus: z.string().min(1, 'Visa status required'),
    contactWay: z.array(z.string().min(1)).min(1, 'At least one contact method is required'),
    languages: z.array(languageSchema).min(1, 'At least one language skill is required'),
    //
    background: sectionSchema,
    skills: z.array(z.string()),
    //
    experiences: z.array(sectionSchema),
    certificates: z.array(sectionSchema),
    //
    jobDescription: sectionSchema,
    additionalInfo: sectionSchema,
    //
    allFiles: z.array(z.file()),
});

export type WizardData = z.infer<typeof wizardSchema>;
