import React, { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
    const [skills, setSkills] = useState<TSkill[]>(AllSkill);
    const [backgroundText, setBackgroundText] = useState<string>('');
    const [customSkillInput, setCustomSkillInput] = useState<string>('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const backgroundRef = useRef<HTMLTextAreaElement>(null);
    const customSkillRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
    const [_voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [_voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
    const [voiceRecordings, setVoiceRecordings] = useState<{ id: string; url: string; blob: Blob; duration: number }[]>(
        [],
    );
    const [recorderKey, setRecorderKey] = useState<number>(0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isVoiceLimitReached = voiceRecordings.length >= MAX_VOICE_RECORDINGS;

    const onUpdateSkill = (id: string, selected: boolean) =>
        setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

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

        if (voiceRecordings.length >= MAX_VOICE_RECORDINGS) {
            showToast(`You can upload up to ${MAX_VOICE_RECORDINGS} voice recordings.`);
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        const persistedUrl = URL.createObjectURL(audioBlob);

        setVoiceRecordings((prev) => [
            ...prev,
            {
                id: generateFakeUUIDv4(),
                url: persistedUrl,
                blob: audioBlob,
                duration,
            },
        ]);

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
        setVoiceRecordings((prev) => {
            const removed = prev.find((item) => item.id === id);
            if (removed) {
                URL.revokeObjectURL(removed.url);
            }
            return prev.filter((item) => item.id !== id);
        });
    };

    const hasBackgroundText = backgroundText.trim() !== '';
    const hasSelectedSkills = skills.some((skill) => skill.selected);
    const hasCustomSkillInput = customSkillInput.trim() !== '';
    const canProceedBackground = hasBackgroundText;
    const filePreviews = useMemo(
        () => uploadedFiles.map((file) => (file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined)),
        [uploadedFiles],
    );

    useEffect(() => {
        return () => {
            filePreviews.forEach((preview) => {
                if (preview) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [filePreviews]);

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
            const currentFiles = [...uploadedFiles, ...acceptedFiles];

            if (isDuplicateFile(file, currentFiles)) {
                showToast('This file has already been uploaded.');
                continue;
            }

            if (category !== 'other') {
                const limit = FILE_CATEGORY_LIMITS[category];
                const currentCount =
                    uploadedFiles.filter((existingFile) => getFileCategory(existingFile) === category).length +
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
            setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        void handleFileUpload(event.target.files);
    };

    const handleRemoveUploadedFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
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

    const handleConfirmEditDialog = (selectedOption: SelectOption) => {
        setIsEditDialogOpen(false);
        setMainSkillLabel(selectedOption.label);
        setMainSkillId(String(selectedOption.value));
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
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setBackgroundText(event.target.value)}
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
            {voiceRecordings.length > 0 && (
                <ContainerSkillAttachVoice direction='row' active>
                    <Stack direction='row' gap={1} sx={{ flexWrap: 'wrap' }}>
                        {voiceRecordings.map((item) => (
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

            {uploadedFiles.length > 0 && (
                <ContainerSkillAttach direction='column' active sx={{ mt: 2, alignItems: 'flex-start' }}>
                    <FilesStack direction='row' spacing={1} sx={{ width: '100%' }}>
                        {uploadedFiles.map((file, index) => {
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
                        {mainSkillLabel}{' '}
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
                    onClick={() => setStage('SKILL_INPUT')}
                >
                    Back
                </MuiButton>

                <MuiButton
                    color='secondary'
                    endIcon={<ArrowRightIcon />}
                    size='large'
                    onClick={() => setStage('EXPERIENCE')}
                    disabled={!canProceedBackground || (!hasSelectedSkills && !hasCustomSkillInput)}
                >
                    Next
                </MuiButton>
            </Stack>
            <EditSkillDialog
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                onConfirm={handleConfirmEditDialog}
                initialSkillId={mainSkillId}
            />
        </Stack>
    );
};

export default SelectSkill;
