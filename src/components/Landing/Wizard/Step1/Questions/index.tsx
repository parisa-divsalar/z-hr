'use client';

import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Divider, IconButton, Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import PlayArrowIcon from '@/assets/images/icons/button-play.svg';
import PauseIcon from '@/assets/images/icons/button-puse.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import { AIStatus, StageWizard } from '@/components/Landing/type';
import {
    FilePreviewContainer,
    FilesStack,
    FileTypeLabel,
} from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import MuiButton from '@/components/UI/MuiButton';
import { apiClientClient } from '@/services/api-client';
import { buildWizardZipBlob, useWizardStore } from '@/store/wizard';

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

    const audioRef = React.useRef<HTMLAudioElement | null>(null);

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

const isImageFile = (file: File) => {
    if (file.type?.startsWith('image/')) return true;
    const ext = getLowerExtension(file.name);
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'avif'].includes(ext);
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

const AttachmentsPreview: FunctionComponent<{ files?: unknown[]; voices?: unknown[] }> = ({ files, voices }) => {
    const safeFiles = useMemo(() => (Array.isArray(files) ? files : []).filter(Boolean) as File[], [files]);
    const safeVoices = useMemo(() => (Array.isArray(voices) ? voices : []).filter(Boolean) as VoicePayload[], [voices]);

    const fileUrls = useMemo(() => {
        return safeFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
    }, [safeFiles]);

    useEffect(() => {
        return () => {
            fileUrls.forEach(({ url }) => URL.revokeObjectURL(url));
        };
    }, [fileUrls]);

    if (safeFiles.length === 0 && safeVoices.length === 0) return null;

    return (
        <Stack gap={1} mt={1.25}>
            {safeFiles.length > 0 && (
                <FilesStack direction='row' spacing={1} sx={{ width: '100%', m: 0 }}>
                    {fileUrls.map(({ file, url }) => (
                        <FilePreviewContainer key={`${(file as any)?.id ?? file.name}-${file.lastModified}`} size={68}>
                            <a
                                href={url}
                                download={file.name}
                                target='_blank'
                                rel='noreferrer'
                                style={{ display: 'block', width: '100%', height: '100%' }}
                            >
                                {isImageFile(file) ? (
                                    <img
                                        src={url}
                                        alt={file.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                            backgroundColor: '#F9F9FA',
                                        }}
                                    />
                                ) : isVideoFile(file) ? (
                                    <video
                                        src={url}
                                        controls
                                        playsInline
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                            backgroundColor: '#F9F9FA',
                                        }}
                                    />
                                ) : (
                                    <Stack alignItems='center' justifyContent='center' height='100%'>
                                        <FileIcon style={{ width: 28, height: 28, color: '#666' }} />
                                    </Stack>
                                )}
                            </a>

                            <FileTypeLabel gap={0.25}>
                                <Typography variant='caption' fontWeight={600} color='text.secondary'>
                                    {getFileKindLabel(file)}
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

const Questions: FunctionComponent<QuestionsProps> = ({ onNext, setAiStatus, setStage }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data: wizardData } = useWizardStore();

    const mediaCounts = useMemo(() => {
        const allFiles = Array.isArray((wizardData as any)?.allFiles) ? ((wizardData as any).allFiles as any[]) : [];
        const voiceCount = allFiles.filter((x) => x?.kind === 'voice').length;
        const fileItems = allFiles.filter((x) => x?.kind === 'file' && x?.payload);
        const photoCount = fileItems.filter((x) => isImageFile(x.payload as File)).length;
        const videoCount = fileItems.filter((x) => isVideoFile(x.payload as File)).length;
        return { voiceCount, photoCount, videoCount };
    }, [wizardData]);

    const mediaItems = useMemo(
        () => [
            { id: 'voice', label: `Voice (${mediaCounts.voiceCount})`, Icon: MicIcon },
            { id: 'photo', label: `Photo (${mediaCounts.photoCount})`, Icon: ImageIcon },
            { id: 'video', label: `Video (${mediaCounts.videoCount})`, Icon: VideoIcon },
        ],
        [mediaCounts.photoCount, mediaCounts.videoCount, mediaCounts.voiceCount],
    );

    const steps = useMemo(() => {
        const truncate = (value: string, max = 160) => {
            const t = value.trim();
            if (t.length <= max) {
                return t;
            }
            return `${t.slice(0, max)}…`;
        };

        const toCount = (v: unknown) => (Array.isArray(v) ? v.length : 0);

        const sectionLines = (section?: { text?: string; files?: unknown[]; voices?: unknown[] }) => {
            const lines: string[] = [];
            const text = section?.text?.trim();
            if (text) {
                lines.push(truncate(text));
            }
            lines.push(`files: ${toCount(section?.files)}`);
            lines.push(`voices: ${toCount(section?.voices)}`);
            return lines;
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
                    lines.push(`${idx + 1}. ${truncate(t, 120)}`);
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

        return [
            {
                id: 'background',
                lines: sectionLines(wizardData.background as any),
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
                lines: sectionLines(wizardData.jobDescription as any),
                attachments: wizardData.jobDescription as any,
            },
            {
                id: 'additionalInfo',
                lines: sectionLines(wizardData.additionalInfo as any),
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        console.log('wizardData', wizardData);

        const zipBlob = await buildWizardZipBlob(wizardData, {
            rootFolderName: wizardData.fullName || 'nv',
            zipFileName: 'info.zip',
        });

        const zipFile = new File([zipBlob], 'info.zip');

        const formData = new FormData();
        formData.append('inputFile', zipFile);

        try {
            const res = await apiClientClient.post('send-file', formData);
            console.log('res wizrd uploadd', res);
            onNext();
        } catch (error) {
            console.log('rerr wizrd uploadd', error);

            setIsSubmitting(false);
        }
    };

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
                                    <Typography variant='body2' fontWeight={600} color='text.primary'>
                                        {label}
                                    </Typography>
                                    <Typography variant='caption' fontWeight={600} color='success.light'>
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
                                    <Stack direction='row' alignItems='center'>
                                        <QuestionBadge>{index + 1}</QuestionBadge>

                                        <Typography variant='subtitle2' fontWeight={400} color='text.primary' ml={2}>
                                            {step.id}
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' gap={1} mt={1}>
                                        <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
                                            Answer
                                        </Typography>
                                    </Stack>

                                    <Stack component='ul' sx={{ pl: 3, m: 0 }} gap={0.5}>
                                        {step.lines.map((line, lineIdx) => (
                                            <Typography
                                                key={`${step.id}-${lineIdx}`}
                                                component='li'
                                                variant='subtitle2'
                                                fontWeight={400}
                                                color='text.primary'
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
                <Stack direction='row' gap={5} justifyContent='center' m={4}>
                    <MuiButton
                        color='secondary'
                        variant='outlined'
                        size='large'
                        startIcon={<AddIcon />}
                        onClick={() => setStage('SKILL_INPUT')}
                    >
                        Add more
                    </MuiButton>

                    <MuiButton
                        color='secondary'
                        size='large'
                        onClick={handleSubmit}
                        endIcon={<ArrowRightIcon />}
                        loading={isSubmitting}
                    >
                        Submit
                    </MuiButton>
                </Stack>
            </BottomSection>
        </Container>
    );
};

export default Questions;
