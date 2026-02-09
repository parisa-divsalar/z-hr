import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Simple file-based database using JSON files (project-root ./data by default)
// NOTE: In this repo the data folder is at <projectRoot>/data, so default to that.
const defaultDataDir = path.resolve(process.cwd(), 'data');
const seedDataDir = path.resolve(process.cwd(), 'data-seed');
const dataDir = process.env.DATABASE_PATH ? path.dirname(process.env.DATABASE_PATH) : defaultDataDir;

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
const learningHubBookmarksFile = path.join(dataDir, 'learning_hub_bookmarks.json');
const moreFeaturesFile = path.join(dataDir, 'more_features.json');
const plansFile = path.join(dataDir, 'plans.json');
const historyFile = path.join(dataDir, 'history.json');
const userStatesFile = path.join(dataDir, 'user_states.json');
const userStateHistoryFile = path.join(dataDir, 'user_state_history.json');
const userStateLogsFile = path.join(dataDir, 'user_state_logs.json');

type HistoryRow = {
    id: string;
    user_id: number;
    name: string;
    date: string;
    Percentage: string;
    position: string;
    level: string;
    title: string;
    Voice: string;
    Photo: string;
    size: string;
    Video: string;
    description: string;
    is_bookmarked?: boolean;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;
};

type LearningHubBookmarkRow = {
    id: string;
    user_id: number;
    course_id: number;
    created_at: string;
    updated_at: string;
};

const defaultUserStates = [
    { id: 1, name: 'Guest', slug: 'guest', order: 1, description: 'Why: The user has not committed yet and is only browsing after arriving from ads, organic search, blog, or referral. Bad guests mean low‑quality signups; good guests mean higher activation with less traffic.\nTeam focus: Clear message, sharp CTA, remove distractions. This is not a sales moment; it is an invitation moment.' },
    { id: 2, name: 'Registered – Not Verified', slug: 'registered-not-verified', order: 2, description: 'Why: Early friction. The user registered but did not verify email/phone, so they are not yet a “real” user. Drop‑off here signals low trust or a painful flow.\nTeam focus: Simplify verification, explain why verification matters. UX and trust matter more than features here.' },
    { id: 3, name: 'Registered – No Resume', slug: 'registered-no-resume', order: 3, description: 'Why: Activation lag. The account exists but no resume has been started. Curiosity is present, but the user is stuck.\nTeam focus: Drive the first action fast, remove extra choices. Push, do not teach.' },
    { id: 4, name: 'Started Resume – Incomplete', slug: 'started-resume-incomplete', order: 4, description: 'Why: The resume was started but abandoned. The user saw value but hit friction (complexity, fatigue, uncertainty). This is the biggest product drop‑off.\nTeam focus: Reduce friction, smart reminders, break the flow into smaller steps. Design beats sales here.' },
    { id: 5, name: 'Free – First Resume Completed', slug: 'free-first-resume-completed', order: 5, description: 'Why: The first resume is completed; this is the real activation moment and the true entry point to the product.\nTeam focus: Celebrate success and show “what’s next.” This is still trust‑building, not selling.' },
    { id: 6, name: 'Free – Activated (Exploring)', slug: 'free-activated-exploring', order: 6, description: 'Why: The user is mentally ready for more value but has not decided to pay.\nTeam focus: Gradually introduce capabilities and show the growth path. Product story matters more than price. Offer light nudges (e.g., interview questions or position suggestions) without pressure.' },
    { id: 7, name: 'Free – Feature Blocked', slug: 'free-feature-blocked', order: 7, description: 'Why: The golden sales moment—hit a locked feature and felt the pain.\nTeam focus: Explain the benefit clearly and connect the feature to the user’s problem. Sales should resolve pain, not advertise.' },
    { id: 8, name: 'Paid – Just Converted', slug: 'paid-just-converted', order: 8, description: 'Why: Prevent buyer’s remorse. The user just paid and is still judging the decision.\nTeam focus: Lead them to their first paid win fast and remove ambiguity. Speed beats features here.' },
    { id: 9, name: 'Paid – Active', slug: 'paid-active', order: 9, description: 'Why: They are using what they paid for, often across multiple resumes.\nTeam focus: Reinforce regular usage and show ROI. Consistency is key.' },
    { id: 10, name: 'Paid – Power User', slug: 'paid-power-user', order: 10, description: 'Why: Highest LTV. Uses advanced tools like Interview and Skill Gap.\nTeam focus: Give special attention and collect feedback. These users are product partners, not just customers.' },
    { id: 11, name: 'Paid – Credit Exhausted', slug: 'paid-credit-exhausted', order: 11, description: 'Why: Wants to continue but has no credits; an active user who hit the limit.\nTeam focus: This user is ready to buy now—be transparent, offer usage‑matched options, and do clean upsell without pressure. Fair and logical sales only.' },
    { id: 12, name: 'Paid – Expired Plan', slug: 'paid-expired-plan', order: 12, description: 'Why: A former paying user whose plan expired (time/system event). They paid before and can return.\nTeam focus: Remind them of past value and the reason to come back. Value nostalgia works here.' },
    { id: 13, name: 'Payment Failed', slug: 'payment-failed', order: 13, description: 'Why: They tried to pay but it failed; bad experience can cause fast churn.\nTeam focus: Human error messaging and fast resolution. Support beats product here.' },
    { id: 14, name: 'Dormant User', slug: 'dormant-user', order: 14, description: 'Why: No activity for a while. Could be free or paid, with or without credits. Reactivation is cheaper than acquisition.\nTeam focus: Bring them back with smart reminders and new value, non‑intrusive messaging. Give a reason to return, not empty notifications. Soft re‑engagement.' },
    { id: 15, name: 'Churn-risk User', slug: 'churn-risk-user', order: 15, description: 'Why: Still around but usage is declining—prevention before the drop.\nTeam focus: Early detection and proactive intervention. Prediction beats treatment here.' },
];

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


const readFile = (filePath: string, defaultValue: any[] = []): any[] => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
        const seedPath = path.join(seedDataDir, path.basename(filePath));
        if (fs.existsSync(seedPath)) {
            const content = fs.readFileSync(seedPath, 'utf-8');
            const parsed = JSON.parse(content);
            try {
                writeFile(filePath, parsed);
            } catch {
                // ignore seed copy errors
            }
            return parsed;
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
    }
    return defaultValue;
};

const writeFile = (filePath: string, data: any[]): void => {
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
                // Ensure every CV row has a stable numeric id (admin panel relies on this).
                const currentId = (cvs[index] as any)?.id;
                if (currentId == null || String(currentId).trim() === '') {
                    const ids = cvs
                        .map((c: any) => Number(c?.id))
                        .filter((n: number) => Number.isFinite(n));
                    const nextId = (ids.length ? Math.max(...ids) : 0) + 1;
                    (cvs[index] as any).id = nextId;
                }
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
        findByCvRequestId: (cvRequestId: string) => {
            const items = readFile(coverLettersFile, []);
            return items
                .filter((c: any) => String(c?.cv_request_id ?? '').trim() === String(cvRequestId ?? '').trim())
                .sort((a: any, b: any) => {
                    const ta = String(a?.created_at ?? a?.updated_at ?? '');
                    const tb = String(b?.created_at ?? b?.updated_at ?? '');
                    return tb.localeCompare(ta);
                });
        },
        findByCvRequestIdAndUserId: (cvRequestId: string, userId: number) => {
            const items = readFile(coverLettersFile, []);
            return items
                .filter((c: any) => String(c?.cv_request_id ?? '').trim() === String(cvRequestId ?? '').trim())
                .filter((c: any) => {
                    const uid = Number(c?.user_id);
                    return Number.isFinite(uid) && uid === Number(userId);
                })
                .sort((a: any, b: any) => {
                    const ta = String(a?.created_at ?? a?.updated_at ?? '');
                    const tb = String(b?.created_at ?? b?.updated_at ?? '');
                    return tb.localeCompare(ta);
                });
        },
        updateByRequestId: (requestId: string, patch: Partial<any>) => {
            const items = readFile(coverLettersFile, []);
            const index = items.findIndex((c: any) => c.request_id === requestId);
            if (index === -1) return null;
            const now = new Date().toISOString();
            items[index] = { ...items[index], ...(patch as any), updated_at: now };
            writeFile(coverLettersFile, items);
            return items[index];
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
        deleteByUserIdAndRequestId: (userId: number, requestId: string) => {
            const wizardData = readFile(wizardDataFile, []);
            const before = wizardData.length;
            const next = wizardData.filter((w: any) => !(Number(w?.user_id) === Number(userId) && String(w?.request_id) === String(requestId)));
            if (next.length === before) return 0;
            writeFile(wizardDataFile, next);
            return before - next.length;
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
        deleteByUserIdAndRequestId: (userId: number, requestId: string) => {
            const drafts = readFile(resumeDraftsFile, []);
            const before = drafts.length;
            const next = drafts.filter((d: any) => !(Number(d?.user_id) === Number(userId) && String(d?.request_id) === String(requestId)));
            if (next.length === before) return 0;
            writeFile(resumeDraftsFile, next);
            return before - next.length;
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
        deleteByDraftId: (draftId: number) => {
            const outputs = readFile(resumeSectionOutputsFile, []);
            const before = outputs.length;
            const next = outputs.filter((o: any) => Number(o?.draft_id) !== Number(draftId));
            if (next.length === before) return 0;
            writeFile(resumeSectionOutputsFile, next);
            return before - next.length;
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
                main_skill: data?.main_skill ?? null,
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
            let updated = 0;
            for (const item of items) {
                const sourceUrl = item.sourceUrl || item.source_url || item.applicationUrl;
                if (!sourceUrl) continue;
                const existingIndex = all.findIndex((j: any) => (j.sourceUrl || j.source_url) === sourceUrl);
                if (existingIndex !== -1) {
                    const existing = all[existingIndex];
                    const nextMainSkill = item?.main_skill ?? null;
                    if (nextMainSkill && existing?.main_skill !== nextMainSkill) {
                        all[existingIndex] = {
                            ...existing,
                            main_skill: nextMainSkill,
                            updated_at: new Date().toISOString(),
                        };
                        updated += 1;
                    }
                    continue;
                }
                maxId += 1;
                all.push({
                    id: maxId,
                    ...item,
                    main_skill: item?.main_skill ?? null,
                    is_active: true,
                    created_at: now,
                    updated_at: now,
                    added_at: now,
                });
                added += 1;
            }
            if (added > 0 || updated > 0) writeFile(jobPositionsFile, all);
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

    learningHubBookmarks: {
        findAll: () => readFile(learningHubBookmarksFile, []),
        findByUserId: (userId: number) => {
            const rows = readFile(learningHubBookmarksFile, []);
            return rows.filter((r: any) => Number(r?.user_id) === Number(userId));
        },
        isBookmarked: (userId: number, courseId: number) => {
            const rows = readFile(learningHubBookmarksFile, []);
            return rows.some((r: any) => Number(r?.user_id) === Number(userId) && Number(r?.course_id) === Number(courseId));
        },
        toggle: (userId: number, courseId: number, isBookmarked?: boolean) => {
            const rows = readFile(learningHubBookmarksFile, []);
            const uid = Number(userId);
            const cid = Number(courseId);
            if (!Number.isFinite(uid) || !Number.isFinite(cid)) return null;

            const idx = rows.findIndex((r: any) => Number(r?.user_id) === uid && Number(r?.course_id) === cid);
            const exists = idx !== -1;
            const next = typeof isBookmarked === 'boolean' ? isBookmarked : !exists;
            const now = new Date().toISOString();

            if (next) {
                if (!exists) {
                    const id =
                        typeof (crypto as any).randomUUID === 'function'
                            ? (crypto as any).randomUUID()
                            : crypto.randomBytes(16).toString('hex');
                    rows.push({
                        id,
                        user_id: uid,
                        course_id: cid,
                        created_at: now,
                        updated_at: now,
                    });
                    writeFile(learningHubBookmarksFile, rows);
                }
                return { course_id: cid, is_bookmarked: true };
            }

            if (exists) {
                rows.splice(idx, 1);
                writeFile(learningHubBookmarksFile, rows);
            }
            return { course_id: cid, is_bookmarked: false };
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
    userStates: {
        findAll: () => readFile(userStatesFile, defaultUserStates),
        findBySlug: (slug: string) => {
            const rows = readFile(userStatesFile, defaultUserStates);
            return rows.find((r: any) => String(r?.slug ?? '').toLowerCase() === String(slug ?? '').toLowerCase()) ?? null;
        },
    },
    userStateHistory: {
        findAll: () => readFile(userStateHistoryFile, []),
        findByUserId: (userId: number) => {
            const rows = readFile(userStateHistoryFile, []);
            return rows.filter((r: any) => Number(r.user_id) === Number(userId));
        },
        append: (data: any) => {
            const rows = readFile(userStateHistoryFile, []);
            const now = new Date().toISOString();
            const newRow = {
                id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'),
                ...data,
                created_at: now,
            };
            rows.push(newRow);
            writeFile(userStateHistoryFile, rows);
            return newRow;
        },
    },
    userStateLogs: {
        findAll: () => readFile(userStateLogsFile, []),
        append: (data: any) => {
            const rows = readFile(userStateLogsFile, []);
            const now = new Date().toISOString();
            const newRow = {
                id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'),
                ...data,
                created_at: now,
            };
            rows.push(newRow);
            writeFile(userStateLogsFile, rows);
            return newRow;
        },
    },
    plans: {
        findAll: () => readFile(plansFile, defaultPlans),
    },
    history: {
        findAll: (): HistoryRow[] => readFile(historyFile, []),
        findByUserId: (userId: number): HistoryRow[] => {
            const rows = readFile(historyFile, []);
            return rows.filter((r: any) => Number(r.user_id) === Number(userId));
        },
        findByUserIdAndId: (userId: number, id: string): HistoryRow | null => {
            const rows = readFile(historyFile, []);
            const row = rows.find((r: any) => r.id === id && Number(r.user_id) === Number(userId));
            return row ?? null;
        },
        upsert: (row: Omit<HistoryRow, 'created_at' | 'updated_at'> & Partial<Pick<HistoryRow, 'created_at' | 'updated_at'>>) => {
            const rows = readFile(historyFile, []);
            const idx = rows.findIndex((r: any) => r.id === row.id && Number(r.user_id) === Number(row.user_id));
            const now = new Date().toISOString();
            if (idx === -1) {
                const created_at = row.created_at ?? now;
                const newRow: HistoryRow = {
                    ...(row as any),
                    created_at,
                    updated_at: row.updated_at ?? created_at,
                };
                rows.push(newRow);
                writeFile(historyFile, rows);
                return newRow;
            }
            rows[idx] = { ...rows[idx], ...(row as any), updated_at: row.updated_at ?? now };
            writeFile(historyFile, rows);
            return rows[idx];
        },
        update: (userId: number, id: string, patch: Partial<HistoryRow>) => {
            const rows = readFile(historyFile, []);
            const idx = rows.findIndex((r: any) => r.id === id && Number(r.user_id) === Number(userId));
            if (idx === -1) return null;
            rows[idx] = { ...rows[idx], ...(patch as any), updated_at: new Date().toISOString() };
            writeFile(historyFile, rows);
            return rows[idx];
        },
        toggleBookmark: (userId: number, id: string, isBookmarked?: boolean): HistoryRow | null => {
            const rows = readFile(historyFile, []);
            const idx = rows.findIndex((r: any) => r.id === id && Number(r.user_id) === Number(userId));
            if (idx === -1) return null;
            const next = typeof isBookmarked === 'boolean' ? isBookmarked : !Boolean(rows[idx].is_bookmarked);
            rows[idx] = { ...rows[idx], is_bookmarked: next, updated_at: new Date().toISOString() };
            writeFile(historyFile, rows);
            return rows[idx];
        },
        markDeleted: (userId: number, id: string): boolean => {
            const rows = readFile(historyFile, []);
            const idx = rows.findIndex((r: any) => r.id === id && Number(r.user_id) === Number(userId));
            if (idx === -1) return false;
            rows[idx] = { ...rows[idx], deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            writeFile(historyFile, rows);
            return true;
        },
        deleteHard: (userId: number, id: string): boolean => {
            const rows = readFile(historyFile, []);
            const before = rows.length;
            const next = rows.filter((r: any) => !(r.id === id && Number(r.user_id) === Number(userId)));
            if (next.length === before) return false;
            writeFile(historyFile, next);
            return true;
        },
    },
};

export function initDatabase() {
    if (!fs.existsSync(usersFile)) writeFile(usersFile, []);
    if (!fs.existsSync(registeredUsersLogFile)) writeFile(registeredUsersLogFile, []);
    if (!fs.existsSync(cvsFile)) writeFile(cvsFile, []);
    if (!fs.existsSync(interviewSessionsFile)) writeFile(interviewSessionsFile, []);
    if (!fs.existsSync(skillsFile)) writeFile(skillsFile, []);
    if (!fs.existsSync(userSkillsFile)) writeFile(userSkillsFile, []);
if (!fs.existsSync(learningHubBookmarksFile)) writeFile(learningHubBookmarksFile, []);
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
    if (!fs.existsSync(historyFile)) writeFile(historyFile, []);
    if (!fs.existsSync(userStatesFile)) writeFile(userStatesFile, defaultUserStates);
    if (!fs.existsSync(userStateHistoryFile)) writeFile(userStateHistoryFile, []);
    if (!fs.existsSync(userStateLogsFile)) writeFile(userStateLogsFile, []);
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

