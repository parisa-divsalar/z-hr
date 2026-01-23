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
    | 'languages'
    | 'certificates'
    | 'jobDescription'
    | 'experience'
    | 'additionalInfo';





