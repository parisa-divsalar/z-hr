import React, { FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import CleanIcon from '@/assets/images/icons/clean.svg';
import EdiIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import TooltipIcon from '@/assets/images/icons/tooltip.svg';
import { StageWizard } from '@/components/Landing/type';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import {
    FilePreviewContainer,
    FilesStack,
    FileTypeLabel,
} from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import {
    FILE_CATEGORY_LIMITS,
    FILE_CATEGORY_TOAST_LABELS,
    getFileCategory,
    getFileTypeDisplayName,
    isDuplicateFile,
    isVideoDurationValid,
    MAX_VOICE_DURATION_SECONDS,
    MAX_VOICE_RECORDINGS,
} from '@/components/Landing/Wizard/Step1/attachmentRules';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';
import { SelectOption } from '@/components/UI/MuiSelectOptions';
import { apiClientClient } from '@/services/api-client';
import { useWizardStore } from '@/store/wizard';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import { AllSkill } from './data';
import EditSkillDialog from './EditSkillDialog';
import {
    ActionIconButton,
    ActionRow,
    ContainerSkill,
    ContainerSkillAttach,
    ContainerSkillAttachVoice,
    SkillContainer,
    VoiceItem,
} from './styled';
import { TSkill } from './type';

interface SelectSkillProps {
    setStage: (stage: StageWizard) => void;
}

type ToastSeverity = AlertWrapperProps['severity'];

interface ToastInfo {
    id: number;
    message: string;
    severity: ToastSeverity;
}

const TooltipContent = styled(Stack)(() => ({
    width: '100%',
}));

const AtsFriendlyChip = styled(MuiChips)(({ theme }) => ({
    border: `1px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.light,
    borderRadius: '8px',
    height: '26px',
}));

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
    const { setStage } = props;
    const theme = useTheme();
    const tooltipLines = [
        'Start with your job title or the role you are applying for.',
        'Mention your years of experience.',
        'Highlight your strongest skills and what makes you valuable.',
        'Add 1–2 examples of what you have achieved in past companies.',
        'Keep it short, clear, and professional (3–4 lines).',
    ];
    const tooltipSnippet =
        'Example: "UX/UI Designer with 3+ years of experience in creating user-friendly digital products. Skilled in wireframing, prototyping, and user research. Successfully improved user engagement for multiple ed-tech and gaming platforms."';
    const tooltipBackground = theme.palette.grey[800] ?? '#1C1C1C';

    const { data: wizardData, updateField, recomputeAllFiles } = useWizardStore();
    const backgroundSection = wizardData.background;
    const backgroundText = backgroundSection?.text ?? '';
    const backgroundFiles = (backgroundSection?.files as File[]) ?? [];
    const backgroundVoices =
        (backgroundSection?.voices as { id: string; url: string; blob: Blob; duration: number }[]) ?? [];

    const [skills, setSkills] = useState<TSkill[]>([]);
    const [customSkillInput, setCustomSkillInput] = useState<string>('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const backgroundRef = useRef<HTMLTextAreaElement>(null);
    const customSkillRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
    const [_voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [_voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
    const [recorderKey, setRecorderKey] = useState<number>(0);
    const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isVoiceLimitReached = backgroundVoices.length >= MAX_VOICE_RECORDINGS;

    const onUpdateSkill = (id: string, selected: boolean) => {
        setSkills((prevSkills) => {
            const updatedSkills = prevSkills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill));

            const selectedLabels = updatedSkills.filter((skill) => skill.selected).map((skill) => skill.label);

            const customSkills = customSkillInput
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            const allSkills = Array.from(new Set([...selectedLabels, ...customSkills]));

            updateField('skills', allSkills as unknown as string[]);

            return updatedSkills;
        });
    };

    useEffect(() => {
        const fetchCategorySkills = async () => {
            try {
                const category = wizardData.mainSkill?.trim();
                const endpoint = category
                    ? `categories-name?category=${encodeURIComponent(category)}`
                    : 'categories-name';

                const { data } = await apiClientClient.get(endpoint);

                const payload = (data && data.data !== undefined ? data.data : data) as unknown;

                let items: unknown[] = [];

                if (Array.isArray(payload)) {
                    items = payload;
                } else if (payload && typeof payload === 'object') {
                    // وقتی به صورت map با key عددی برگشته (نمونه‌ای که در Network دیدی)
                    items = Object.values(payload as Record<string, unknown>);
                } else {
                    console.warn('categories-name: unexpected payload shape', data);
                }

                if (items.length === 0) {
                    return;
                }

                const selectedFromStore = wizardData.skills ?? [];

                const mappedSkills: TSkill[] = items.map((item) => {
                    let label: string;
                    if (typeof item === 'string') {
                        label = item;
                    } else if (typeof item === 'object' && item !== null) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const obj = item as any;
                        label = obj.label ?? obj.name ?? obj.title ?? String(obj.id ?? '');
                    } else {
                        label = String(item);
                    }

                    return {
                        id: generateFakeUUIDv4(),
                        label,
                        selected: selectedFromStore.includes(label),
                    };
                });

                setSkills(mappedSkills);

                const knownLabels = new Set(mappedSkills.map((skill) => skill.label));
                const customSkillsOnly = selectedFromStore.filter((skill) => !knownLabels.has(skill));
                if (customSkillsOnly.length > 0) {
                    setCustomSkillInput(customSkillsOnly.join(', '));
                }
            } catch (error) {
                console.error('Failed to fetch skills by category-name', error);
            }
        };

        void fetchCategorySkills();
    }, [wizardData.mainSkill, wizardData.skills]);

    const handleFocusBackground = () => {
        backgroundRef.current?.focus();
    };

    const showToast = useCallback((message: string, severity: ToastSeverity = 'warning') => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        const id = Date.now();
        setToastInfo({ id, message, severity });

        toastTimerRef.current = setTimeout(() => {
            setToastInfo((current) => (current?.id === id ? null : current));
            toastTimerRef.current = null;
        }, 4000);
    }, []);

    const handleShowVoiceRecorder = () => {
        if (isVoiceLimitReached) {
            showToast(`You can upload up to ${MAX_VOICE_RECORDINGS} voice recordings.`);
            return;
        }

        setShowRecordingControls(true);
        setRecorderKey((prev) => prev + 1);
        handleFocusBackground();
    };

    const handleVoiceRecordingComplete = (_audioUrl: string, audioBlob: Blob, duration: number) => {
        const isRecordingValid = duration > 0 && audioBlob.size > 0;
        if (!isRecordingValid) {
            if (_audioUrl) {
                URL.revokeObjectURL(_audioUrl);
            }
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        if (duration > MAX_VOICE_DURATION_SECONDS) {
            showToast('Voice recordings are limited to 90 seconds.', 'info');
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        if (backgroundVoices.length >= MAX_VOICE_RECORDINGS) {
            showToast(`You can upload up to ${MAX_VOICE_RECORDINGS} voice recordings.`);
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        const persistedUrl = URL.createObjectURL(audioBlob);

        const nextVoices = [
            ...backgroundVoices,
            {
                id: generateFakeUUIDv4(),
                url: persistedUrl,
                blob: audioBlob,
                duration,
            },
        ];

        updateField('background', {
            ...backgroundSection,
            voices: nextVoices,
        });
        // Keep global allFiles in sync with newly added voice recordings
        recomputeAllFiles();

        setShowRecordingControls(false);
        setVoiceUrl(null);
        setVoiceBlob(null);
    };

    const handleClearVoiceRecording = () => {
        setShowRecordingControls(false);
        setVoiceUrl(null);
        setVoiceBlob(null);
    };

    const handleRemoveSavedRecording = (id: string) => {
        const currentVoices = backgroundVoices ?? [];
        const removed = currentVoices.find((item) => item.id === id);
        if (removed) {
            URL.revokeObjectURL(removed.url);
        }
        const nextVoices = currentVoices.filter((item) => item.id !== id);

        updateField('background', {
            ...backgroundSection,
            voices: nextVoices,
        });
        recomputeAllFiles();
    };

    const hasBackgroundText = backgroundText.trim() !== '';
    const hasBackgroundAttachment = backgroundFiles.length > 0 || backgroundVoices.length > 0;
    const hasSelectedSkills = skills.some((skill) => skill.selected);
    const hasCustomSkillInput = customSkillInput.trim() !== '';
    const canProceedBackground = hasBackgroundText || hasBackgroundAttachment;
    const [filePreviews, setFilePreviews] = useState<(string | undefined)[]>([]);

    useEffect(() => {
        const urls = backgroundFiles.map((file) =>
            file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        );

        setFilePreviews(urls);

        return () => {
            urls.forEach((url) => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [backgroundFiles]);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files) {
            return;
        }

        const fileList = Array.from(files);
        const acceptedFiles: File[] = [];

        for (const file of fileList) {
            const category = getFileCategory(file);
            const currentFiles = [...backgroundFiles, ...acceptedFiles];

            if (isDuplicateFile(file, currentFiles)) {
                showToast('This file has already been uploaded.');
                continue;
            }

            if (category !== 'other') {
                const limit = FILE_CATEGORY_LIMITS[category];
                const currentCount =
                    backgroundFiles.filter((existingFile) => getFileCategory(existingFile) === category).length +
                    acceptedFiles.filter((fileItem) => getFileCategory(fileItem) === category).length;

                if (currentCount >= limit) {
                    showToast(`You can upload up to ${limit} ${FILE_CATEGORY_TOAST_LABELS[category]}.`);
                    continue;
                }
            }

            if (category === 'video') {
                const isDurationValid = await isVideoDurationValid(file);
                if (!isDurationValid) {
                    showToast('Each video must be 60 seconds or shorter.');
                    continue;
                }
            }

            acceptedFiles.push(file);
        }

        if (acceptedFiles.length > 0) {
            const currentFiles = backgroundFiles ?? [];
            const nextFiles = [...currentFiles, ...acceptedFiles];

            updateField('background', {
                ...backgroundSection,
                files: nextFiles,
            });
            recomputeAllFiles();
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        void handleFileUpload(event.target.files);
    };

    const handleRemoveUploadedFile = (index: number) => {
        const currentFiles = backgroundFiles ?? [];
        const nextFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);

        updateField('background', {
            ...backgroundSection,
            files: nextFiles,
        });
        recomputeAllFiles();
    };

    const handleOpenEditDialog = () => {
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    const defaultSkill = AllSkill[0] ?? { id: '', label: 'Motion Designer', selected: false };
    const [mainSkillId, setMainSkillId] = useState<string>(defaultSkill.id);
    const [mainSkillLabel, setMainSkillLabel] = useState<ReactNode>(defaultSkill.label);

    useEffect(() => {
        const value = wizardData.mainSkill;
        if (!value) return;

        const numericIndex = Number(value);

        if (Number.isNaN(numericIndex)) {
            setMainSkillLabel(value);
            return;
        }

        const fetchMainSkillLabel = async () => {
            try {
                const { data } = await apiClientClient.get('slills-categories');
                const list: string[] = data?.data ?? [];
                const labelFromList = list[numericIndex];

                setMainSkillLabel(labelFromList ?? value);
            } catch {
                setMainSkillLabel(value);
            }
        };

        void fetchMainSkillLabel();
    }, [wizardData.mainSkill]);

    const handleConfirmEditDialog = (selectedOption: SelectOption) => {
        setIsEditDialogOpen(false);
        setMainSkillLabel(selectedOption.label);
        setMainSkillId(String(selectedOption.value));
        if (selectedOption.value) {
            (useWizardStore.getState().updateField as any)('mainSkill', String(selectedOption.value));
        }
    };

    const persistSelectSkillState = useCallback(() => {
        const trimmedBackground = backgroundText.trim();

        const selectedLabels = skills.filter((skill) => skill.selected).map((skill) => skill.label);

        const customSkills = customSkillInput
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        const allSkills = Array.from(new Set([...selectedLabels, ...customSkills]));

        updateField('background', {
            ...wizardData.background,
            text: trimmedBackground,
        });

        updateField('skills', allSkills as unknown as string[]);

        recomputeAllFiles();
    }, [
        backgroundText,
        customSkillInput,
        skills,
        updateField,
        wizardData.background,
        backgroundVoices,
        backgroundFiles,
        recomputeAllFiles,
    ]);

    const handleNext = () => {
        persistSelectSkillState();
        setStage('EXPERIENCE');
    };

    return (
        <Stack alignItems='center' justifyContent='center' height='100%'>
            <Stack direction='row' alignItems='center' gap={1}>
                <Typography variant='h5' color='text.primary' fontWeight='584'>
                    4. Briefly tell us about your background{' '}
                </Typography>
                <Tooltip
                    arrow
                    placement='right'
                    title={
                        <TooltipContent>
                            {tooltipLines.map((line) => (
                                <Typography key={line} variant='body2' color='inherit'>
                                    {line}
                                </Typography>
                            ))}
                            <Stack>
                                <Typography variant='body2' fontStyle='italic' color='inherit'>
                                    {tooltipSnippet}
                                </Typography>
                            </Stack>
                        </TooltipContent>
                    }
                    slotProps={{
                        tooltip: {
                            style: {
                                width: 234,
                                height: 'auto',
                                backgroundColor: theme.palette.grey[600],
                                color: theme.palette.primary.contrastText,
                                borderRadius: 12,
                                padding: 10,
                                boxSizing: 'border-box',
                                display: 'flex',
                                alignItems: 'flex-start',
                                whiteSpace: 'normal',
                                fontWeight: 400,
                            },
                        },
                        arrow: {
                            style: {
                                color: tooltipBackground,
                            },
                        },
                    }}
                >
                    <span>
                        <TooltipIcon />
                    </span>
                </Tooltip>
            </Stack>

            <Stack direction='row' alignItems='center' gap={1} mt={1}>
                <AtsFriendlyChip color='warning' label='ATS Friendly' />
            </Stack>
            <Stack sx={{ width: '498px' }} justifyContent='center' alignItems='center'>
                <Typography
                    fontWeight='400'
                    variant='body1'
                    color='text.secondary'
                    justifyContent='center'
                    alignItems='center'
                    textAlign='center'
                    mt={1}
                >
                    Your summary shows employers you’re right for their job. We’ll help you write a great one with
                    expert content you can customize.
                </Typography>
            </Stack>
            <ContainerSkill direction='row' active={!!backgroundText}>
                <InputContent
                    placeholder='Type your answer...'
                    value={backgroundText}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateField('background', {
                            ...backgroundSection,
                            text: event.target.value,
                        })
                    }
                    ref={backgroundRef}
                />
            </ContainerSkill>

            <ActionRow>
                <Stack direction='row' gap={0.5} sx={{ flexShrink: 0 }}>
                    <ActionIconButton aria-label='Attach file' onClick={handleOpenFileDialog}>
                        <AttachIcon />
                    </ActionIconButton>
                    <Stack direction='column' alignItems='center' gap={1}>
                        {!showRecordingControls && (
                            <ActionIconButton
                                aria-label='Record draft action'
                                onClick={handleShowVoiceRecorder}
                                disabled={isVoiceLimitReached}
                                sx={{
                                    opacity: isVoiceLimitReached ? 0.4 : 1,
                                    cursor: isVoiceLimitReached ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <RecordIcon />
                            </ActionIconButton>
                        )}

                        {showRecordingControls && (
                            <VoiceRecord
                                key={recorderKey}
                                onRecordingComplete={handleVoiceRecordingComplete}
                                showRecordingControls={showRecordingControls}
                                recordingState={recordingState}
                                setRecordingState={setRecordingState}
                                onClearRecording={handleClearVoiceRecording}
                                maxDuration={MAX_VOICE_DURATION_SECONDS}
                                stackDirection='row'
                            />
                        )}
                    </Stack>
                </Stack>
            </ActionRow>
            {toastInfo && (
                <Stack sx={{ width: '100%', maxWidth: '350px', mt: 2 }}>
                    <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                </Stack>
            )}
            {backgroundVoices.length > 0 && (
                <ContainerSkillAttachVoice direction='row' active>
                    <Stack direction='row' gap={1} sx={{ flexWrap: 'wrap' }}>
                        {backgroundVoices.map((item) => (
                            <VoiceItem key={item.id}>
                                <VoiceRecord
                                    recordingState='idle'
                                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                                    setRecordingState={() => {}}
                                    initialAudioUrl={item.url}
                                    initialAudioBlob={item.blob}
                                    showRecordingControls={false}
                                    initialAudioDuration={item.duration}
                                    onClearRecording={() => handleRemoveSavedRecording(item.id)}
                                    stackDirection='column'
                                    fullWidth={false}
                                />
                            </VoiceItem>
                        ))}
                    </Stack>
                </ContainerSkillAttachVoice>
            )}

            {backgroundFiles.length > 0 && (
                <ContainerSkillAttach direction='column' active sx={{ mt: 2, alignItems: 'flex-start' }}>
                    <FilesStack direction='row' spacing={1} sx={{ width: '100%' }}>
                        {backgroundFiles.map((file, index) => {
                            const fileCategory = getFileCategory(file);
                            const fileTypeLabelText = getFileTypeDisplayName(file);
                            const previewSrc = file.type.startsWith('image/') ? filePreviews[index] : undefined;

                            return (
                                <FilePreviewContainer key={`${file.name}-${index}`} size={68}>
                                    {previewSrc ? (
                                        <img
                                            src={previewSrc}
                                            alt={file.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : fileCategory === 'video' ? (
                                        <VideoIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                                    ) : (
                                        <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                                    )}

                                    <FileTypeLabel gap={0.25}>
                                        <Typography variant='caption' color='text.secondary'>
                                            {fileTypeLabelText}
                                        </Typography>
                                    </FileTypeLabel>

                                    <RemoveFileButton
                                        onClick={() => handleRemoveUploadedFile(index)}
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            padding: 0,
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                    >
                                        <CleanIcon width={24} height={24} />
                                    </RemoveFileButton>
                                </FilePreviewContainer>
                            );
                        })}
                    </FilesStack>
                </ContainerSkillAttach>
            )}

            <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='*/*'
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />

            <Typography variant='h5' color='text.primary' fontWeight='584' mt={5}>
                5. Your skills?
            </Typography>
            <Stack direction='row' gap={2} mt={3}>
                <Stack direction='row' alignItems='center' gap={1}>
                    <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
                        Main skill
                    </Typography>
                    <Typography variant='h5' color='text.primary' fontWeight='584'>
                        {mainSkillLabel}
                    </Typography>
                    <ActionIconButton aria-label='Edit main skill' onClick={handleOpenEditDialog}>
                        <EdiIcon />
                    </ActionIconButton>
                </Stack>
            </Stack>
            <SkillContainer direction='row'>
                {skills.map((skill: TSkill) => (
                    <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
                ))}
            </SkillContainer>

            <ContainerSkill direction='row' active={!!customSkillInput}>
                <InputContent
                    placeholder='Your another skills: Designer, Motion...'
                    value={customSkillInput}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCustomSkillInput(event.target.value)
                    }
                    ref={customSkillRef}
                />
            </ContainerSkill>
            <Stack mt={4} mb={6} direction='row' gap={3}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    size='large'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                        persistSelectSkillState();
                        setStage('SKILL_INPUT');
                    }}
                >
                    Back
                </MuiButton>

                <MuiButton
                    color='secondary'
                    endIcon={<ArrowRightIcon />}
                    size='large'
                    onClick={handleNext}
                    disabled={!canProceedBackground || (!hasSelectedSkills && !hasCustomSkillInput)}
                >
                    Next
                </MuiButton>
            </Stack>
            <EditSkillDialog
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                onConfirm={handleConfirmEditDialog}
                initialSkillId={wizardData.mainSkill}
            />
        </Stack>
    );
};

export default SelectSkill;
