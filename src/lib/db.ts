import fs from 'fs';
import path from 'path';

// Simple file-based database using JSON files (shared with repo-root /data by default)

const repoRootDataDir = path.resolve(process.cwd(), '..', '..', 'data');
const dataDir = process.env.DATABASE_PATH ? path.dirname(process.env.DATABASE_PATH) : repoRootDataDir;

const usersFile = path.join(dataDir, 'users.json');
const registeredUsersLogFile = path.join(dataDir, 'registered_users_log.json');
const cvsFile = path.join(dataDir, 'cvs.json');
const interviewSessionsFile = path.join(dataDir, 'interview_sessions.json');
const skillsFile = path.join(dataDir, 'skills.json');
const userSkillsFile = path.join(dataDir, 'user_skills.json');
const wizardDataFile = path.join(dataDir, 'wizard_data.json');
const resumeDraftsFile = path.join(dataDir, 'resume_drafts.json');
const resumeSectionOutputsFile = path.join(dataDir, 'resume_section_outputs.json');
const coverLettersFile = path.join(dataDir, 'cover_letters.json');
const jobPositionsFile = path.join(dataDir, 'job_positions.json');
const loginLogsFile = path.join(dataDir, 'login_logs.json');
const aiInteractionsFile = path.join(dataDir, 'ai_interactions.json');
const learningHubCoursesFile = path.join(dataDir, 'learning_hub_courses.json');
const moreFeaturesFile = path.join(dataDir, 'more_features.json');
const plansFile = path.join(dataDir, 'plans.json');

const defaultMoreFeatures = [
    {
        id: 1,
        title: 'Job Position Suggestions',
        description: 'Get role matches based on your resume and target industry.',
        coin: 40,
        cards: [
            { id: 1, number: 1, title: 'Top Roles', answer: 'Shortlist positions aligned to your experience.' },
            { id: 2, number: 2, title: 'Company Fit', answer: 'Focus on roles that match your strengths.' },
            { id: 3, number: 3, title: 'Next Steps', answer: 'See recommended actions for each role.' },
        ],
    },
    {
        id: 2,
        title: 'Interview Questions',
        description: 'Practice targeted questions for your role and seniority.',
        coin: 35,
        cards: [
            { id: 1, number: 1, title: 'Behavioral', answer: 'Answer common leadership and teamwork prompts.' },
            { id: 2, number: 2, title: 'Technical', answer: 'Work through skill-specific challenges.' },
            { id: 3, number: 3, title: 'Role Fit', answer: 'Prepare for hiring manager expectations.' },
        ],
    },
    {
        id: 3,
        title: 'Voice Interview Practice',
        description: 'Record answers and get feedback on clarity and pacing.',
        coin: 50,
        cards: [
            { id: 1, number: 1, title: 'Mock Prompts', answer: 'Practice realistic voice interview questions.' },
            { id: 2, number: 2, title: 'Delivery Check', answer: 'Improve tone, speed, and confidence.' },
            { id: 3, number: 3, title: 'Retry Loop', answer: 'Replay, refine, and re-record responses.' },
        ],
    },
    {
        id: 4,
        title: 'Cover Letter',
        description: 'Generate a tailored letter aligned with the job description.',
        coin: 30,
        cards: [
            { id: 1, number: 1, title: 'Key Wins', answer: 'Highlight the most relevant achievements.' },
            { id: 2, number: 2, title: 'Job Match', answer: 'Connect your skills to the role needs.' },
            { id: 3, number: 3, title: 'Final Polish', answer: 'Refine tone and professionalism.' },
        ],
    },
    {
        id: 5,
        title: 'Resume Template',
        description: 'Pick layouts that best present your experience.',
        coin: 25,
        cards: [
            { id: 1, number: 1, title: 'Modern', answer: 'Clean layout focused on impact and results.' },
            { id: 2, number: 2, title: 'Classic', answer: 'Traditional format optimized for ATS.' },
            { id: 3, number: 3, title: 'Creative', answer: 'Visual style for standout applications.' },
        ],
    },
    {
        id: 6,
        title: 'Learning Hub',
        description: 'Access curated learning paths for upskilling.',
        coin: 20,
        cards: [
            { id: 1, number: 1, title: 'Skill Tracks', answer: 'Follow guided lessons by role.' },
            { id: 2, number: 2, title: 'Resources', answer: 'Save courses, articles, and tools.' },
            { id: 3, number: 3, title: 'Progress', answer: 'Track completion and milestones.' },
        ],
    },
    {
        id: 7,
        title: 'Text Interview Practice (Chatbot)',
        description: 'Chat-based interview simulations with instant feedback.',
        coin: 45,
        cards: [
            { id: 1, number: 1, title: 'Live Chat', answer: 'Answer questions in real time.' },
            { id: 2, number: 2, title: 'Feedback', answer: 'Get tips to improve each response.' },
            { id: 3, number: 3, title: 'Confidence', answer: 'Build fluency before real interviews.' },
        ],
    },
    {
        id: 8,
        title: 'Video Interview',
        description: 'Practice camera presence with structured prompts.',
        coin: 55,
        cards: [
            { id: 1, number: 1, title: 'On-Camera', answer: 'Record video answers to sample prompts.' },
            { id: 2, number: 2, title: 'Review', answer: 'Identify clarity, posture, and eye contact.' },
            { id: 3, number: 3, title: 'Improve', answer: 'Iterate until you feel confident.' },
        ],
    },
];

const defaultPlans = [
    {
        id: 1,
        name: 'Starter (Free Plan)',
        best_for: 'Perfect for students & first resume',
        ats_friendly: true,
        with_watermark: true,
        templates: 'default',
        job_description_match: false,
        languages_supported: 'English',
        format: 'PDF',
        ai_resume_builder: 1,
        ai_cover_letter: 0,
        images_input: 0,
        voice_input: 0,
        video_input: 0,
        file_input: 0,
        wizard_edit: 0,
        learning_hub: 0,
        skill_gap: '0',
        voice_interview: 0,
        video_interview: 0,
        question_interview: 0,
        position_suggestion: 0,
        processing_speed: 4,
        price_aed: 0,
        coin: null,
    },
    {
        id: 2,
        name: 'Pro',
        best_for: 'For serious job seekers & career switchers',
        ats_friendly: true,
        with_watermark: false,
        templates: '3 templates',
        job_description_match: true,
        languages_supported: 'English',
        format: 'PDF/Word download',
        ai_resume_builder: 2,
        ai_cover_letter: 1,
        images_input: 3,
        voice_input: 2,
        video_input: 0,
        file_input: 1,
        wizard_edit: 1,
        learning_hub: 2,
        skill_gap: '1 resume',
        voice_interview: 0,
        video_interview: 0,
        question_interview: 1,
        position_suggestion: 1,
        processing_speed: 3,
        price_aed: 100,
        coin: null,
    },
    {
        id: 3,
        name: 'Plus',
        best_for: 'Active job seekers, mid-level professionals, career changers',
        ats_friendly: true,
        with_watermark: false,
        templates: '3 templates',
        job_description_match: true,
        languages_supported: 'English',
        format: 'PDF/Word download',
        ai_resume_builder: 4,
        ai_cover_letter: 4,
        images_input: 8,
        voice_input: 6,
        video_input: 1,
        file_input: 2,
        wizard_edit: 4,
        learning_hub: 4,
        skill_gap: '3 resume',
        voice_interview: 1,
        video_interview: 1,
        question_interview: 3,
        position_suggestion: 5,
        processing_speed: 2,
        price_aed: 250,
        coin: null,
    },
    {
        id: 4,
        name: 'Elite',
        best_for: 'For professionals, power users & international / Dubai career moves',
        ats_friendly: true,
        with_watermark: false,
        templates: '3 templates',
        job_description_match: true,
        languages_supported: 'English',
        format: 'PDF/Word download',
        ai_resume_builder: 6,
        ai_cover_letter: 12,
        images_input: 12,
        voice_input: 10,
        video_input: 3,
        file_input: 4,
        wizard_edit: 4,
        learning_hub: 10,
        skill_gap: '6 resume',
        voice_interview: 2,
        video_interview: 2,
        question_interview: 2,
        position_suggestion: 6,
        processing_speed: 1,
        price_aed: 500,
        coin: null,
    },
];

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const readFile = <T>(filePath: string, defaultValue: T[]): T[] => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
    }
    return defaultValue;
};

const writeFile = <T>(filePath: string, data: T[]): void => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        throw error;
    }
};

export const db = {
    users: {
        findAll: () => readFile(usersFile, []),
        findById: (id: number) => {
            const users = readFile(usersFile, []);
            return users.find((u: any) => u.id === id);
        },
        findByEmail: (email: string) => {
            const users = readFile(usersFile, []);
            return users.find((u: any) => u.email === email);
        },
        create: (data: any) => {
            const users = readFile(usersFile, []);
            const newId = users.length > 0 ? Math.max(...users.map((u: any) => u.id || 0)) + 1 : 1;
            const newUser = {
                id: newId,
                ...data,
                coin: data?.coin ?? 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            users.push(newUser);
            writeFile(usersFile, users);
            return newUser;
        },
        update: (id: number, data: Partial<any>) => {
            const users = readFile(usersFile, []);
            const index = users.findIndex((u: any) => u.id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...data, updated_at: new Date().toISOString() };
                writeFile(usersFile, users);
                return users[index];
            }
            return null;
        },
    },
    registrationLogs: {
        findAll: () => readFile(registeredUsersLogFile, []),
        append: (data: any) => {
            const logs = readFile(registeredUsersLogFile, []);
            const newRow = {
                ...data,
                created_at: new Date().toISOString(),
            };
            logs.push(newRow);
            writeFile(registeredUsersLogFile, logs);
            return newRow;
        },
    },

    loginLogs: {
        findAll: () => readFile(loginLogsFile, []),
        findByUserId: (userId: number) => {
            const logs = readFile(loginLogsFile, []);
            return logs.filter((l: any) => l.user_id === userId);
        },
        append: (data: any) => {
            const logs = readFile(loginLogsFile, []);
            const newRow = {
                ...data,
                created_at: new Date().toISOString(),
            };
            logs.push(newRow);
            writeFile(loginLogsFile, logs);
            return newRow;
        },
    },

    cvs: {
        findAll: () => readFile(cvsFile, []),
        findById: (id: number) => {
            const cvs = readFile(cvsFile, []);
            return cvs.find((c: any) => c.id === id);
        },
        findByRequestId: (requestId: string) => {
            const cvs = readFile(cvsFile, []);
            return cvs.find((c: any) => c.request_id === requestId);
        },
        findByUserId: (userId: number) => {
            const cvs = readFile(cvsFile, []);
            return cvs.filter((c: any) => c.user_id === userId);
        },
        create: (data: any) => {
            const cvs = readFile(cvsFile, []);
            const newId = cvs.length > 0 ? Math.max(...cvs.map((c: any) => c.id || 0)) + 1 : 1;
            const newCv = {
                id: newId,
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            cvs.push(newCv);
            writeFile(cvsFile, cvs);
            return newCv;
        },
        update: (requestId: string, data: Partial<any>) => {
            const cvs = readFile(cvsFile, []);
            const index = cvs.findIndex((c: any) => c.request_id === requestId);
            if (index !== -1) {
                cvs[index] = { ...cvs[index], ...data, updated_at: new Date().toISOString() };
                writeFile(cvsFile, cvs);
                return cvs[index];
            }
            return null;
        },
    },

    coverLetters: {
        findAll: () => readFile(coverLettersFile, []),
        findByRequestId: (requestId: string) => {
            const items = readFile(coverLettersFile, []);
            return items.find((c: any) => c.request_id === requestId);
        },
        upsert: (data: any) => {
            const items = readFile(coverLettersFile, []);
            const existingIndex = items.findIndex((c: any) => c.request_id === data.request_id);
            const now = new Date().toISOString();
            if (existingIndex !== -1) {
                items[existingIndex] = { ...items[existingIndex], ...data, updated_at: now };
                writeFile(coverLettersFile, items);
                return items[existingIndex];
            }
            const newRow = { ...data, created_at: now, updated_at: now };
            items.push(newRow);
            writeFile(coverLettersFile, items);
            return newRow;
        },
    },

    interviewSessions: {
        findAll: () => readFile(interviewSessionsFile, []),
        findById: (id: number) => {
            const sessions = readFile(interviewSessionsFile, []);
            return sessions.find((s: any) => s.id === id);
        },
        create: (data: any) => {
            const sessions = readFile(interviewSessionsFile, []);
            const newId = sessions.length > 0 ? Math.max(...sessions.map((s: any) => s.id || 0)) + 1 : 1;
            const newSession = {
                id: newId,
                ...data,
                status: data.status || 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            sessions.push(newSession);
            writeFile(interviewSessionsFile, sessions);
            return newSession;
        },
    },

    skills: {
        findAll: () => readFile(skillsFile, []),
        findByName: (name: string) => {
            const skills = readFile(skillsFile, []);
            return skills.find((s: any) => s.name === name);
        },
        findByCategory: (category: string) => {
            const skills = readFile(skillsFile, []);
            return skills.filter((s: any) => s.category === category);
        },
        createMany: (items: any[]) => {
            const skills = readFile(skillsFile, []);
            let maxId = skills.length > 0 ? Math.max(...skills.map((s: any) => s.id || 0)) : 0;

            items.forEach((item) => {
                const existing = skills.find((s: any) => s.name === item.name && s.category === item.category);
                if (!existing) {
                    maxId += 1;
                    skills.push({
                        id: maxId,
                        ...item,
                        created_at: new Date().toISOString(),
                    });
                }
            });


            writeFile(skillsFile, skills);
            return skills;
        },
    },

    userSkills: {
        findAll: () => readFile(userSkillsFile, []),
        findByUserId: (userId: number) => {
            const userSkills = readFile(userSkillsFile, []);
            return userSkills.filter((us: any) => us.user_id === userId);
        },
    },

    wizardData: {
        findAll: () => readFile(wizardDataFile, []),
        findByUserId: (userId: number) => {
            const wizardData = readFile(wizardDataFile, []);
            return wizardData.filter((w: any) => w.user_id === userId);
        },
        findByUserIdAndRequestId: (userId: number, requestId: string) => {
            const wizardData = readFile(wizardDataFile, []);
            return wizardData.find((w: any) => w.user_id === userId && w.request_id === requestId);
        },
        upsert: (data: any) => {
            const wizardData = readFile(wizardDataFile, []);
            const existing = wizardData.find((w: any) => w.user_id === data.user_id && w.request_id === data.request_id);
            if (existing) {
                const index = wizardData.indexOf(existing);
                wizardData[index] = { ...existing, ...data, updated_at: new Date().toISOString() };
                writeFile(wizardDataFile, wizardData);
                return wizardData[index];
            }
            const newId = wizardData.length > 0 ? Math.max(...wizardData.map((w: any) => w.id || 0)) + 1 : 1;
            const newWizard = {
                id: newId,
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            wizardData.push(newWizard);
            writeFile(wizardDataFile, wizardData);
            return newWizard;
        },
    },

    resumeDrafts: {
        findAll: () => readFile(resumeDraftsFile, []),
        findById: (id: number) => {
            const drafts = readFile(resumeDraftsFile, []);
            return drafts.find((d: any) => d.id === id);
        },
        findByRequestId: (requestId: string) => {
            const drafts = readFile(resumeDraftsFile, []);
            return drafts.find((d: any) => d.request_id === requestId);
        },
        create: (data: any) => {
            const drafts = readFile(resumeDraftsFile, []);
            const newId = drafts.length > 0 ? Math.max(...drafts.map((d: any) => d.id || 0)) + 1 : 1;
            const newDraft = {
                id: newId,
                ...data,
                status: data.status || 'generating',
                resume_dirty: data.resume_dirty ?? false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            drafts.push(newDraft);
            writeFile(resumeDraftsFile, drafts);
            return newDraft;
        },
        update: (id: number, data: Partial<any>) => {
            const drafts = readFile(resumeDraftsFile, []);
            const index = drafts.findIndex((d: any) => d.id === id);
            if (index !== -1) {
                drafts[index] = { ...drafts[index], ...data, updated_at: new Date().toISOString() };
                writeFile(resumeDraftsFile, drafts);
                return drafts[index];
            }
            return null;
        },
    },

    resumeSectionOutputs: {
        findAll: () => readFile(resumeSectionOutputsFile, []),
        findByDraftId: (draftId: number) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            return outputs.filter((o: any) => o.draft_id === draftId);
        },
        findByDraftIdAndSection: (draftId: number, sectionKey: string) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            return outputs.find((o: any) => o.draft_id === draftId && o.section_key === sectionKey);
        },
        findByInputHash: (inputHash: string) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            return outputs.filter((o: any) => o.input_hash === inputHash);
        },
        create: (data: any) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            const newId = outputs.length > 0 ? Math.max(...outputs.map((o: any) => o.id || 0)) + 1 : 1;
            const newOutput = {
                id: newId,
                draft_id: data.draft_id,
                section_key: data.section_key,
                ai_output_json: data.ai_output_json ?? data.output_json ?? null,
                user_override_json: data.user_override_json ?? null,
                user_override_text: data.user_override_text ?? null,
                effective_output_json: data.effective_output_json ?? data.ai_output_json ?? data.output_json ?? null,
                model: data.model ?? 'gpt-4o',
                input_hash: data.input_hash ?? '',
                generation_mode: data.generation_mode ?? 'default',
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            outputs.push(newOutput);
            writeFile(resumeSectionOutputsFile, outputs);
            return newOutput;
        },
        update: (id: number, data: Partial<any>) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            const index = outputs.findIndex((o: any) => o.id === id);
            if (index !== -1) {
                outputs[index] = { ...outputs[index], ...data, updated_at: new Date().toISOString() };
                writeFile(resumeSectionOutputsFile, outputs);
                return outputs[index];
            }
            return null;
        },
    },

    jobPositions: {
        findAll: () => readFile(jobPositionsFile, []),
        findActive: () => {
            const all = readFile(jobPositionsFile, []);
            return all.filter((j: any) => j.is_active !== false);
        },
        findNewlyAdded: (withinMinutes: number = 5) => {
            const all = readFile(jobPositionsFile, []);
            const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000).toISOString();
            return all.filter((j: any) => (j.added_at || j.created_at) >= cutoff);
        },
        findBySourceUrl: (sourceUrl: string) => {
            const all = readFile(jobPositionsFile, []);
            return all.find((j: any) => j.sourceUrl === sourceUrl || j.source_url === sourceUrl);
        },
        add: (data: any) => {
            const all = readFile(jobPositionsFile, []);
            const newId = all.length > 0 ? Math.max(...all.map((j: any) => j.id || 0)) + 1 : 1;
            const now = new Date().toISOString();
            const row = {
                id: newId,
                ...data,
                is_active: data.is_active !== false,
                created_at: now,
                updated_at: now,
                added_at: now,
            };
            all.push(row);
            writeFile(jobPositionsFile, all);
            return row;
        },
        addMany: (items: any[]) => {
            const all = readFile(jobPositionsFile, []);
            let maxId = all.length > 0 ? Math.max(...all.map((j: any) => j.id || 0)) : 0;
            const now = new Date().toISOString();
            let added = 0;
            for (const item of items) {
                const sourceUrl = item.sourceUrl || item.source_url || item.applicationUrl;
                if (!sourceUrl || all.some((j: any) => (j.sourceUrl || j.source_url) === sourceUrl)) continue;
                maxId += 1;
                all.push({
                    id: maxId,
                    ...item,
                    is_active: true,
                    created_at: now,
                    updated_at: now,
                    added_at: now,
                });
                added += 1;
            }
            if (added > 0) writeFile(jobPositionsFile, all);
            return added;
        },
        update: (id: number, data: Partial<any>) => {
            const all = readFile(jobPositionsFile, []);
            const index = all.findIndex((j: any) => j.id === id);
            if (index !== -1) {
                all[index] = { ...all[index], ...data, updated_at: new Date().toISOString() };
                writeFile(jobPositionsFile, all);
                return all[index];
            }
            return null;
        },
    },

    /** ورودی/خروجی هر تعامل با ChatGPT برای هر کاربر */
    aiInteractions: {
        findAll: () => readFile(aiInteractionsFile, []),
        findByUserId: (userId: number) => {
            const logs = readFile(aiInteractionsFile, []);
            return logs.filter((l: any) => l.user_id === userId);
        },
        append: (data: any) => {
            const logs = readFile(aiInteractionsFile, []);
            const newRow = {
                ...data,
                created_at: new Date().toISOString(),
            };
            logs.push(newRow);
            writeFile(aiInteractionsFile, logs);
            return newRow;
        },
    },

    /** دوره‌های Learning Hub (مشابه job_positions؛ از APIهای خارجی sync می‌شود) */
    learningHubCourses: {
        findAll: () => readFile(learningHubCoursesFile, []),
        findById: (id: number) => {
            const all = readFile(learningHubCoursesFile, []);
            return all.find((c: any) => c.id === id);
        },
        findBySourceUrl: (sourceUrl: string) => {
            const all = readFile(learningHubCoursesFile, []);
            return all.find((c: any) => (c.source_url || c.sourceUrl) === sourceUrl);
        },
        add: (data: any) => {
            const all = readFile(learningHubCoursesFile, []);
            const newId = all.length > 0 ? Math.max(...all.map((c: any) => c.id || 0)) + 1 : 1;
            const now = new Date().toISOString();
            const row = {
                id: newId,
                ...data,
                created_at: now,
                updated_at: now,
            };
            all.push(row);
            writeFile(learningHubCoursesFile, all);
            return row;
        },
        addMany: (items: any[]) => {
            const all = readFile(learningHubCoursesFile, []);
            let maxId = all.length > 0 ? Math.max(...all.map((c: any) => c.id || 0)) : 0;
            const now = new Date().toISOString();
            let added = 0;
            for (const item of items) {
                const sourceUrl = item.source_url || item.sourceUrl;
                if (!sourceUrl || all.some((c: any) => (c.source_url || c.sourceUrl) === sourceUrl)) continue;
                maxId += 1;
                all.push({
                    id: maxId,
                    ...item,
                    created_at: now,
                    updated_at: now,
                });
                added += 1;
            }
            if (added > 0) writeFile(learningHubCoursesFile, all);
            return added;
        },
    },
    moreFeatures: {
        findAll: () => {
            const rows = readFile(moreFeaturesFile, defaultMoreFeatures);
            const seen = new Set<string>();
            const merged: any[] = [];

            const addRow = (row: any) => {
                const key = String(row?.title ?? row?.id ?? '').trim().toLowerCase();
                if (!key || seen.has(key)) return;
                seen.add(key);
                merged.push(row);
            };

            rows.forEach(addRow);
            defaultMoreFeatures.forEach(addRow);

            return merged;
        },
    },
    plans: {
        findAll: () => readFile(plansFile, defaultPlans),
    },
};

export function initDatabase() {
    if (!fs.existsSync(usersFile)) writeFile(usersFile, []);
    if (!fs.existsSync(registeredUsersLogFile)) writeFile(registeredUsersLogFile, []);
    if (!fs.existsSync(cvsFile)) writeFile(cvsFile, []);
    if (!fs.existsSync(interviewSessionsFile)) writeFile(interviewSessionsFile, []);
    if (!fs.existsSync(skillsFile)) writeFile(skillsFile, []);
    if (!fs.existsSync(userSkillsFile)) writeFile(userSkillsFile, []);
    if (!fs.existsSync(wizardDataFile)) writeFile(wizardDataFile, []);
    if (!fs.existsSync(resumeDraftsFile)) writeFile(resumeDraftsFile, []);
    if (!fs.existsSync(resumeSectionOutputsFile)) writeFile(resumeSectionOutputsFile, []);
    if (!fs.existsSync(coverLettersFile)) writeFile(coverLettersFile, []);
    if (!fs.existsSync(jobPositionsFile)) writeFile(jobPositionsFile, []);
    if (!fs.existsSync(loginLogsFile)) writeFile(loginLogsFile, []);
    if (!fs.existsSync(aiInteractionsFile)) writeFile(aiInteractionsFile, []);
    if (!fs.existsSync(learningHubCoursesFile)) writeFile(learningHubCoursesFile, []);
    if (!fs.existsSync(moreFeaturesFile)) writeFile(moreFeaturesFile, defaultMoreFeatures);
    if (!fs.existsSync(plansFile)) writeFile(plansFile, defaultPlans);
}

initDatabase();

if (typeof window === 'undefined') {
    const skills = readFile(skillsFile, []);
    if (skills.length === 0) {
        import('./seed-skills')
            .then(({ seedSkills }) => {
                seedSkills();
            })
            .catch(() => {
                // ignore
            });
    }
}

