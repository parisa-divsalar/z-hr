'use client';

import { type FunctionComponent, type MutableRefObject, type ReactNode, useEffect, useMemo, useState } from 'react';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import { Box, CardContent, Chip, Typography } from '@mui/material';

import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';
import { useWizardStore } from '@/store/wizard';

import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import { useResumeEditorController, type ResumeEditorMode } from './ResumeEditor/hooks/useResumeEditorController';
import { MainCardContainer, ResumeContainer } from './ResumeEditor/styled';
import type { ResumeLanguage } from './ResumeEditor/types';
import { extractEmailAndPhone } from './ResumeEditor/utils';

type Props = {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    mode?: ResumeEditorMode;
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    apiUserId?: string | null;
    requestIdOverride?: string | null;
    disableAutoPoll?: boolean;
};

const T3 = {
    pageWidthPx: 794, // A4 @ 96dpi
    pageMinHeightPx: 1123, // A4 @ 96dpi
    pagePaddingPx: 36,
    teal: '#22B7A7',
    tealDark: '#169C90',
    text: '#111827',
    subtle: '#6B7280',
    rule: '#E5E7EB',
    fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
};

function cleanText(value: unknown) {
    return String(value ?? '').trim();
}

function splitLines(text: string) {
    return text
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
}

function parseLinkedIn(contactWays: string[]) {
    const list = Array.isArray(contactWays) ? contactWays : [];
    const candidate =
        list.find((x) => /linkedin/i.test(String(x ?? ''))) ??
        list.find((x) => /https?:\/\//i.test(String(x ?? ''))) ??
        '';
    return cleanText(candidate);
}

function levelToDots(level: string) {
    const v = level.toLowerCase();
    if (v.includes('native')) return 5;
    if (v.includes('fluent')) return 4;
    if (v.includes('advanced')) return 4;
    if (v.includes('intermediate')) return 3;
    if (v.includes('beginner')) return 2;
    return 3;
}

function interestIcon(label: string) {
    const v = cleanText(label).toLowerCase();
    if (/(video|game)/i.test(v)) return <SportsEsportsOutlinedIcon fontSize='small' />;
    if (/(chat|bot)/i.test(v)) return <SmartToyOutlinedIcon fontSize='small' />;
    if (/(renewable|energy|solar|wind)/i.test(v)) return <EnergySavingsLeafOutlinedIcon fontSize='small' />;
    if (/(artificial|ai|machine|ml)/i.test(v)) return <MemoryOutlinedIcon fontSize='small' />;
    return <LanguageOutlinedIcon fontSize='small' />;
}

function SectionTitle({ title }: { title: string }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography
                sx={{
                    fontFamily: T3.fontFamily,
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: T3.teal,
                }}
            >
                {title.toUpperCase()}
            </Typography>
            <Box sx={{ height: 2, width: '100%', backgroundColor: T3.teal }} />
        </Box>
    );
}

function ContactRow({
    icon,
    text,
}: {
    icon: ReactNode;
    text: string;
}) {
    if (!cleanText(text)) return null;
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ mt: '2px', color: T3.teal }}>{icon}</Box>
            <Typography
                sx={{
                    fontFamily: T3.fontFamily,
                    fontSize: 12,
                    color: T3.text,
                    lineHeight: 1.45,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

function LanguageRow({ lang }: { lang: ResumeLanguage }) {
    const name = cleanText(lang.name);
    if (!name) return null;
    const dots = levelToDots(cleanText(lang.level));
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.text, fontWeight: 600 }}>
                {name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            backgroundColor: idx < dots ? T3.teal : '#BFE9E4',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

const ResumeEditorTemplate3: FunctionComponent<Props> = ({
    setStage,
    mode = 'editor',
    pdfTargetRef,
    apiUserId,
    requestIdOverride,
    disableAutoPoll,
}) => {
    const c = useResumeEditorController({ mode, pdfTargetRef, apiUserId, requestIdOverride, disableAutoPoll });
    const { profile } = useUserProfile();
    const requestId = useWizardStore((state) => state.requestId);
    const [isRefreshWarningOpen, setIsRefreshWarningOpen] = useState<boolean>(mode !== 'preview');

    useEffect(() => {
        if (mode === 'preview') return;
        setIsRefreshWarningOpen(true);
    }, [mode]);

    const handleSubmit = () => {
        if (!c.cvError && !c.saveError) {
            trackEvent('resume_completed', {
                user_id: profile?.id,
                resume_id: requestId,
                timestamp: new Date().toISOString(),
            });
        }
        setStage('MORE_FEATURES');
    };

    const parsedContact = useMemo(() => {
        const ways = Array.isArray(c.contactWays) ? c.contactWays : [];
        const { email, phone } = extractEmailAndPhone(ways);
        const resolvedEmail = cleanText(c.resolvedEmail || email);
        const resolvedPhone = cleanText(c.resolvedPhone || phone);
        const address = ways
            .map((x) => cleanText(x))
            .filter(Boolean)
            .find((x) => /los angeles|ca|street|st\.|road|rd\.|avenue|ave\.|blvd|boulevard|lane|ln\.|drive|dr\.|\d{5}/i.test(x));

        return {
            email: resolvedEmail,
            phone: resolvedPhone,
            address: cleanText(address),
            linkedin: parseLinkedIn(ways),
        };
    }, [c.contactWays, c.resolvedEmail, c.resolvedPhone]);

    const competencyChips = useMemo(() => {
        const items = (c.skills ?? [])
            .map((x) => cleanText(x))
            .filter(Boolean)
            .slice(0, 8);
        return items;
    }, [c.skills]);

    const interests = useMemo(() => {
        const fromAdditional = splitLines(cleanText(c.additionalInfo));
        return fromAdditional.slice(0, 6);
    }, [c.additionalInfo]);

    return (
        <ResumeContainer
            sx={{
                maxWidth: 920,
                backgroundColor: 'grey.100',
                borderRadius: { xs: 2, sm: 3 },
                px: { xs: 1.25, sm: 2 },
                py: { xs: 1.25, sm: 2 },
            }}
        >
            <RefreshDataLossDialog open={isRefreshWarningOpen} onClose={() => setIsRefreshWarningOpen(false)} />

            <Box sx={{ maxWidth: 920, mx: 'auto', overflow: 'visible' }}>
                <Box
                    sx={{
                        overflow: 'hidden',
                        borderRadius: { xs: 2, sm: 3 },
                        boxShadow: {
                            xs: '0 10px 28px rgba(15, 23, 42, 0.12)',
                            sm: '0 18px 60px rgba(15, 23, 42, 0.14)',
                        },
                        border: '1px solid',
                        borderColor: 'rgba(15, 23, 42, 0.12)',
                        backgroundColor: '#fff',
                    }}
                >
                    <MainCardContainer
                        ref={c.pdfRef}
                        sx={{
                            minWidth: 'unset',
                            maxWidth: 'unset',
                            mx: 0,
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            boxShadow: 'none',
                            borderRadius: 0,
                            mb: 0,
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: `${T3.pageWidthPx}px`,
                                    minHeight: { xs: 'unset', md: `${T3.pageMinHeightPx}px` },
                                    mx: 'auto',
                                    boxSizing: 'border-box',
                                    fontFamily: T3.fontFamily,
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{
                                        backgroundColor: T3.teal,
                                        color: '#fff',
                                        px: { xs: 3, md: `${T3.pagePaddingPx}px` },
                                        pt: { xs: 3, md: `${T3.pagePaddingPx}px` },
                                        pb: { xs: 2.5, md: 26 },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: T3.fontFamily,
                                            fontSize: 34,
                                            fontWeight: 900,
                                            lineHeight: 1.05,
                                        }}
                                    >
                                        {cleanText(c.profile.fullName) || '—'}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: T3.fontFamily,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            opacity: 0.95,
                                            mt: 0.5,
                                        }}
                                    >
                                        {cleanText(c.resolvedMainSkill) || ' '}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontFamily: T3.fontFamily,
                                            fontSize: 12,
                                            lineHeight: 1.55,
                                            mt: 1.5,
                                            maxWidth: 640,
                                            opacity: 0.95,
                                            whiteSpace: 'pre-line',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {cleanText(c.summary) || ' '}
                                    </Typography>
                                </Box>

                                <Box sx={{ px: { xs: 3, md: `${T3.pagePaddingPx}px` }, py: { xs: 3, md: `${T3.pagePaddingPx}px` } }}>
                                    <ResumeAlerts
                                        isCvLoading={c.isCvLoading}
                                        cvError={c.cvError}
                                        saveError={c.saveError}
                                        improveError={c.improveError}
                                        downloadError={c.downloadError}
                                        onDismissSaveError={c.clearSaveError}
                                        onDismissImproveError={c.clearImproveError}
                                        onDismissDownloadError={c.clearDownloadError}
                                    />

                                    {/* Body */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
                                            columnGap: { xs: 0, md: 4 },
                                            rowGap: { xs: 3, md: 0 },
                                            alignItems: 'start',
                                        }}
                                    >
                                        {/* Left */}
                                        <Box
                                            sx={{
                                                pr: { md: 3 },
                                                borderRight: { md: `1px solid ${T3.rule}` },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 3,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                                                <ContactRow icon={<EmailOutlinedIcon fontSize='small' />} text={parsedContact.email} />
                                                <ContactRow icon={<PhoneOutlinedIcon fontSize='small' />} text={parsedContact.phone} />
                                                <ContactRow icon={<LocationOnOutlinedIcon fontSize='small' />} text={parsedContact.address} />
                                                <ContactRow icon={<LinkedInIcon fontSize='small' />} text={parsedContact.linkedin} />
                                            </Box>

                                            {!c.isSectionHidden('skills') ? (
                                                <Box>
                                                    <SectionTitle title='Competencies' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {competencyChips.length ? (
                                                            competencyChips.map((label) => (
                                                                <Chip
                                                                    key={label}
                                                                    label={label}
                                                                    size='small'
                                                                    sx={{
                                                                        borderRadius: 999,
                                                                        backgroundColor: T3.teal,
                                                                        color: '#fff',
                                                                        fontFamily: T3.fontFamily,
                                                                        fontSize: 12,
                                                                        fontWeight: 700,
                                                                    }}
                                                                />
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No competencies found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {!c.isSectionHidden('languages') ? (
                                                <Box>
                                                    <SectionTitle title='Languages' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                                                        {c.languages.length ? (
                                                            c.languages.map((lang) => <LanguageRow key={lang.id} lang={lang} />)
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No languages found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            <Box>
                                                <SectionTitle title='Interests' />
                                                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    {interests.length ? (
                                                        interests.map((x, idx) => (
                                                            <Box key={`${x}-${idx}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                <Box sx={{ mt: '2px', color: T3.teal }}>
                                                                    {interestIcon(x)}
                                                                </Box>
                                                                <Typography
                                                                    sx={{
                                                                        fontFamily: T3.fontFamily,
                                                                        fontSize: 12,
                                                                        color: T3.text,
                                                                        lineHeight: 1.45,
                                                                        overflowWrap: 'anywhere',
                                                                    }}
                                                                >
                                                                    {x}
                                                                </Typography>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                            No interests found.
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Right */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            {!c.isSectionHidden('selectedProjects') ? (
                                                <Box>
                                                    <SectionTitle title='Skills Summary' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {c.selectedProjects.length ? (
                                                            c.selectedProjects.map((line, idx) => (
                                                                <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                                                                    <Box
                                                                        sx={{
                                                                            mt: '8px',
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: 999,
                                                                            backgroundColor: T3.teal,
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        sx={{
                                                                            fontFamily: T3.fontFamily,
                                                                            fontSize: 12,
                                                                            color: T3.text,
                                                                            lineHeight: 1.6,
                                                                            whiteSpace: 'pre-line',
                                                                            overflowWrap: 'anywhere',
                                                                        }}
                                                                    >
                                                                        {cleanText(line)}
                                                                    </Typography>
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No skills summary found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {!c.isSectionHidden('certificates') ? (
                                                <Box>
                                                    <SectionTitle title='Certificates' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {c.certificates.length ? (
                                                            c.certificates.map((line, idx) => (
                                                                <Typography
                                                                    key={idx}
                                                                    sx={{
                                                                        fontFamily: T3.fontFamily,
                                                                        fontSize: 12,
                                                                        color: T3.text,
                                                                        lineHeight: 1.6,
                                                                        overflowWrap: 'anywhere',
                                                                    }}
                                                                >
                                                                    {cleanText(line)}
                                                                </Typography>
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No certificates found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {!c.isSectionHidden('education') ? (
                                                <Box>
                                                    <SectionTitle title='Education' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                                        {c.education.length ? (
                                                            c.education.map((line, idx) => (
                                                                <Typography
                                                                    key={idx}
                                                                    sx={{
                                                                        fontFamily: T3.fontFamily,
                                                                        fontSize: 12,
                                                                        color: T3.text,
                                                                        lineHeight: 1.6,
                                                                        overflowWrap: 'anywhere',
                                                                    }}
                                                                >
                                                                    {cleanText(line)}
                                                                </Typography>
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No education found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {!c.isSectionHidden('experience') ? (
                                                <Box>
                                                    <SectionTitle title='Professional Experience' />
                                                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        {c.experiences.filter((exp) =>
                                                            [exp.company, exp.position, exp.description].some((v) => cleanText(v)),
                                                        ).length ? (
                                                            c.experiences
                                                                .filter((exp) =>
                                                                    [exp.company, exp.position, exp.description].some((v) => cleanText(v)),
                                                                )
                                                                .map((exp) => (
                                                                    <Box key={exp.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                        <Typography
                                                                            sx={{
                                                                                fontFamily: T3.fontFamily,
                                                                                fontSize: 13,
                                                                                fontWeight: 800,
                                                                                color: T3.text,
                                                                                lineHeight: 1.35,
                                                                                overflowWrap: 'anywhere',
                                                                            }}
                                                                        >
                                                                            {[cleanText(exp.position), cleanText(exp.company)].filter(Boolean).join(' — ') || '—'}
                                                                        </Typography>
                                                                        {cleanText(exp.description) ? (
                                                                            <Typography
                                                                                sx={{
                                                                                    fontFamily: T3.fontFamily,
                                                                                    fontSize: 12,
                                                                                    color: T3.text,
                                                                                    lineHeight: 1.6,
                                                                                    whiteSpace: 'pre-line',
                                                                                    overflowWrap: 'anywhere',
                                                                                }}
                                                                            >
                                                                                {cleanText(exp.description)}
                                                                            </Typography>
                                                                        ) : null}
                                                                    </Box>
                                                                ))
                                                        ) : (
                                                            <Typography sx={{ fontFamily: T3.fontFamily, fontSize: 12, color: T3.subtle }}>
                                                                No experience found.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : null}

                                            {!c.isSectionHidden('additionalInfo') ? (
                                                <Box>
                                                    <SectionTitle title='Additional Information' />
                                                    <Typography
                                                        sx={{
                                                            mt: 1.5,
                                                            fontFamily: T3.fontFamily,
                                                            fontSize: 12,
                                                            color: T3.text,
                                                            lineHeight: 1.6,
                                                            whiteSpace: 'pre-line',
                                                            overflowWrap: 'anywhere',
                                                        }}
                                                    >
                                                        {cleanText(c.additionalInfo) || ' '}
                                                    </Typography>
                                                </Box>
                                            ) : null}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </MainCardContainer>
                </Box>
            </Box>

            <ResumeFooter
                isPreview={c.isPreview}
                isDownloading={c.isDownloading}
                downloadProgress={c.downloadProgress}
                cvError={c.cvError}
                onDownloadPdf={() => void c.handleDownloadPdf()}
                onSubmit={handleSubmit}
            />
        </ResumeContainer>
    );
};

export default ResumeEditorTemplate3;


