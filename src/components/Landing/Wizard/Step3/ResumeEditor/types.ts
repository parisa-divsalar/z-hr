export type ResumeExperience = {
    id: number;
    company: string;
    position: string;
    description: string;
};

export type ResumeLanguage = {
    id: number;
    name: string;
    level: string;
};

export type ResumeProfile = {
    fullName: string;
    dateOfBirth: string;
    headline: string;
};

export type SectionKey =
    | 'summary'
    | 'skills'
    | 'contactWays'
    | 'education'
    | 'languages'
    | 'certificates'
    | 'selectedProjects'
    | 'experience'
    | 'additionalInfo';

export type ImproveOption = 'shorter' | 'longer' | 'creative' | 'formal';



















