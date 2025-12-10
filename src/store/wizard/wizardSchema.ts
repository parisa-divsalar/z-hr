// app/store/wizardSchema.ts
import { z } from 'zod';

export const languageSchema = z.object({
    name: z.string().min(1, 'Language name is required'),
    level: z.string().min(1, 'Level is required'),
});

/**
 */
export const sectionSchema = z.object({
    text: z.string(),
    voices: z.array(z.any()),
    files: z.array(z.any()),
});

/**
 * Central registry item for **every uploaded file / voice** in the wizard.
 * - `payload` will contain the actual File object or voice object (with url/blob/duration).
 * - `step` + `entryIndex` tell you this file belongs to which step and (for list-steps) which entry.
 */
export const allFileOwnerStepSchema = z.enum([
    'background',
    'experiences',
    'certificates',
    'jobDescription',
    'additionalInfo',
]);

export const allFileKindSchema = z.enum(['file', 'voice']);

export const allFileItemSchema = z.object({
    id: z.string(),
    /** Which high‑level wizard section this belongs to (background / experiences / ...) */
    step: allFileOwnerStepSchema,
    /**
     * For list‑based sections like `experiences` / `certificates` this is the index
     * of the entry inside that list. Optional for single‑section steps like `background`.
     */
    entryIndex: z.number().int().nonnegative().optional(),
    /** Is this a normal file upload or a recorded voice item */
    kind: allFileKindSchema,
    /** Human‑readable label (e.g. original file name or generated voice label) */
    name: z.string().optional(),
    /**
     * Actual runtime payload:
     *  - for `kind: "file"`  → a `File`
     *  - for `kind: "voice"` → an object with `{ id, url, blob, duration }`
     */
    payload: z.any(),
});

/**
 * Main wizard schema
 */
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
    allFiles: z.array(allFileItemSchema),
});

export type WizardData = z.infer<typeof wizardSchema>;
export type AllFileItem = z.infer<typeof allFileItemSchema>;
