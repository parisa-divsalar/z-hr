/**
 * Prompt templates for different use cases
 * 
 * IMPORTANT: All prompts are designed to be ATS-friendly and include job description context
 * when available. Output must always include all CV sections with proper key-value structure.
 */

export const PROMPTS = {
    /**
     * Analyze CV/Resume and extract information
     * Now includes job description for better context-aware analysis
     */
    analyzeCV: (cvText: string, jobDescription?: string) => `
You are an expert HR and CV analyzer specializing in ATS (Applicant Tracking System) optimization.
Analyze the following CV/Resume and extract structured information.

${jobDescription ? `TARGET JOB DESCRIPTION (use this to prioritize relevant information):
${jobDescription}

IMPORTANT: When extracting information, prioritize details that match the job description requirements.
` : ''}

CV CONTENT TO ANALYZE:
${cvText}

CRITICAL REQUIREMENTS:
1. Extract ALL information accurately from the CV content
2. If job description is provided, prioritize matching skills, experiences, and qualifications
3. All output must be ATS-friendly (no special characters, proper formatting, standard keywords)
4. Return COMPLETE structured JSON with ALL sections, even if empty

REQUIRED OUTPUT STRUCTURE (all sections must be present):
{
    "personalInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string"
    },
    "summary": "string",
    "technicalSkills": ["string"],
    "professionalExperience": [
        {
            "title": "string",
            "company": "string",
            "dates": "string",
            "bullets": ["string"]
        }
    ],
    "education": [
        {
            "degree": "string",
            "institution": "string",
            "location": "string",
            "dates": "string",
            "details": ["string"]
        }
    ],
    "certifications": [
        {
            "title": "string",
            "issuer": "string",
            "issue_date": "string"
        }
    ],
    "selectedProjects": [
        {
            "name": "string",
            "summary": "string",
            "tech": ["string"],
            "bullets": ["string"],
            "link": "string"
        }
    ],
    "languages": [
        {
            "language": "string",
            "level": "string"
        }
    ],
    "additionalInfo": {
        "notes": ["string"]
    }
}

IMPORTANT NOTES:
- If a section has no data, return empty array [] or empty object {}
- All text must be ATS-friendly (no emojis, special formatting, or non-standard characters)
- Use standard industry keywords and terminology
- Dates should be in consistent format (MM/YYYY or MM/DD/YYYY)
- Skills should be specific and match industry standards
`,

    /**
     * Improve CV/Resume text
     * Now includes job description for context-aware improvement
     */
    improveCV: (section: string, context?: string, jobDescription?: string) => `
You are an expert ATS-optimized CV/Resume writer. Improve the following section to make it professional, impactful, and ATS-friendly.

${jobDescription ? `TARGET JOB DESCRIPTION (tailor the improvement to match these requirements):
${jobDescription}

IMPORTANT: Use keywords from the job description naturally in the improved text.
` : ''}

${context ? `CONTEXT (additional information about this section):
${context}

` : ''}SECTION TO IMPROVE:
${section}

REQUIREMENTS FOR IMPROVEMENT:
1. Use strong action verbs (developed, implemented, managed, led, etc.)
2. Quantify achievements with numbers, percentages, or metrics where possible
3. Include relevant keywords from job description (if provided)
4. Keep it concise and clear (ATS systems prefer clear, scannable text)
5. Use professional, industry-standard terminology
6. Remove any informal language, emojis, or special characters
7. Ensure ATS compatibility (standard formatting, no tables, no graphics)

OUTPUT FORMAT:
Return ONLY the improved text without any explanations, markdown formatting, or additional commentary.
The output should be ready to paste directly into a CV section.
`,

    /**
     * Improve and re-classify a full resume (structured JSON).
     * 
     * ENHANCED: Now includes job description and returns complete structured output
     * with all CV sections properly labeled and ATS-optimized.
     * 
     * Key requirement: if the user put items in the wrong section (e.g. education lines inside certifications),
     * you must move them into the correct section and remove them from the wrong one.
     */
    improveStructuredResume: (params: { 
        resume: unknown; 
        mode?: 'analysis' | 'sections_text' | 'auto';
        jobDescription?: string;
        structuredInput?: {
            personalInfo?: any;
            summary?: any;
            technicalSkills?: any;
            professionalExperience?: any;
            education?: any;
            certifications?: any;
            selectedProjects?: any;
            languages?: any;
            additionalInfo?: any;
        };
    }) => {
        const { resume, mode = 'auto', jobDescription, structuredInput } = params;
        
        // Build labeled input data structure
        const labeledInput = structuredInput ? `
LABELED INPUT DATA (each section is clearly marked with its source):

[PERSONAL_INFO_SECTION]
${JSON.stringify(structuredInput.personalInfo || {}, null, 2)}

[SUMMARY_SECTION]
${JSON.stringify(structuredInput.summary || {}, null, 2)}

[TECHNICAL_SKILLS_SECTION]
${JSON.stringify(structuredInput.technicalSkills || [], null, 2)}

[PROFESSIONAL_EXPERIENCE_SECTION]
${JSON.stringify(structuredInput.professionalExperience || [], null, 2)}

[EDUCATION_SECTION]
${JSON.stringify(structuredInput.education || [], null, 2)}

[CERTIFICATIONS_SECTION]
${JSON.stringify(structuredInput.certifications || [], null, 2)}

[SELECTED_PROJECTS_SECTION]
${JSON.stringify(structuredInput.selectedProjects || [], null, 2)}

[LANGUAGES_SECTION]
${JSON.stringify(structuredInput.languages || [], null, 2)}

[ADDITIONAL_INFO_SECTION]
${JSON.stringify(structuredInput.additionalInfo || {}, null, 2)}
` : '';

        return `
You are an expert ATS-optimized HR and CV editor.
Your task is to analyze, improve, and restructure the provided resume data to create a professional, ATS-friendly CV.

${jobDescription ? `TARGET JOB DESCRIPTION (CRITICAL - use this to optimize all sections):
${jobDescription}

IMPORTANT: 
- Prioritize and emphasize skills, experiences, and qualifications that match the job description
- Use keywords from the job description naturally throughout all sections
- Tailor the summary and experience descriptions to align with job requirements
` : ''}

${labeledInput ? labeledInput : `
RAW INPUT DATA (unstructured - you need to classify and organize):
${JSON.stringify(resume ?? {}, null, 2)}
`}

YOUR TASKS:
1. **Analyze & Classify**: Identify which data belongs to which CV section
2. **Re-classify**: MOVE misplaced content to correct sections (e.g., education from certifications to education)
3. **Improve Wording**: Make all text professional, concise, and ATS-friendly
4. **Optimize for Job**: If job description provided, tailor content to match requirements
5. **Deduplicate**: Remove repeated items across sections
6. **Standardize**: Use consistent formatting, dates, and terminology

CRITICAL RULES:
- If an item belongs to another section, MOVE it there (do not copy - remove from wrong section)
- Never invent facts. If unclear, keep as-is but place in best section
- All arrays must remain arrays (do not convert to free text)
- Preserve existing values when possible, only clean/normalize wording
- ALL sections must be present in output, even if empty
- All text must be ATS-friendly (no emojis, special chars, tables, or graphics)

REQUIRED OUTPUT STRUCTURE (MUST include ALL sections):
{
    "personalInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string"
    },
    "summary": "string",
    "technicalSkills": ["string"],
    "professionalExperience": [
        {
            "title": "string",
            "company": "string",
            "dates": "string",
            "bullets": ["string"]
        }
    ],
    "education": [
        {
            "degree": "string",
            "institution": "string",
            "location": "string",
            "dates": "string",
            "details": ["string"]
        }
    ],
    "certifications": [
        {
            "title": "string",
            "issuer": "string",
            "issue_date": "string"
        }
    ],
    "selectedProjects": [
        {
            "name": "string",
            "summary": "string",
            "tech": ["string"],
            "bullets": ["string"],
            "link": "string"
        }
    ],
    "languages": [
        {
            "language": "string",
            "level": "string"
        }
    ],
    "additionalInfo": {
        "notes": ["string"]
    }
}

MODE HINT: ${mode}

Return ONLY valid JSON matching the structure above. No markdown, no explanations, just the JSON object.
`;
    },

    /**
     * Generate cover letter
     * Enhanced with structured CV data and ATS-friendly output
     */
    generateCoverLetter: (cvData: any, jobDescription: string) => `
You are an expert ATS-optimized cover letter writer. Write a professional, compelling cover letter.

STRUCTURED CV DATA:
${JSON.stringify(cvData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:
1. Highlight relevant experience and skills that match the job description
2. Use keywords from the job description naturally
3. Show genuine enthusiasm for the position
4. Be professional, concise, and ATS-friendly (max 300 words)
5. Address key requirements and qualifications from the job description
6. No emojis, special formatting, or non-standard characters
7. Use standard business letter format

ADDITIONAL ATS NOTES (from internal ATS guidance):
- Keep formatting plain and single-column; avoid tables, text boxes, icons, or images
- Avoid placing important text in headers/footers; keep all content in the main body
- Use standard, recognizable job titles (add a standard title if the original is non-standard)
- Include relevant keywords in both skills and experience context (not just a list)
- Prefer measurable outcomes (numbers/KPIs) where possible
- Use simple, parseable language and clear sectioning

OUTPUT:
Return only the cover letter text, ready to be used in ATS systems.
`,

        /**
         * Audit user state edits (admin changes)
         */
        auditUserStateEdit: (before: any, after: any) => `
You are an expert product analyst and data steward.
Compare the BEFORE and AFTER user state records and produce a change log and merge guidance.

BEFORE:
${JSON.stringify(before ?? {}, null, 2)}

AFTER:
${JSON.stringify(after ?? {}, null, 2)}

REQUIREMENTS:
1. Identify field-level changes (including description/slug/order)
2. Explain the impact on state logic and user flow
3. Provide safe merge guidance (how to apply without breaking logic)
4. Keep it short, structured, and actionable

OUTPUT JSON FORMAT:
{
    "summary": "string",
    "changes": [
        {
            "field": "string",
            "before": "string",
            "after": "string",
            "impact": "low|medium|high",
            "reason": "string"
        }
    ],
    "mergeGuidance": ["string"],
    "suggestedDescription": "string"
}
Return ONLY valid JSON.
`,

    /**
     * Interview questions generation
     * Enhanced with structured CV data and job description context
     */
    generateInterviewQuestions: (position: string, cvData: any, jobDescription?: string) => `
You are an expert interviewer specializing in technical and behavioral assessments.

POSITION: ${position}

${jobDescription ? `JOB DESCRIPTION:
${jobDescription}

` : ''}CANDIDATE CV DATA (structured):
${JSON.stringify(cvData, null, 2)}

GENERATE 5-7 interview questions that:
1. Assess technical skills relevant to the position and job description
2. Evaluate specific experience and achievements from the CV
3. Test problem-solving abilities related to the role
4. Understand motivation and cultural fit
5. Probe areas where the candidate's experience aligns with job requirements

OUTPUT FORMAT:
Return a JSON object with this structure:
{
    "questions": ["question1", "question2", "question3", "question4", "question5", "question6", "question7"]
}

Each question should be:
- Specific to the candidate's background
- Relevant to the position requirements
- Professional and appropriate
- Designed to assess both technical and soft skills
`,

    /**
     * Skill gap analysis
     * Enhanced with structured CV data analysis
     */
    analyzeSkillGap: (cvData: any, jobDescription: string) => `
You are an expert career advisor specializing in ATS optimization and skill matching.

STRUCTURED CV DATA:
${JSON.stringify(cvData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

ANALYSIS TASK:
Compare the candidate's CV data against the job description requirements and identify:
1. Skills that match (already present in CV)
2. Skills that are missing (required by job but not in CV)
3. Recommendations for improvement
4. Overall match percentage

OUTPUT STRUCTURE:
{
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "recommendations": ["string"],
    "matchPercentage": number
}

IMPORTANT:
- Be specific with skill names (use exact terminology from job description)
- Prioritize hard skills and technical requirements
- Provide actionable recommendations
- Match percentage should be calculated based on required vs. present skills
- Consider both explicit skills and implied skills from experience
`,
    deleteResumeSection: (params: { resume: unknown; section: string }) => `
You are an expert ATS resume editor.
Your task is to remove the "${params.section}" section from the resume JSON provided below.

CRITICAL REQUIREMENTS:
- Return valid JSON only (no markdown, no explanations).
- Preserve all other sections exactly as they are.
- If the section does not exist, return the resume unchanged.
- Keep arrays as arrays and objects as objects. Do NOT convert data types.
- Do not invent or add new content.

SECTION REMOVAL RULES:
- summary: set "summary" and "profile.summary" to empty string if they exist.
- skills: set "skills" and "skillList" to empty arrays if they exist.
- contactWays: set "contactWays" and "contactWay" to empty arrays if they exist.
- languages: set "languages" to empty arrays if they exist.
- certificates: set "certificates" and "certifications" to empty arrays if they exist.
- jobDescription: set "jobDescription" (or its "text") and "jobDescriptionText" to empty string if they exist.
- experience: set "experiences" and "experience" to empty arrays if they exist.
- additionalInfo: set "additionalInfo" (or its "text") and "additionalInfoText" to empty string if they exist.

RESUME JSON:
${JSON.stringify(params.resume)}
`,
    editResumeSection: (params: { resume: unknown; section: string; sectionText: unknown }) => `
You are an expert ATS resume editor.
Your task is to update the "${params.section}" section in the resume JSON provided below using the new section content.

CRITICAL REQUIREMENTS:
- Return valid JSON only (no markdown, no explanations).
- Preserve all other sections exactly as they are.
- Do not invent or add new content outside the provided section content.
- Keep arrays as arrays and objects as objects. Do NOT convert data types.

SECTION UPDATE RULES:
- summary: set "summary" and "profile.summary" to the provided text.
- skills: use a string list; update both "skills" and "skillList".
- contactWays: use a string list; update both "contactWays" and "contactWay".
- languages: create array items with "name" and "level". If only names exist, leave level empty.
- certificates: use a string list; update both "certificates" and "certifications".
- jobDescription: update "jobDescription" (or its "text") and "jobDescriptionText".
- experience: update "experiences" and "experience". Use objects with at least "description".
- additionalInfo: update "additionalInfo" (or its "text") and "additionalInfoText".

NEW SECTION CONTENT:
${JSON.stringify(params.sectionText)}

RESUME JSON:
${JSON.stringify(params.resume)}
`,
};

