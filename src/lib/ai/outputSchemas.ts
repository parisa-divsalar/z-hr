import { z } from 'zod';

/**
 * Summary section output schema
 */
export const SummaryOutputSchema = z.object({
    summary: z.string().default(''),
});
export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

/**
 * Technical skills section output schema
 */
export const TechnicalSkillsOutputSchema = z.object({
    technical_skills: z
        .array(
            z.object({
                category: z.string(),
                skills: z.array(z.string()).default([]),
            }),
        )
        .default([]),
});
export type TechnicalSkillsOutput = z.infer<typeof TechnicalSkillsOutputSchema>;

/**
 * Professional experience section output schema
 */
export const ProfessionalExperienceOutputSchema = z.object({
    professional_experience: z
        .array(
            z.object({
                title: z.string().default(''),
                company: z.string().default(''),
                location: z.string().optional(),
                work_mode: z.string().optional(),
                dates: z.string().default(''),
                bullets: z.array(z.string()).default([]),
            }),
        )
        .default([]),
});
export type ProfessionalExperienceOutput = z.infer<typeof ProfessionalExperienceOutputSchema>;

/**
 * Education section output schema
 */
export const EducationOutputSchema = z.object({
    education: z
        .array(
            z.object({
                degree: z.string().default(''),
                institution: z.string().default(''),
                location: z.string().optional(),
                dates: z.string().optional(),
                details: z.array(z.string()).default([]),
            }),
        )
        .default([]),
});
export type EducationOutput = z.infer<typeof EducationOutputSchema>;

/**
 * Certification section output schema
 */
export const CertificationOutputSchema = z.object({
    certifications: z
        .array(
            z.object({
                title: z.string().default(''),
                issuer: z.string().default(''),
                issue_date: z.string().optional(),
                expiration_date: z.string().optional(),
                credential_id: z.string().optional(),
                verification_url: z.string().optional(),
            }),
        )
        .default([]),
});
export type CertificationOutput = z.infer<typeof CertificationOutputSchema>;

/**
 * Selected projects section output schema
 */
export const SelectedProjectsOutputSchema = z.object({
    selected_projects: z
        .array(
            z.object({
                name: z.string().default(''),
                summary: z.string().default(''),
                tech: z.array(z.string()).default([]),
                bullets: z.array(z.string()).default([]),
                link: z.string().optional(),
            }),
        )
        .default([]),
});
export type SelectedProjectsOutput = z.infer<typeof SelectedProjectsOutputSchema>;

/**
 * Language section output schema
 */
export const LanguageOutputSchema = z.object({
    languages: z
        .array(
            z.object({
                language: z.string().default(''),
                level: z.string().default(''),
            }),
        )
        .default([]),
});
export type LanguageOutput = z.infer<typeof LanguageOutputSchema>;

/**
 * Additional information section output schema
 */
export const AdditionalInfoOutputSchema = z.object({
    additional_information: z
        .object({
            visa_status: z.string().optional(),
            location: z.string().optional(),
            work_preference: z.string().optional(),
            contact: z
                .array(
                    z.object({
                        type: z.string(),
                        value: z.string(),
                    }),
                )
                .default([]),
            notes: z.array(z.string()).optional(),
        })
        .default({
            contact: [],
        }),
});
export type AdditionalInfoOutput = z.infer<typeof AdditionalInfoOutputSchema>;

/**
 * Section key enum
 */
export const SectionKey = {
    SUMMARY: 'SUMMARY',
    TECHNICAL_SKILLS: 'TECHNICAL_SKILLS',
    PROFESSIONAL_EXPERIENCE: 'PROFESSIONAL_EXPERIENCE',
    EDUCATION: 'EDUCATION',
    CERTIFICATIONS: 'CERTIFICATIONS',
    SELECTED_PROJECTS: 'SELECTED_PROJECTS',
    LANGUAGES: 'LANGUAGES',
    ADDITIONAL_INFO: 'ADDITIONAL_INFO',
} as const;

export type SectionKeyType = (typeof SectionKey)[keyof typeof SectionKey];

/**
 * Map section keys to their corresponding Zod schemas
 */
export const SectionSchemas = {
    [SectionKey.SUMMARY]: SummaryOutputSchema,
    [SectionKey.TECHNICAL_SKILLS]: TechnicalSkillsOutputSchema,
    [SectionKey.PROFESSIONAL_EXPERIENCE]: ProfessionalExperienceOutputSchema,
    [SectionKey.EDUCATION]: EducationOutputSchema,
    [SectionKey.CERTIFICATIONS]: CertificationOutputSchema,
    [SectionKey.SELECTED_PROJECTS]: SelectedProjectsOutputSchema,
    [SectionKey.LANGUAGES]: LanguageOutputSchema,
    [SectionKey.ADDITIONAL_INFO]: AdditionalInfoOutputSchema,
} as const;

export type SectionOutput =
    | SummaryOutput
    | TechnicalSkillsOutput
    | ProfessionalExperienceOutput
    | EducationOutput
    | CertificationOutput
    | SelectedProjectsOutput
    | LanguageOutput
    | AdditionalInfoOutput;

