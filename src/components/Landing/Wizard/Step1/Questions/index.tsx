'use client';

import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import { Divider, IconButton, Stack, Typography, Tooltip } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import PlayArrowIcon from '@/assets/images/icons/button-play.svg';
import PauseIcon from '@/assets/images/icons/button-puse.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import { AIStatus, StageWizard } from '@/components/Landing/type';
import {
    FilePreviewContainer,
    FilesStack,
    FileTypeLabel,
} from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import VideoThumbDialog from '@/components/Landing/Wizard/Step1/Common/VideoThumbDialog';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';

import {
    TopSection,
    MediaRow,
    MediaItem,
    MediaIconBox,
    MiddleSection,
    QuestionList,
    QuestionCard,
    QuestionBadge,
    QuestionTexts,
    BottomSection,
    Container,
} from './styled';

interface QuestionsProps {
    onNext: () => void;
    setAiStatus: (status: AIStatus) => void;
    setStage: (stage: StageWizard) => void;
}

type VoicePayload = { id?: string; url: string; blob: Blob; duration: number };

const formatMmSs = (totalSeconds: number) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0:00';
    const s = Math.floor(totalSeconds % 60);
    const m = Math.floor(totalSeconds / 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

const InlineVoicePlayer: FunctionComponent<{ url: string; duration?: number }> = ({ url, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [metaDuration, setMetaDuration] = useState<number>(duration ?? 0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onTimeUpdate = () => setCurrentTime(el.currentTime || 0);
        const onLoaded = () => setMetaDuration(el.duration || 0);
        const onEnded = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        el.addEventListener('timeupdate', onTimeUpdate);
        el.addEventListener('loadedmetadata', onLoaded);
        el.addEventListener('ended', onEnded);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);

        return () => {
            el.removeEventListener('timeupdate', onTimeUpdate);
            el.removeEventListener('loadedmetadata', onLoaded);
            el.removeEventListener('ended', onEnded);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
        };
    }, []);

    useEffect(() => {
        // reset when url changes
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            } catch {
                // ignore
            }
        }
    }, [url]);

    const toggle = async () => {
        const el = audioRef.current;
        if (!el) return;
        try {
            if (el.paused) {
                await el.play();
            } else {
                el.pause();
            }
        } catch {
            // ignore play errors (autoplay policies, etc.)
        }
    };

    const total = metaDuration || duration || 0;

    return (
        <Stack direction='row' alignItems='center' gap={1} sx={{ width: '100%' }}>
            <IconButton
                onClick={toggle}
                size='small'
                sx={{
                    '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.18)' },
                }}
            >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <Stack direction='row' gap={1} alignItems='baseline'>
                <Typography variant='subtitle1' fontWeight={584} color='text.primary'>
                    {formatMmSs(currentTime)}{' '}
                </Typography>

                <Typography variant='subtitle2' fontWeight={400} color='text.secondary'>
                    {formatMmSs(total)}
                </Typography>
            </Stack>

            <audio ref={audioRef} src={url} preload='metadata' />
        </Stack>
    );
};

const getLowerExtension = (name: string) => {
    const ext = name.split('.').pop();
    return ext ? ext.toLowerCase() : '';
};

const isHeicLike = (file: File): boolean => {
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return type === 'image/heic' || type === 'image/heif' || name.endsWith('.heic') || name.endsWith('.heif');
};

const isRenderableMediaUrl = (value?: string | null): value is string => {
    if (!value) return false;
    return (
        value.startsWith('blob:') ||
        value.startsWith('data:') ||
        value.startsWith('http://') ||
        value.startsWith('https://')
    );
};

const resolveFileFromUnknown = (value: unknown): File | null => {
    if (value instanceof File) return value;
    const maybePayload = (value as any)?.payload;
    if (maybePayload instanceof File) return maybePayload;
    const maybeFile = (value as any)?.file;
    if (maybeFile instanceof File) return maybeFile;
    return null;
};

const resolveUrlFromUnknown = (value: unknown): string | null => {
    const maybeUrl = (value as any)?.url;
    return isRenderableMediaUrl(maybeUrl) ? maybeUrl : null;
};

const tryCreateObjectUrl = (value: unknown): string | null => {
    try {
        if (typeof window === 'undefined') return null;
        if (value instanceof Blob) {
            return URL.createObjectURL(value);
        }
        return null;
    } catch {
        return null;
    }
};

const isImageFile = (file: File) => {
    if (file.type?.startsWith('image/')) return true;
    const ext = getLowerExtension(file.name);
    return [
        'png',
        'jpg',
        'jpeg',
        'jfif',
        'pjpeg',
        'pjp',
        'webp',
        'avif',
        'gif',
        'bmp',
        'svg',
        'ico',
        'apng',
        'tif',
        'tiff',
        'heic',
        'heif',
    ].includes(ext);
};

const isVideoFile = (file: File) => {
    if (file.type?.startsWith('video/')) return true;
    const ext = getLowerExtension(file.name);
    return ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'avi', 'mkv'].includes(ext);
};

const getFileKindLabel = (file: File) => {
    if (isImageFile(file)) return 'Image';
    if (isVideoFile(file)) return 'Video';
    if (file.type?.startsWith('audio/')) return 'Audio';
    return 'File';
};

const SafeImagePreview: FunctionComponent<{ file: File; url?: string | null }> = ({ file, url }) => {
    const [displayUrl, setDisplayUrl] = useState<string | null>(isRenderableMediaUrl(url) ? url : null);
    const createdLocallyRef = useRef<string | null>(null);
    const triedConversionRef = useRef(false);

    useEffect(() => {
        const safeUrl = isRenderableMediaUrl(url) ? url : null;
        triedConversionRef.current = false;

        if (!safeUrl) {
            const local = tryCreateObjectUrl(file);
            createdLocallyRef.current = local;
            setDisplayUrl(local);
            return () => {
                if (local) URL.revokeObjectURL(local);
                createdLocallyRef.current = null;
            };
        }

        setDisplayUrl(safeUrl);
        return;
    }, [file, url]);

    useEffect(() => {
        return () => {
            if (displayUrl && displayUrl !== url && displayUrl !== createdLocallyRef.current) {
                URL.revokeObjectURL(displayUrl);
            }
        };
    }, [displayUrl, url]);

    const tryRefreshOrConvert = async () => {
        if (triedConversionRef.current) return;
        triedConversionRef.current = true;

        const refreshed = tryCreateObjectUrl(file);
        if (refreshed) {
            createdLocallyRef.current = refreshed;
            setDisplayUrl(refreshed);
        }

        if (!isHeicLike(file)) return;

        try {
            const heic2any = (await import('heic2any')).default;
            const output = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
            const blob: Blob = Array.isArray(output) ? output[0] : output;
            const convertedUrl = URL.createObjectURL(blob);
            setDisplayUrl(convertedUrl);
        } catch {
            // ignore conversion errors
        }
    };

    if (!displayUrl) {
        return (
            <Stack alignItems='center' justifyContent='center' height='100%'>
                <FileIcon style={{ width: 28, height: 28, color: '#666' }} />
            </Stack>
        );
    }

    return (
        <img
            src={displayUrl}
            alt={file.name}
            onError={() => {
                void tryRefreshOrConvert();
            }}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                backgroundColor: '#F9F9FA',
            }}
        />
    );
};

const AttachmentsPreview: FunctionComponent<{ files?: unknown[]; voices?: unknown[] }> = ({ files, voices }) => {
    const safeFiles = useMemo(() => (Array.isArray(files) ? files : []).filter(Boolean) as unknown[], [files]);
    const safeVoices = useMemo(() => (Array.isArray(voices) ? voices : []).filter(Boolean) as VoicePayload[], [voices]);

    const fileUrls = useMemo(() => {
        return safeFiles.map((item) => {
            const file = resolveFileFromUnknown(item);
            const explicitUrl = resolveUrlFromUnknown(item);
            const url = explicitUrl ?? (file ? tryCreateObjectUrl(file) : null);
            return { item, file, url, shouldRevoke: !!url && !explicitUrl };
        });
    }, [safeFiles]);

    useEffect(() => {
        return () => {
            fileUrls.forEach(({ url, shouldRevoke }) => {
                if (url && shouldRevoke) URL.revokeObjectURL(url);
            });
        };
    }, [fileUrls]);

    if (safeFiles.length === 0 && safeVoices.length === 0) return null;

    return (
        <Stack gap={1} mt={1.25}>
            {safeFiles.length > 0 && (
                <FilesStack direction='row' spacing={1} sx={{ width: '100%', m: 0 }}>
                    {fileUrls.map(({ file, url }, idx) => (
                        <FilePreviewContainer
                            key={`${(file as any)?.id ?? file?.name ?? `item-${idx}`}-${(file as any)?.lastModified ?? idx}`}
                            size={68}
                        >
                            {file && isVideoFile(file) && url ? (
                                <VideoThumbDialog url={url} title={file.name} />
                            ) : (
                                <a
                                    href={url ?? '#'}
                                    download={file?.name ?? undefined}
                                    target='_blank'
                                    rel='noreferrer'
                                    style={{ display: 'block', width: '100%', height: '100%' }}
                                    onClick={(e) => {
                                        if (!url) e.preventDefault();
                                    }}
                                >
                                    {file && isImageFile(file) ? (
                                        <SafeImagePreview file={file} url={url} />
                                    ) : (
                                        <Stack alignItems='center' justifyContent='center' height='100%'>
                                            <FileIcon style={{ width: 28, height: 28, color: '#666' }} />
                                        </Stack>
                                    )}
                                </a>
                            )}

                            <FileTypeLabel gap={0.25}>
                                <Typography variant='caption' fontWeight={600} color='text.secondary'>
                                    {file ? getFileKindLabel(file) : 'File'}
                                </Typography>
                            </FileTypeLabel>
                        </FilePreviewContainer>
                    ))}
                </FilesStack>
            )}

            {safeVoices.length > 0 && (
                <Stack gap={1}>
                    {safeVoices.map((voice) => (
                        <Stack key={voice.id ?? voice.url} gap={0.25}>
                            <Typography variant='caption' fontWeight={600} color='text.secondary'>
                                Voice{typeof voice.duration === 'number' ? ` (${Math.round(voice.duration)}s)` : ''}
                            </Typography>
                            <InlineVoicePlayer url={voice.url} duration={voice.duration} />
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

const Questions: FunctionComponent<QuestionsProps> = ({ onNext, setAiStatus: _setAiStatus, setStage }) => {
    const { data: wizardData } = useWizardStore();

    const editStageByStepId = useMemo<Record<string, StageWizard>>(
        () => ({
            background: 'SELECT_SKILL',
            skills: 'SELECT_SKILL',
            experiences: 'EXPERIENCE',
            certificates: 'CERTIFICATION',
            jobDescription: 'DESCRIPTION',
            additionalInfo: 'DESCRIPTION',
        }),
        [],
    );

    const mediaCounts = useMemo(() => {
        const safeArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v.filter(Boolean) as T[]) : []);

        const resolveFile = (value: unknown): File | null => {
            if (value instanceof File) return value;
            const maybePayload = (value as any)?.payload;
            if (maybePayload instanceof File) return maybePayload;
            return null;
        };

        let voiceCount = 0;
        let photoCount = 0;
        let videoCount = 0;

        const countSection = (section: any) => {
            const files = safeArray<unknown>(section?.files);
            const voices = safeArray<unknown>(section?.voices);

            voiceCount += voices.length;

            files.forEach((f) => {
                const file = resolveFile(f);
                if (!file) return;
                if (isImageFile(file)) photoCount += 1;
                else if (isVideoFile(file)) videoCount += 1;
            });
        };

        countSection((wizardData as any)?.background);
        safeArray<any>((wizardData as any)?.experiences).forEach((entry) => countSection(entry));
        safeArray<any>((wizardData as any)?.certificates).forEach((entry) => countSection(entry));
        countSection((wizardData as any)?.jobDescription);
        countSection((wizardData as any)?.additionalInfo);

        return { voiceCount, photoCount, videoCount };
    }, [
        wizardData.additionalInfo,
        wizardData.background,
        wizardData.certificates,
        wizardData.experiences,
        wizardData.jobDescription,
    ]);

    const mediaItems = useMemo(
        () => [
            { id: 'voice', label: `Voice (${mediaCounts.voiceCount})`, Icon: MicIcon },
            { id: 'photo', label: `Photo (${mediaCounts.photoCount})`, Icon: ImageIcon },
            { id: 'video', label: `Video (${mediaCounts.videoCount})`, Icon: VideoIcon },
        ],
        [mediaCounts.photoCount, mediaCounts.videoCount, mediaCounts.voiceCount],
    );

    const steps = useMemo(() => {
        const toCount = (v: unknown) => (Array.isArray(v) ? v.length : 0);

        const sectionLines = (section?: {
            text?: string;
            files?: unknown[];
            voices?: unknown[];
        }) => {
            const text = section?.text?.trim() ?? '';
            const lines: string[] = [];
            lines.push(`files: ${toCount(section?.files)}`);
            lines.push(`voices: ${toCount(section?.voices)}`);
            return { text, lines };
        };

        const listSectionLines = (entries?: Array<{ text?: string; files?: unknown[]; voices?: unknown[] }>) => {
            const safeEntries = Array.isArray(entries) ? entries : [];
            const totalFiles = safeEntries.reduce((acc, e) => acc + toCount(e?.files), 0);
            const totalVoices = safeEntries.reduce((acc, e) => acc + toCount(e?.voices), 0);

            const lines: string[] = [];
            lines.push(`entries: ${safeEntries.length}`);
            lines.push(`files: ${totalFiles}`);
            lines.push(`voices: ${totalVoices}`);

            safeEntries.forEach((e, idx) => {
                const t = e?.text?.trim();
                if (t) {
                    lines.push(`${idx + 1}. ${t}`);
                }
            });

            return lines;
        };

        const skillsLines = (skills?: string[]) => {
            const safeSkills = (skills ?? []).map((s) => s?.trim()).filter(Boolean) as string[];
            if (safeSkills.length === 0) {
                return ['(no skills)'];
            }
            return safeSkills;
        };

        const backgroundSummary = sectionLines(wizardData.background as any);
        const jobDescriptionSummary = sectionLines(wizardData.jobDescription as any);
        const additionalInfoSummary = sectionLines(wizardData.additionalInfo as any);

        return [
            {
                id: 'background',
                text: backgroundSummary.text,
                lines: backgroundSummary.lines,
                attachments: wizardData.background as any,
            },
            {
                id: 'skills',
                lines: skillsLines(wizardData.skills),
                attachments: null,
            },
            {
                id: 'experiences',
                lines: listSectionLines(wizardData.experiences as any),
                attachments: { entries: wizardData.experiences as any },
            },
            {
                id: 'certificates',
                lines: listSectionLines(wizardData.certificates as any),
                attachments: { entries: wizardData.certificates as any },
            },
            {
                id: 'jobDescription',
                text: jobDescriptionSummary.text,
                lines: jobDescriptionSummary.lines,
                attachments: wizardData.jobDescription as any,
            },
            {
                id: 'additionalInfo',
                text: additionalInfoSummary.text,
                lines: additionalInfoSummary.lines,
                attachments: wizardData.additionalInfo as any,
            },
        ];
    }, [
        wizardData.additionalInfo,
        wizardData.background,
        wizardData.certificates,
        wizardData.experiences,
        wizardData.jobDescription,
        wizardData.skills,
    ]);

    return (
        <Container>
            <MiddleSection>
                <TopSection>
                    <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center'>
                        File uploaded
                    </Typography>

                    <MediaRow>
                        {mediaItems.map(({ id, label, Icon }) => (
                            <MediaItem key={id}>
                                <MediaIconBox>
                                    <Icon />
                                </MediaIconBox>

                                <Stack direction='row' spacing={1.25} alignItems='center'>
                                    <Typography variant='subtitle1' fontWeight={492} color='text.primary'>
                                        {label}
                                    </Typography>
                                    <Typography variant='subtitle1' fontWeight={492} color='success.light'>
                                        Done
                                    </Typography>
                                </Stack>
                            </MediaItem>
                        ))}
                    </MediaRow>
                </TopSection>
                <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center' mt={3}>
                    Questions
                </Typography>
                <QuestionList>
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <QuestionCard>
                                <QuestionTexts>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                        <Stack direction='row' alignItems='center'>
                                            <QuestionBadge>{index + 1}</QuestionBadge>

                                            <Typography
                                                variant='subtitle2'
                                                fontWeight={400}
                                                color='text.primary'
                                                ml={2}
                                            >
                                                {step.id}
                                            </Typography>
                                        </Stack>

                                        <Tooltip title='Edit' placement='top'>
                                            <span>
                                                <IconButton
                                                    size='small'
                                                    aria-label={`edit-${step.id}`}
                                                    onClick={() => {
                                                        const targetStage = editStageByStepId[step.id];
                                                        if (targetStage) {
                                                            setStage(targetStage);
                                                        }
                                                    }}
                                                    disabled={!editStageByStepId[step.id]}
                                                    sx={{
                                                        '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.18)' },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Stack>
                                    <Stack direction='row' gap={1} mt={1}>
                                        <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
                                            Answer
                                        </Typography>
                                    </Stack>

                                    <Stack component='ul' sx={{ pl: 3, m: 0 }} gap={0.5}>
                                        {step.text && (
                                            <Typography
                                                component='li'
                                                variant='subtitle2'
                                                fontWeight={400}
                                                color='text.primary'
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                }}
                                            >
                                                {step.text}
                                            </Typography>
                                        )}

                                        {step.lines.map((line, lineIdx) => (
                                            <Typography
                                                key={`${step.id}-${lineIdx}`}
                                                component='li'
                                                variant='subtitle2'
                                                fontWeight={400}
                                                color='text.primary'
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                }}
                                            >
                                                {line}
                                            </Typography>
                                        ))}
                                    </Stack>

                                    {step.attachments?.entries ? (
                                        <Stack gap={1} mt={1}>
                                            {(Array.isArray(step.attachments.entries)
                                                ? step.attachments.entries
                                                : []
                                            ).map((entry: any, entryIdx: number) => (
                                                <Stack key={`${step.id}-entry-${entryIdx}`} gap={0.5}>
                                                    <Typography
                                                        variant='caption'
                                                        fontWeight={600}
                                                        color='text.secondary'
                                                    >
                                                        Entry {entryIdx + 1}
                                                    </Typography>
                                                    <AttachmentsPreview files={entry?.files} voices={entry?.voices} />
                                                </Stack>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <AttachmentsPreview
                                            files={step.attachments?.files}
                                            voices={step.attachments?.voices}
                                        />
                                    )}
                                </QuestionTexts>
                            </QuestionCard>

                            {index !== steps.length - 1 && (
                                <Divider
                                    sx={{
                                        borderColor: 'grey.100',
                                        width: '100%',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </QuestionList>
            </MiddleSection>

            <BottomSection>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={{ xs: 2, sm: 5 }}
                    justifyContent='center'
                    m={{ xs: 2, sm: 4 }}
                    width='100%'
                    sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
                >
                    <MuiButton
                        color='secondary'
                        variant='outlined'
                        size='large'
                        startIcon={<AddIcon />}
                        onClick={() => setStage('SKILL_INPUT')}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Add more
                    </MuiButton>

                    <MuiButton
                        color='secondary'
                        size='large'
                        onClick={onNext}
                        endIcon={<ArrowRightIcon />}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Submit
                    </MuiButton>
                </Stack>
            </BottomSection>
        </Container>
    );
};

export default Questions;
