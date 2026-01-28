/**
 * Prompt templates for different use cases
 */

export const PROMPTS = {
    /**
     * Analyze CV/Resume and extract information
     */
    analyzeCV: (cvText: string) => `
You are an expert HR and CV analyzer. Analyze the following CV/Resume and extract structured information.

CV Content:
${cvText}

Please provide a JSON response with the following structure:
{
    "personalInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string"
    },
    "summary": "string",
    "experience": [
        {
            "company": "string",
            "position": "string",
            "duration": "string",
            "description": "string"
        }
    ],
    "education": [
        {
            "institution": "string",
            "degree": "string",
            "field": "string",
            "year": "string"
        }
    ],
    "skills": ["string"],
    "languages": ["string"],
    "certifications": ["string"]
}
`,

    /**
     * Improve CV/Resume text
     */
    improveCV: (section: string, context?: string) => `
You are an expert CV/Resume writer. Improve the following section of a CV to make it more professional, impactful, and ATS-friendly.

${context ? `Context: ${context}\n` : ''}
Section to improve:
${section}

Provide an improved version that:
1. Uses action verbs
2. Quantifies achievements where possible
3. Is concise and clear
4. Follows professional CV writing standards

Return only the improved text without any explanations or markdown formatting.
`,

    /**
     * Improve and re-classify a full resume (structured JSON).
     *
     * Key requirement: if the user put items in the wrong section (e.g. education lines inside certifications),
     * you must move them into the correct section and remove them from the wrong one.
     */
    improveStructuredResume: (payload: unknown) => `
You are an expert HR and CV editor.
You will receive a resume in JSON. Your job is to:
1) Improve wording (professional, concise, ATS-friendly).
2) Re-classify and MOVE misplaced content into the correct section.
3) Deduplicate repeated items across sections.
4) Keep the same overall schema and return VALID JSON ONLY.

Important rules:
- If an item belongs to another section, MOVE it there (do not copy).
- Never invent facts. If something is unclear, keep it as-is but place it in the best section.
- Keep arrays as arrays; do not convert to free text.
- Preserve existing values when possible; only clean/normalize wording.
- Output MUST match one of these shapes:

Shape A (analysis-style):
{
  "personalInfo": { "name": "string", "email": "string", "phone": "string", "location": "string" },
  "summary": "string",
  "experience": [{ "company": "string", "position": "string", "duration": "string", "description": "string" }],
  "education": [{ "institution": "string", "degree": "string", "field": "string", "year": "string" }],
  "skills": ["string"],
  "languages": ["string"],
  "certifications": ["string"]
}

Shape B (text-by-section):
{
  "summary": "string",
  "experience": "string",
  "education": "string",
  "skills": "string",
  "languages": "string",
  "certifications": "string",
  "contactWays": "string",
  "jobDescription": "string",
  "additionalInfo": "string"
}

Input JSON:
${JSON.stringify(payload ?? {}, null, 2)}
`,

    /**
     * Generate cover letter
     */
    generateCoverLetter: (cvData: any, jobDescription: string) => `
You are an expert cover letter writer. Write a professional cover letter based on the following CV data and job description.

CV Data:
${JSON.stringify(cvData, null, 2)}

Job Description:
${jobDescription}

Write a compelling cover letter that:
1. Highlights relevant experience and skills
2. Shows enthusiasm for the position
3. Is professional and concise (max 300 words)
4. Addresses key requirements from the job description

Return only the cover letter text.
`,

    /**
     * Interview questions generation
     */
    generateInterviewQuestions: (position: string, cvData: any) => `
You are an expert interviewer. Generate relevant interview questions for the following position and candidate.

Position: ${position}

Candidate CV:
${JSON.stringify(cvData, null, 2)}

Generate 5-7 interview questions that:
1. Assess technical skills relevant to the position
2. Evaluate experience and achievements
3. Test problem-solving abilities
4. Understand motivation and cultural fit

Return a JSON array of questions:
["question1", "question2", ...]
`,

    /**
     * Skill gap analysis
     */
    analyzeSkillGap: (cvData: any, jobDescription: string) => `
You are an expert career advisor. Analyze the skill gap between a candidate's CV and a job description.

CV Data:
${JSON.stringify(cvData, null, 2)}

Job Description:
${jobDescription}

Provide a JSON response:
{
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "recommendations": ["string"],
    "matchPercentage": number
}
`,
};

