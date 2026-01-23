import { buildHeadline, extractFromHeadline } from './profileSession';

import type { ResumeExperience, ResumeLanguage, ResumeProfile } from './types';

export const createEmptyExperience = (id: number): ResumeExperience => ({
    id,
    company: '',
    position: '',
    description: '',
});

export const createEmptyProfile = (): ResumeProfile => ({
    fullName: '',
    dateOfBirth: '',
    headline: '',
});

export type ProfileEditMeta = {
    visaStatus?: string;
    mainSkill?: string;
    phone?: string;
    email?: string;
};

export type ParsedProfileEdit = {
    profile: ResumeProfile;
    visaStatus: string;
    mainSkill: string;
    phone: string;
    email: string;
};

export const formatProfileEditText = (profile: ResumeProfile, meta?: ProfileEditMeta): string => {
    const extracted = extractFromHeadline(profile?.headline);
    const fullName = String(profile?.fullName ?? '').trim();
    const dateOfBirth = String(profile?.dateOfBirth ?? '').trim();
    const visaStatus = String(meta?.visaStatus ?? extracted.visaStatus ?? '').trim();
    const mainSkill = String(meta?.mainSkill ?? extracted.mainSkill ?? '').trim();
    const phone = String(meta?.phone ?? '').trim();
    const email = String(meta?.email ?? '').trim();

    const visaLine = `Visa Status: ${visaStatus}${mainSkill ? ` • ${mainSkill}` : ''}`.trimEnd();
    const contactBlock = `Phone: ${phone}\nEmail: ${email}`.trimEnd();

    return [fullName, dateOfBirth, visaLine, contactBlock].join('\n\n').trimEnd();
};

export const applyProfileEditText = (text: string): ParsedProfileEdit => {
    const raw = String(text ?? '');
    const lines = raw.split(/\r?\n/).map((l) => l.trim());
    const nonEmpty = lines.filter(Boolean);

    const fullName = String(nonEmpty[0] ?? '').trim();
    const dateOfBirth = String(nonEmpty[1] ?? '').trim();

    let visaStatus = '';
    let mainSkill = '';
    let phone = '';
    let email = '';

    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phoneRegex = /(\+?\d[\d\s\-().]{6,}\d)/;

    const parseVisa = (line: string) => {
        const m =
            line.match(/Visa\s*Status\s*:\s*([^•]+?)(?:\s*•\s*(.*))?$/i) ??
            line.match(/Visa\s*:\s*([^•]+?)(?:\s*•\s*(.*))?$/i);
        if (!m) return;
        visaStatus = String(m[1] ?? '').trim();
        mainSkill = String(m[2] ?? '').trim();
    };

    for (const line of nonEmpty) {
        if (!visaStatus && /visa/i.test(line)) parseVisa(line);

        if (!phone) {
            const m = line.match(/phone\s*:\s*(.*)$/i);
            if (m) phone = String(m[1] ?? '').trim();
        }
        if (!email) {
            const m = line.match(/email\s*:\s*(.*)$/i);
            if (m) email = String(m[1] ?? '').trim();
        }

        if (!email) {
            const m = line.match(emailRegex);
            if (m) email = String(m[0] ?? '').trim();
        }
        if (!phone) {
            const m = line.match(phoneRegex);
            if (m) phone = String(m[0] ?? '').trim();
        }
    }

    if (!visaStatus && !mainSkill) {
        const legacyHeadline = nonEmpty.slice(2).join(' • ');
        const extracted = extractFromHeadline(legacyHeadline);
        visaStatus = extracted.visaStatus;
        mainSkill = extracted.mainSkill;
    }

    const headline = buildHeadline(mainSkill, visaStatus);

    return {
        profile: {
            fullName,
            dateOfBirth,
            headline,
        },
        visaStatus,
        mainSkill,
        phone,
        email,
    };
};

export const normalizeLineList = (value: any): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((v) => (typeof v === 'string' ? v : (v?.value ?? v?.text ?? v?.label ?? '')))
            .map((v) => String(v ?? '').trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/\r?\n|[,;]+/)
            .map((v) => v.trim())
            .filter(Boolean);
    }

    return [];
};

export const formatLineListEditText = (items: string[]): string =>
    items
        .map((x) => String(x ?? '').trim())
        .filter(Boolean)
        .join('\n');

export const applyLineListEditText = (text: string): string[] =>
    String(text ?? '')
        .split(/\r?\n+/)
        .map((x) => x.trim())
        .filter(Boolean);

export const extractEmailAndPhone = (ways: string[]) => {
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phoneRegex = /(\+?\d[\d\s\-().]{6,}\d)/;

    const clean = (raw: string) =>
        String(raw ?? '')
            .trim()
            .replace(/^mailto:/i, '')
            .replace(/^tel:/i, '')
            .replace(/^(email|e-mail)\s*:\s*/i, '')
            .replace(/^(phone|mobile|tel)\s*:\s*/i, '')
            .trim();

    let email = '';
    let phone = '';

    for (const entry of ways) {
        const text = clean(entry);
        if (!email) {
            const match = text.match(emailRegex);
            if (match) email = match[0];
        }
        if (!phone) {
            const match = text.match(phoneRegex);
            if (match) phone = match[0].trim();
        }
        if (email && phone) break;
    }

    return { email, phone };
};

export const applyPhoneEmailToContactWays = (current: string[], phone?: string, email?: string): string[] => {
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phoneRegex = /(\+?\d[\d\s\-().]{6,}\d)/;
    const clean = (raw: string) =>
        String(raw ?? '')
            .trim()
            .replace(/^mailto:/i, '')
            .replace(/^tel:/i, '')
            .replace(/^(email|e-mail)\s*:\s*/i, '')
            .replace(/^(phone|mobile|tel)\s*:\s*/i, '')
            .trim();

    const normalizedPhone = String(phone ?? '').trim();
    const normalizedEmail = String(email ?? '').trim();

    const base = Array.isArray(current) ? current : [];
    const filtered = base.filter((entry) => {
        const text = clean(entry);
        return !(emailRegex.test(text) || phoneRegex.test(text));
    });

    const next: string[] = [...filtered];
    if (normalizedPhone) next.push(normalizedPhone);
    if (normalizedEmail) next.push(normalizedEmail);
    return next;
};

export const extractContactWays = (payload: any): string[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.contactWay,
        payload.contactWays,
        payload.contactMethods,
        payload.contacts,
        payload.contact,
        payload.contactInfo,
        payload.profile?.contactWay,
        payload.profile?.contactMethods,
    ];

    for (const candidate of candidates) {
        const normalized = normalizeLineList(candidate);
        if (normalized.length) return normalized;
    }

    return [];
};

export const normalizeLanguages = (raw: any[]): ResumeLanguage[] => {
    return raw
        .map((entry, index) => {
            const safe = typeof entry === 'object' && entry !== null ? entry : { name: entry };
            const name = String(safe.name ?? safe.language ?? safe.title ?? safe.value ?? '').trim();
            const level = String(safe.level ?? safe.proficiency ?? safe.grade ?? safe.rank ?? '').trim();
            return {
                id: index + 1,
                name,
                level,
            };
        })
        .filter((x) => x.name.length > 0 || x.level.length > 0)
        .map((x, index) => ({ ...x, id: index + 1 }));
};

export const extractLanguages = (payload: any): ResumeLanguage[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.languages,
        payload.languageSkills,
        payload.language_skills,
        payload.profile?.languages,
        payload.profile?.languageSkills,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            const normalized = normalizeLanguages(candidate);
            if (normalized.length) return normalized;
        }
        if (typeof candidate === 'string') {
            const lines = applyLineListEditText(candidate);
            const normalized = normalizeLanguages(lines);
            if (normalized.length) return normalized;
        }
    }

    return [];
};

export const formatLanguagesEditText = (items: ResumeLanguage[]): string => {
    return items
        .map((l) => {
            const name = String(l.name ?? '').trim();
            const level = String(l.level ?? '').trim();
            return [name, level].filter(Boolean).join(' - ');
        })
        .filter(Boolean)
        .join('\n');
};

export const applyLanguagesEditText = (text: string): ResumeLanguage[] => {
    const lines = applyLineListEditText(text);
    const parsed = lines.map((line) => {
        const parts = line.split(/\s*[-–—•|]\s*/).map((p) => p.trim());
        const name = parts[0] ?? '';
        const level = parts.slice(1).join(' ') ?? '';
        return { name, level };
    });
    return normalizeLanguages(parsed);
};

export const extractJobDescriptionText = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.jobDescription?.text ??
        payload.jobDescriptionText ??
        payload.job_description ??
        payload.job_description_text ??
        payload.positionDescription ??
        payload.position_description ??
        payload.description ??
        ''
    );
};

export const extractAdditionalInfoText = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';

    const additionalInfo = (payload as any).additionalInfo;
    if (typeof additionalInfo === 'string') return additionalInfo;

    return (
        additionalInfo?.text ??
        (payload as any).additionalInfoText ??
        (payload as any).additional_info ??
        (payload as any).additional_info_text ??
        (payload as any).otherInfo ??
        (payload as any).otherInformation ??
        (payload as any).extraInfo ??
        (payload as any).notes ??
        ''
    );
};

export const extractCertificateEntries = (payload: any): any[] => {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.certificates)) return payload.certificates;
    if (Array.isArray(payload.certificate)) return payload.certificate;
    if (Array.isArray(payload.certifications)) return payload.certifications;
    if (Array.isArray(payload.profile?.certificates)) return payload.profile.certificates;
    if (Array.isArray(payload.profile?.certifications)) return payload.profile.certifications;
    return [];
};

export const normalizeCertificates = (raw: any[]): string[] => {
    return raw
        .map((entry) => {
            if (typeof entry === 'string') return entry.trim();
            if (!entry || typeof entry !== 'object') return '';
            return String(entry.text ?? entry.title ?? entry.name ?? entry.description ?? entry.summary ?? '').trim();
        })
        .filter(Boolean);
};

export const formatCertificateEditText = (items: string[]): string =>
    items
        .map((x) => String(x ?? '').trim())
        .filter(Boolean)
        .join('\n\n');

export const applyCertificateEditText = (text: string): string[] =>
    String(text ?? '')
        .split(/\n\s*\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

export const formatExperiencePosition = (entry: Record<string, any>) => {
    const title =
        entry?.position ??
        entry?.Position ??
        entry?.title ??
        entry?.Title ??
        entry?.role ??
        entry?.Role ??
        entry?.jobTitle ??
        entry?.job_title ??
        '';
    const startDate = entry?.startDate ?? entry?.from ?? entry?.dateFrom ?? '';
    const endDate = entry?.endDate ?? entry?.to ?? entry?.dateTo ?? '';
    const period = startDate && endDate ? `${startDate} — ${endDate}` : startDate || endDate || '';
    const location = entry?.location ?? entry?.city ?? entry?.country ?? '';

    return [title, period, location].filter(Boolean).join(' • ');
};

export const formatExperienceDescription = (entry: Record<string, any>) => {
    const raw =
        entry?.description ??
        entry?.Description ??
        entry?.text ??
        entry?.Text ??
        entry?.content ??
        entry?.Content ??
        entry?.summary ??
        entry?.Summary ??
        entry?.details ??
        entry?.Details ??
        '';

    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        const nested = (raw as any).text ?? (raw as any).Text ?? (raw as any).content ?? (raw as any).Content;
        return typeof nested === 'string' ? nested : '';
    }

    return typeof raw === 'string' ? raw : '';
};

export const normalizeExperiences = (raw: any[]): ResumeExperience[] =>
    raw.map((entry, index) => {
        const safeEntry = typeof entry === 'object' && entry !== null ? entry : { text: String(entry ?? '').trim() };
        return {
            id: index + 1,
            company: safeEntry.company ?? safeEntry.companyName ?? safeEntry.organization ?? safeEntry.employer ?? '',
            position: formatExperiencePosition(safeEntry),
            description: formatExperienceDescription(safeEntry),
        };
    });

export const extractExperienceEntries = (payload: any): any[] => {
    if (!payload || typeof payload !== 'object') return [];
    const unwrapList = (value: any): any[] | null => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed ? [trimmed] : null;
        }
        if (!value || typeof value !== 'object') return null;
        if (Array.isArray((value as any).items)) return (value as any).items;
        if (Array.isArray((value as any).list)) return (value as any).list;
        if (Array.isArray((value as any).entries)) return (value as any).entries;
        if (Array.isArray((value as any).history)) return (value as any).history;
        if (typeof (value as any).text === 'string' && (value as any).text.trim()) return [value];
        if (typeof (value as any).Text === 'string' && (value as any).Text.trim()) return [value];
        return null;
    };

    const candidates = [
        payload.experiences,
        payload.experience,
        payload.careerHistory,
        payload.positions,

        payload.professionalExperience,
        payload.workExperience,
        payload.workHistory,
        payload.employmentHistory,
        payload.employment,
        payload.profile?.experiences,
        payload.profile?.experience,
        payload.profile?.professionalExperience,
        payload.profile?.workExperience,
    ];

    for (const candidate of candidates) {
        const list = unwrapList(candidate);
        if (list) return list;
    }
    return [];
};

export const ensureMinimumExperiences = (items: ResumeExperience[], minCount = 0): ResumeExperience[] => {
    const normalized = items.map((item, index) => ({ ...item, id: index + 1 }));
    while (normalized.length < minCount) {
        normalized.push(createEmptyExperience(normalized.length + 1));
    }
    return normalized;
};

export const normalizeSkillArray = (value: any): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((skill) => (typeof skill === 'string' ? skill : (skill?.name ?? '')))
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/[,;]/)
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
};

export const extractSkills = (payload: any): string[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.skills,
        payload.skillList,
        payload.skillsList,
        payload.skill_set,
        payload.skills_summary,
    ];

    for (const candidate of candidates) {
        const normalized = normalizeSkillArray(candidate);
        if (normalized.length) {
            return normalized;
        }
    }

    return [];
};

export const extractSummary = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.summary ??
        payload.profile?.summary ??
        payload.background?.text ??
        payload.backgroundText ??
        payload.about ??
        payload.careerSummary ??
        payload.summaryText ??
        ''
    );
};

export const cleanSummaryText = (value: string): string => {
    const normalize = (text: string, seen = new Set<string>()): string => {
        const trimmed = String(text ?? '').trim();
        if (!trimmed) return '';
        if (seen.has(trimmed)) return trimmed;
        seen.add(trimmed);

        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed === 'string') {
                return normalize(parsed, seen);
            }
            if (parsed && typeof parsed === 'object') {
                const candidate =
                    (parsed as any).result ??
                    (parsed as any).text ??
                    (parsed as any).summary ??
                    (parsed as any).value ??
                    (parsed as any).output ??
                    (parsed as any).description ??
                    (parsed as any).body ??
                    (parsed as any).data ??
                    null;
                if (typeof candidate === 'string' && candidate.trim()) {
                    return normalize(candidate, seen);
                }
            }
        } catch {
            // fall through to manual cleanup
        }

        if (trimmed.startsWith('{"result"')) {
            const withoutPrefix = trimmed.replace(/^\s*\{"result"\s*:\s*/i, '');
            const withoutSuffix = withoutPrefix.replace(/\}\s*$/, '');
            const unwrapped = withoutSuffix.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
            if (unwrapped !== trimmed) {
                return normalize(unwrapped, seen);
            }
        }

        return trimmed;
    };

    return normalize(value);
};

export const resolveCvRecord = (raw: any): any | null => {
    const unwrap = (candidate: any) => {
        if (!candidate || typeof candidate !== 'object') return null;
        return (candidate as any).result ?? (candidate as any).data ?? candidate;
    };

    const getTimeKey = (candidate: any): number => {
        if (!candidate || typeof candidate !== 'object') return -1;
        const c: any = candidate;
        const value =
            c.updatedAt ??
            c.updatedDate ??
            c.modifiedAt ??
            c.modifiedDate ??
            c.lastUpdatedAt ??
            c.lastUpdate ??
            c.createdAt ??
            c.createdDate ??
            c.insertDate ??
            c.timestamp ??
            c.time ??
            null;

        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string') {
            const ms = Date.parse(value);
            if (!Number.isNaN(ms)) return ms;
        }
        return -1;
    };

    const hasBody = (candidate: any): boolean => {
        if (!candidate || typeof candidate !== 'object') return false;
        const body = (candidate as any).bodyOfResume ?? (candidate as any).BodyOfResume;
        if (!body) return false;
        if (typeof body === 'string') return body.trim().length > 0;
        if (typeof body === 'object') return Object.keys(body).length > 0;
        return true;
    };

    const pickFromArray = (arr: any[]): any | null => {
        const unwrapped = arr.map(unwrap).filter(Boolean) as any[];
        if (unwrapped.length === 0) return null;

        const bodyCandidates = unwrapped.filter(hasBody);
        const pool = bodyCandidates.length ? bodyCandidates : unwrapped;

        let best = pool[pool.length - 1];
        let bestKey = getTimeKey(best);

        for (const item of pool) {
            const key = getTimeKey(item);
            if (key > bestKey) {
                best = item;
                bestKey = key;
            }
        }

        return best;
    };

    if (Array.isArray(raw)) {
        return pickFromArray(raw);
    }

    const unwrapped = unwrap(raw);
    if (Array.isArray(unwrapped)) {
        return pickFromArray(unwrapped);
    }

    return unwrapped;
};

export const resolveCvPayload = (record: any): any => {
    if (!record || typeof record !== 'object') return {};
    const body = (record as any).bodyOfResume;
    if (body && typeof body === 'object') return body;
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch {
            return record;
        }
    }
    return record;
};

export const buildUpdatedCvPayload = (
    basePayload: any,
    values: {
        profile: ResumeProfile;
        summary: string;
        skills: string[];
        contactWays: string[];
        languages: ResumeLanguage[];
        certificates: string[];
        jobDescription: string;
        additionalInfo: string;
        experiences: ResumeExperience[];
    },
) => {
    const base = basePayload && typeof basePayload === 'object' ? basePayload : {};
    const baseProfile = base.profile && typeof base.profile === 'object' ? base.profile : {};

    const nextProfile = {
        ...baseProfile,
        fullName: values.profile.fullName,
        name: values.profile.fullName,
        dateOfBirth: values.profile.dateOfBirth,
        birthDate: values.profile.dateOfBirth,
        title: values.profile.headline,
        headline: values.profile.headline,
        summary: values.summary,
    };

    const normalizeAdditionalInfo = () => {
        const existing = base.additionalInfo;
        if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
            return { ...existing, text: values.additionalInfo };
        }
        return values.additionalInfo;
    };

    const normalizeJobDescription = () => {
        const existing = base.jobDescription;
        if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
            return { ...existing, text: values.jobDescription };
        }
        return { text: values.jobDescription };
    };

    const nextExperiences = values.experiences.map((exp) => ({
        company: exp.company,
        companyName: exp.company,
        position: exp.position,
        title: exp.position,
        description: exp.description,
    }));

    const next = {
        ...base,
        fullName: values.profile.fullName,
        name: values.profile.fullName,
        dateOfBirth: values.profile.dateOfBirth,
        birthDate: values.profile.dateOfBirth,
        title: values.profile.headline,
        mainSkill: values.profile.headline,
        summary: values.summary,
        skills: values.skills,
        skillList: values.skills,
        contactWays: values.contactWays,
        contactWay: values.contactWays,
        languages: values.languages,
        certificates: values.certificates,
        certifications: values.certificates,
        jobDescription: normalizeJobDescription(),
        jobDescriptionText: values.jobDescription,
        additionalInfo: normalizeAdditionalInfo(),
        additionalInfoText: values.additionalInfo,
        experiences: nextExperiences,
        experience: nextExperiences,
        profile: nextProfile,
    };

    return next;
};

export const formatExperienceEditText = (items: ResumeExperience[]): string => {
    return items
        .map((exp) => (exp.description ?? '').trim())
        .filter(Boolean)
        .join('\n\n');
};

export const applyExperienceEditText = (current: ResumeExperience[], text: string): ResumeExperience[] => {
    const blocks = String(text ?? '')
        .split(/\n\s*\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

    const base = current.length ? current.map((e) => ({ ...e })) : [];
    const maxLen = Math.max(base.length, blocks.length);
    const next: ResumeExperience[] = [];

    for (let i = 0; i < maxLen; i++) {
        const existing = base[i] ?? createEmptyExperience(i + 1);
        next.push({
            ...existing,
            id: i + 1,
            description: blocks[i] ?? '',
        });
    }

    return next.filter((exp) =>
        [exp.company, exp.position, exp.description].some((v) => String(v ?? '').trim().length > 0),
    );
};



