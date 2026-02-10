'use client';

import { type FunctionComponent, type MutableRefObject, type ReactNode, useEffect, useMemo, useState } from 'react';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { Box, CardContent, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { lightTheme } from '@/config/theme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';
import { useWizardStore } from '@/store/wizard';

import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import { useResumeEditorController, type ResumeEditorController, type ResumeEditorMode } from './ResumeEditor/hooks/useResumeEditorController';
import { MainCardContainer, ResumeContainer } from './ResumeEditor/styled';
import { extractEmailAndPhone } from './ResumeEditor/utils';

type Props = {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    controller?: ResumeEditorController;
    mode?: ResumeEditorMode;
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    apiUserId?: string | null;
    requestIdOverride?: string | null;
    disableAutoPoll?: boolean;
};

const T4 = {
    pageWidthPx: 794, // A4 @ 96dpi
    pageMinHeightPx: 1123, // A4 @ 96dpi
    leftColPx: 444,
    rightColPx: 350,
    fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
};

function cleanText(value: unknown) {
    return String(value ?? '').trim();
}

function splitName(fullName: string): { first: string; last: string } {
    const raw = cleanText(fullName);
    if (!raw) return { first: '', last: '' };
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return { first: raw, last: '' };
    return { first: parts.slice(0, 1).join(' '), last: parts.slice(1).join(' ') };
}

function firstNonEmpty(list: string[], predicate?: (x: string) => boolean) {
    const arr = Array.isArray(list) ? list : [];
    for (const entry of arr) {
        const v = cleanText(entry);
        if (!v) continue;
        if (predicate && !predicate(v)) continue;
        return v;
    }
    return '';
}

function parseWebsite(ways: string[]) {
    return firstNonEmpty(ways, (x) => /https?:\/\//i.test(x) || /^www\./i.test(x));
}

function parseLinkedIn(ways: string[]) {
    return firstNonEmpty(ways, (x) => /linkedin/i.test(x));
}

function parseUsernameLike(ways: string[]) {
    return firstNonEmpty(ways, (x) => /^@/.test(x) || /\bgithub\b|\bbehance\b|\bdribbble\b|\bx\b|\btwitter\b/i.test(x));
}

function SectionBar({
    title,
    bg,
    fg,
    icon,
}: {
    title: string;
    bg: string;
    fg: string;
    icon?: ReactNode;
}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 3, py: 1.25, backgroundColor: bg }}>
            {icon ? <Box sx={{ color: fg, display: 'flex', alignItems: 'center' }}>{icon}</Box> : null}
            <Typography
                sx={{
                    fontFamily: T4.fontFamily,
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: fg,
                }}
            >
                {title.toUpperCase()}
            </Typography>
        </Box>
    );
}

function ContactRow({
    icon,
    text,
    accent,
    textColor,
}: {
    icon: ReactNode;
    text: string;
    accent: string;
    textColor: string;
}) {
    if (!cleanText(text)) return null;
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Box sx={{ mt: '2px', color: accent, display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <Typography
                sx={{
                    fontFamily: T4.fontFamily,
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: textColor,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

const ResumeEditorTemplate4: FunctionComponent<Props> = ({
    setStage,
    controller,
    mode = 'editor',
    pdfTargetRef,
    apiUserId,
    requestIdOverride,
    disableAutoPoll,
}) => {
    const theme = useTheme();

    // Force Template 4 to use the project's configured LIGHT palette so the resume stays
    // print/PDF-friendly even when the app is in dark mode.
    const p = lightTheme.palette;
    const accent = p.action?.active || p.primary.main;
    const accentText = p.primary.contrastText;
    const neutralText = p.text.primary;
    const subtleText = p.text.secondary;
    const divider = alpha(p.text.primary, 0.12);
    const pageBg = p.background.default;
    const paperBg = p.background.default;
    const darkBlock = p.secondary.main;
    const darkText = p.secondary.contrastText;

    const c = controller ?? useResumeEditorController({ mode, pdfTargetRef, apiUserId, requestIdOverride, disableAutoPoll });
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

    const headerName = useMemo(() => splitName(cleanText(c.profile.fullName)), [c.profile.fullName]);

    const contact = useMemo(() => {
        const ways = Array.isArray(c.contactWays) ? c.contactWays : [];
        const { email, phone } = extractEmailAndPhone(ways);
        return {
            phone: cleanText(c.resolvedPhone || phone),
            email: cleanText(c.resolvedEmail || email),
            website: cleanText(parseWebsite(ways)),
            linkedin: cleanText(parseLinkedIn(ways)),
            handle: cleanText(parseUsernameLike(ways)),
        };
    }, [c.contactWays, c.resolvedEmail, c.resolvedPhone]);

    const headlineLines = useMemo(() => {
        const main = cleanText(c.resolvedMainSkill);
        const skills = (c.skills ?? []).map((x) => cleanText(x)).filter(Boolean);
        const picked: string[] = [];
        if (main) picked.push(main);
        for (const s of skills) {
            if (picked.length >= 3) break;
            if (!picked.some((p) => p.toLowerCase() === s.toLowerCase())) picked.push(s);
        }
        return picked.slice(0, 3);
    }, [c.resolvedMainSkill, c.skills]);

    const visibleSkills = useMemo(() => (c.skills ?? []).map((x) => cleanText(x)).filter(Boolean).slice(0, 10), [c.skills]);
    const visibleEducation = useMemo(() => (c.education ?? []).map((x) => cleanText(x)).filter(Boolean).slice(0, 4), [c.education]);

    const visibleExperiences = useMemo(() => {
        const list = Array.isArray(c.experiences) ? c.experiences : [];
        return list
            .filter((exp) => [exp.company, exp.position, exp.description].some((v) => cleanText(v)))
            .slice(0, 4);
    }, [c.experiences]);

    return (
        <ResumeContainer
            sx={{
                maxWidth: 920,
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
                        boxShadow: { xs: '0 10px 28px rgba(15, 23, 42, 0.12)', sm: '0 18px 60px rgba(15, 23, 42, 0.14)' },
                        border: '1px solid',
                        borderColor: 'rgba(15, 23, 42, 0.12)',
                        backgroundColor: pageBg,
                    }}
                >
                    <MainCardContainer
                        ref={c.pdfRef}
                        sx={{
                            minWidth: 'unset',
                            maxWidth: 'unset',
                            mx: 0,
                            overflow: 'hidden',
                            backgroundColor: paperBg,
                            boxShadow: 'none',
                            borderRadius: 0,
                            mb: 0,
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: `${T4.pageWidthPx}px`,
                                    minHeight: { xs: 'unset', md: `${T4.pageMinHeightPx}px` },
                                    mx: 'auto',
                                    boxSizing: 'border-box',
                                    fontFamily: T4.fontFamily,
                                    backgroundColor: pageBg,
                                }}
                            >
                                {/* Top header (two blocks) */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: `${T4.leftColPx}px ${T4.rightColPx}px` },
                                    }}
                                >
                                    <Box sx={{ backgroundColor: darkBlock, color: darkText, px: 3, py: 3.25 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: T4.fontFamily,
                                                fontSize: 44,
                                                fontWeight: 900,
                                                letterSpacing: '0.02em',
                                                lineHeight: 1.02,
                                            }}
                                        >
                                            {cleanText(headerName.first).toUpperCase() || '—'}
                                        </Typography>
                                        {cleanText(headerName.last) ? (
                                            <Typography
                                                sx={{
                                                    fontFamily: T4.fontFamily,
                                                    fontSize: 44,
                                                    fontWeight: 800,
                                                    letterSpacing: '0.02em',
                                                    lineHeight: 1.02,
                                                    opacity: 0.75,
                                                }}
                                            >
                                                {cleanText(headerName.last).toUpperCase()}
                                            </Typography>
                                        ) : null}
                                    </Box>

                                    <Box sx={{ backgroundColor: accent, color: accentText, px: 3, py: 3.25 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 0.5 }}>
                                            {headlineLines.length ? (
                                                headlineLines.map((line, idx) => (
                                                    <Typography
                                                        key={`${line}-${idx}`}
                                                        sx={{
                                                            fontFamily: T4.fontFamily,
                                                            fontSize: 16,
                                                            fontWeight: 700,
                                                            lineHeight: 1.2,
                                                            opacity: idx === 0 ? 1 : 0.92,
                                                        }}
                                                    >
                                                        {line}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <Typography sx={{ fontFamily: T4.fontFamily, fontSize: 16, fontWeight: 700, opacity: 0.92 }}>
                                                    {' '}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Bar row: PROFILE / CONTACT */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: `${T4.leftColPx}px ${T4.rightColPx}px` },
                                    }}
                                >
                                    <SectionBar title='Profile' bg={accent} fg={accentText} icon={<PersonOutlineOutlinedIcon fontSize='small' />} />
                                    <SectionBar title='Contact' bg={darkBlock} fg={darkText} icon={<PhoneOutlinedIcon fontSize='small' />} />
                                </Box>

                                {/* Main content */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', md: `${T4.leftColPx}px ${T4.rightColPx}px` },
                                        alignItems: 'start',
                                    }}
                                >
                                    {/* Left column */}
                                    <Box
                                        sx={{
                                            borderRight: { md: `1px solid ${divider}` },
                                            pb: { xs: 2, md: 0 },
                                        }}
                                    >
                                        <Box sx={{ px: 3, py: 2.25 }}>
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

                                            <Typography
                                                sx={{
                                                    fontFamily: T4.fontFamily,
                                                    fontSize: 13.5,
                                                    lineHeight: 1.65,
                                                    color: neutralText,
                                                    whiteSpace: 'pre-line',
                                                    overflowWrap: 'anywhere',
                                                }}
                                            >
                                                {cleanText(c.summary) || ' '}
                                            </Typography>
                                        </Box>

                                        <SectionBar title='Experience' bg={accent} fg={accentText} icon={<WorkOutlineOutlinedIcon fontSize='small' />} />

                                        <Box sx={{ px: 3, py: 2.25 }}>
                                            {visibleExperiences.length ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                                                    {visibleExperiences.map((exp) => (
                                                        <Box key={exp.id} sx={{ pb: 2.25, borderBottom: `1px solid ${divider}` }}>
                                                            <Typography
                                                                sx={{
                                                                    fontFamily: T4.fontFamily,
                                                                    fontSize: 16,
                                                                    fontWeight: 900,
                                                                    color: neutralText,
                                                                    lineHeight: 1.2,
                                                                    overflowWrap: 'anywhere',
                                                                }}
                                                            >
                                                                {cleanText(exp.position) || cleanText(exp.company) || '—'}
                                                            </Typography>
                                                            {cleanText(exp.company) ? (
                                                                <Typography
                                                                    sx={{
                                                                        mt: 0.5,
                                                                        fontFamily: T4.fontFamily,
                                                                        fontSize: 13,
                                                                        fontWeight: 700,
                                                                        color: subtleText,
                                                                        overflowWrap: 'anywhere',
                                                                    }}
                                                                >
                                                                    {cleanText(exp.company)}
                                                                </Typography>
                                                            ) : null}
                                                            {cleanText(exp.description) ? (
                                                                <Typography
                                                                    sx={{
                                                                        mt: 1,
                                                                        fontFamily: T4.fontFamily,
                                                                        fontSize: 13.5,
                                                                        lineHeight: 1.65,
                                                                        color: neutralText,
                                                                        whiteSpace: 'pre-line',
                                                                        overflowWrap: 'anywhere',
                                                                    }}
                                                                >
                                                                    {cleanText(exp.description)}
                                                                </Typography>
                                                            ) : null}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontFamily: T4.fontFamily, fontSize: 13.5, color: subtleText }}>
                                                    No experience found.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Right column */}
                                    <Box sx={{ pb: 2 }}>
                                        <Box sx={{ px: 3, py: 2.25 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                                                <ContactRow
                                                    icon={<PhoneOutlinedIcon fontSize='small' />}
                                                    text={contact.phone}
                                                    accent={accent}
                                                    textColor={neutralText}
                                                />
                                                <ContactRow
                                                    icon={<EmailOutlinedIcon fontSize='small' />}
                                                    text={contact.email}
                                                    accent={accent}
                                                    textColor={neutralText}
                                                />
                                                <ContactRow
                                                    icon={<LinkedInIcon fontSize='small' />}
                                                    text={contact.linkedin}
                                                    accent={accent}
                                                    textColor={neutralText}
                                                />
                                                <ContactRow
                                                    icon={<PublicOutlinedIcon fontSize='small' />}
                                                    text={contact.website}
                                                    accent={accent}
                                                    textColor={neutralText}
                                                />
                                                <ContactRow
                                                    icon={<PersonOutlineOutlinedIcon fontSize='small' />}
                                                    text={contact.handle}
                                                    accent={accent}
                                                    textColor={neutralText}
                                                />
                                            </Box>
                                        </Box>

                                        <SectionBar title='Skills' bg={darkBlock} fg={darkText} />
                                        <Box sx={{ px: 3, py: 2.25 }}>
                                            {visibleSkills.length ? (
                                                <Box
                                                    component='ul'
                                                    sx={{
                                                        m: 0,
                                                        pl: 2.25,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 0.75,
                                                        '& li': {
                                                            fontFamily: T4.fontFamily,
                                                            fontSize: 13.5,
                                                            lineHeight: 1.55,
                                                            color: neutralText,
                                                        },
                                                        '& li::marker': { color: accent },
                                                    }}
                                                >
                                                    {visibleSkills.map((skill, idx) => (
                                                        <li key={`${skill}-${idx}`}>{skill}</li>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontFamily: T4.fontFamily, fontSize: 13.5, color: subtleText }}>
                                                    No skills found.
                                                </Typography>
                                            )}
                                        </Box>

                                        <SectionBar title='Education' bg={darkBlock} fg={darkText} />
                                        <Box sx={{ px: 3, py: 2.25 }}>
                                            {visibleEducation.length ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    {visibleEducation.map((block, idx) => (
                                                        <Box key={`${block}-${idx}`} sx={{ pb: 1.5, borderBottom: `1px solid ${divider}` }}>
                                                            {block
                                                                .split(/\r?\n/)
                                                                .map((line) => cleanText(line))
                                                                .filter(Boolean)
                                                                .slice(0, 3)
                                                                .map((line, lineIdx) => (
                                                                    <Typography
                                                                        key={`${line}-${lineIdx}`}
                                                                        sx={{
                                                                            fontFamily: T4.fontFamily,
                                                                            fontSize: lineIdx === 0 ? 15 : 13.25,
                                                                            fontWeight: lineIdx === 0 ? 900 : 600,
                                                                            color: lineIdx === 0 ? neutralText : subtleText,
                                                                            lineHeight: 1.35,
                                                                            overflowWrap: 'anywhere',
                                                                        }}
                                                                    >
                                                                        {line}
                                                                    </Typography>
                                                                ))}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontFamily: T4.fontFamily, fontSize: 13.5, color: subtleText }}>
                                                    No education found.
                                                </Typography>
                                            )}
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

export default ResumeEditorTemplate4;


