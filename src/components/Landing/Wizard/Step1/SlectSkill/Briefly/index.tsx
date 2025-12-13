import React, { FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@/assets/images/icons/add.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import CleanIcon from '@/assets/images/icons/clean.svg';
import EdiIcon from '@/assets/images/icons/edit.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import {
    FilePreviewContainer,
    FilesStack,
    FileTypeLabel,
} from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

import { getFileCategory } from '../../attachmentRules';
import { InputContent } from '../../SKillInput/styled';
import {
    ActionIconButton,
    ActionRow,
    BackgroundEntryIndex,
    ContainerSkill,
    ContainerSkillAttach,
    ContainerSkillAttachItem,
    ContainerSkillAttachVoice,
    VoiceItem,
} from '../styled';

export interface BackgroundEntry {
    id: string;
    text: string;
    files: File[];
    voices: {
        id: string;
        url: string;
        blob: Blob;
        duration: number;
    }[];
}

const isHeicLike = (file: File): boolean => {
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return type === 'image/heic' || type === 'image/heif' || name.endsWith('.heic') || name.endsWith('.heif');
};

const isRenderableImageUrl = (value?: string | null): value is string => {
    if (!value) return false;
    return (
        value.startsWith('blob:') ||
        value.startsWith('data:') ||
        value.startsWith('http://') ||
        value.startsWith('https://')
    );
};

const isRenderableVideoUrl = isRenderableImageUrl;

const SafeImageThumb: FunctionComponent<{ file: File; url?: string }> = ({ file, url }) => {
    const [displayUrl, setDisplayUrl] = useState<string | null>(isRenderableImageUrl(url) ? url : null);
    const createdLocallyRef = useRef<string | null>(null);
    const triedConversionRef = useRef(false);

    useEffect(() => {
        const safeParentUrl = isRenderableImageUrl(url) ? url : null;

        if (!safeParentUrl) {
            try {
                const local = URL.createObjectURL(file);
                createdLocallyRef.current = local;
                setDisplayUrl(local);
            } catch {
                createdLocallyRef.current = null;
                setDisplayUrl(null);
            }
            triedConversionRef.current = false;
            return () => {
                if (createdLocallyRef.current) {
                    URL.revokeObjectURL(createdLocallyRef.current);
                }
                createdLocallyRef.current = null;
            };
        }

        setDisplayUrl(safeParentUrl);
        triedConversionRef.current = false;
        return;
    }, [file, url]);

    useEffect(() => {
        return () => {
            if (displayUrl && displayUrl !== url && displayUrl !== createdLocallyRef.current) {
                URL.revokeObjectURL(displayUrl);
            }
        };
    }, [displayUrl, url]);

    const tryHeicConversion = async () => {
        if (triedConversionRef.current) return;
        triedConversionRef.current = true;
        if (!isHeicLike(file)) return;

        try {
            const heic2any = (await import('heic2any')).default;
            const output = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
            const blob: Blob = Array.isArray(output) ? output[0] : output;
            const convertedUrl = URL.createObjectURL(blob);
            setDisplayUrl(convertedUrl);
        } catch {}
    };

    if (!displayUrl) {
        return <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />;
    }

    return (
        <img
            src={displayUrl}
            alt={file.name}
            onError={() => {
                void tryHeicConversion();
            }}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#F9F9FA',
                display: 'block',
            }}
        />
    );
};

const SafeVideoThumb: FunctionComponent<{ file: File; url?: string }> = ({ file, url }) => {
    const [displayUrl, setDisplayUrl] = useState<string | null>(isRenderableVideoUrl(url) ? url : null);

    useEffect(() => {
        const safeParentUrl = isRenderableVideoUrl(url) ? url : null;

        if (!safeParentUrl) {
            try {
                const local = URL.createObjectURL(file);
                setDisplayUrl(local);
                return () => URL.revokeObjectURL(local);
            } catch {
                setDisplayUrl(null);
                return;
            }
        }
        setDisplayUrl(safeParentUrl);
        return;
    }, [file, url]);

    if (!displayUrl) {
        return <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />;
    }

    return (
        <video
            src={displayUrl}
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
    );
};

const EntryFileThumb: FunctionComponent<{ file: File; size: number; typeLabel: string }> = ({
    file,
    size,
    typeLabel,
}) => {
    const category = getFileCategory(file);

    return (
        <FilePreviewContainer size={size}>
            {category === 'image' ? (
                <SafeImageThumb file={file} />
            ) : category === 'video' ? (
                <SafeVideoThumb file={file} />
            ) : (
                <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
            )}

            <FileTypeLabel gap={0.25}>
                <Typography variant='caption' color='text.secondary'>
                    {typeLabel}
                </Typography>
            </FileTypeLabel>
        </FilePreviewContainer>
    );
};

interface BrieflySectionProps {
    backgroundText: string;
    onBackgroundTextChange: (value: string) => void;
    backgroundRef: RefObject<HTMLTextAreaElement>;

    showRecordingControls: boolean;
    onShowVoiceRecorder: () => void;
    recordingState: RecordingState;
    setRecordingState: (value: RecordingState) => void;
    recorderKey: number;
    voiceRecordings: { id: string; url: string; blob: Blob; duration: number }[];
    onRecordingComplete: (audioUrl: string, audioBlob: Blob, duration: number) => void;
    onClearRecording: () => void;
    onRemoveSavedRecording: (id: string) => void;

    uploadedFiles: File[];
    filePreviews: (string | undefined)[];
    onOpenFileDialog: () => void;
    onFileUpload: (files: FileList | null) => void;
    onRemoveUploadedFile: (index: number) => void;
    getFileTypeDisplayName: (file: File) => string;

    isEditingEntry: boolean;
    onAddBackgroundEntry: () => void;
    onCancelEditBackgroundEntry: () => void;
    onSaveBackgroundEntry: () => void;

    backgroundEntries: BackgroundEntry[];
    onEditBackgroundEntry: (id: string) => void;
    onDeleteBackgroundEntry: (id: string) => void;

    fileInputRef: RefObject<HTMLInputElement>;
}

const BrieflySection: FunctionComponent<BrieflySectionProps> = (props) => {
    const {
        backgroundText,
        onBackgroundTextChange,
        backgroundRef,
        showRecordingControls,
        onShowVoiceRecorder,
        recordingState,
        setRecordingState,
        recorderKey,
        voiceRecordings,
        onRecordingComplete,
        onClearRecording,
        onRemoveSavedRecording,
        uploadedFiles,
        filePreviews,
        onOpenFileDialog,
        onFileUpload,
        onRemoveUploadedFile,
        getFileTypeDisplayName,
        isEditingEntry,
        onAddBackgroundEntry,
        onCancelEditBackgroundEntry,
        onSaveBackgroundEntry,
        backgroundEntries,
        onEditBackgroundEntry,
        onDeleteBackgroundEntry,
        fileInputRef,
    } = props;

    const theme = useTheme();

    const hasBackgroundText = backgroundText.trim() !== '';
    const entriesListRef = useRef<HTMLDivElement | null>(null);
    const previousEntriesLengthRef = useRef<number>(backgroundEntries.length);

    useEffect(() => {
        if (backgroundEntries.length > previousEntriesLengthRef.current) {
            entriesListRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }

        previousEntriesLengthRef.current = backgroundEntries.length;
    }, [backgroundEntries.length]);

    return (
        <>
            <Stack direction='row' alignItems='center' gap={1} mt={2}></Stack>
            <ContainerSkill direction='row' active={hasBackgroundText}>
                <InputContent
                    placeholder='Type your answer...'
                    value={backgroundText}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onBackgroundTextChange(event.target.value)
                    }
                    ref={backgroundRef}
                />
            </ContainerSkill>
            <ActionRow>
                <Stack direction='row' gap={0.5} sx={{ flexShrink: 0 }}>
                    <ActionIconButton aria-label='Attach file' onClick={onOpenFileDialog}>
                        <AttachIcon />
                    </ActionIconButton>
                    <Stack direction='column' alignItems='center' gap={1}>
                        {!showRecordingControls && (
                            <ActionIconButton aria-label='Record draft action' onClick={onShowVoiceRecorder}>
                                <RecordIcon />
                            </ActionIconButton>
                        )}

                        {showRecordingControls && (
                            <VoiceRecord
                                key={recorderKey}
                                onRecordingComplete={onRecordingComplete}
                                showRecordingControls={showRecordingControls}
                                recordingState={recordingState}
                                setRecordingState={setRecordingState}
                                onClearRecording={onClearRecording}
                                stackDirection='row'
                            />
                        )}
                    </Stack>
                </Stack>

                {!isEditingEntry ? (
                    <MuiButton
                        color='secondary'
                        size='medium'
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={onAddBackgroundEntry}
                        sx={{ flexShrink: 0 }}
                    >
                        Add
                    </MuiButton>
                ) : (
                    <Stack direction='row' gap={1} sx={{ flexShrink: 0 }}>
                        <MuiButton color='error' size='medium' variant='text' onClick={onCancelEditBackgroundEntry}>
                            Cancel
                        </MuiButton>
                        <MuiButton color='primary' size='medium' variant='contained' onClick={onSaveBackgroundEntry}>
                            Save
                        </MuiButton>
                    </Stack>
                )}
            </ActionRow>
            {voiceRecordings.length > 0 && (
                <ContainerSkillAttachVoice direction='row' active>
                    <Stack direction='row' gap={1.5} sx={{ flexWrap: 'wrap' }}>
                        {voiceRecordings.map((item) => (
                            <VoiceItem key={item.id}>
                                <VoiceRecord
                                    recordingState='idle'
                                    setRecordingState={() => {}}
                                    initialAudioUrl={item.url}
                                    initialAudioBlob={item.blob}
                                    showRecordingControls={false}
                                    onClearRecording={() => onRemoveSavedRecording(item.id)}
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
                        {uploadedFiles.map((file, index) => (
                            <FilePreviewContainer key={`${file.name}-${index}`} size={68}>
                                {getFileCategory(file) === 'image' ? (
                                    <SafeImageThumb file={file} url={filePreviews[index]} />
                                ) : getFileCategory(file) === 'video' ? (
                                    <SafeVideoThumb file={file} url={filePreviews[index]} />
                                ) : (
                                    <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                                )}

                                <FileTypeLabel gap={0.25}>
                                    <Typography variant='caption' color='text.secondary'>
                                        {getFileTypeDisplayName(file)}
                                    </Typography>
                                </FileTypeLabel>

                                <RemoveFileButton
                                    onClick={() => onRemoveUploadedFile(index)}
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
                        ))}
                    </FilesStack>
                </ContainerSkillAttach>
            )}
            <Divider
                sx={{
                    width: '550px',
                    my: 2,
                    borderColor: theme.palette.grey[100],
                }}
            />
            {backgroundEntries.length > 0 && (
                <Stack ref={entriesListRef} sx={{ maxWidth: '550px', width: '550px' }} spacing={1}>
                    {backgroundEntries.map((entry, index) => (
                        <React.Fragment key={entry.id}>
                            <ContainerSkillAttachItem
                                direction='row'
                                active
                                sx={{ alignItems: 'stretch', justifyContent: 'space-between' }}
                            >
                                <BackgroundEntryIndex>
                                    <Typography
                                        justifyContent='center'
                                        fontWeight='584'
                                        variant='subtitle1'
                                        color='primary.main'
                                    >
                                        #{index + 1}
                                    </Typography>
                                </BackgroundEntryIndex>
                                <Stack direction='row' sx={{ flex: 1, alignItems: 'flex-start' }}>
                                    <Stack spacing={1} sx={{ flex: 1 }}>
                                        {entry.text && (
                                            <Typography
                                                variant='body2'
                                                fontWeight='400'
                                                color='text.primary'
                                                sx={{
                                                    maxWidth: 392,
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                }}
                                            >
                                                {entry.text}
                                            </Typography>
                                        )}

                                        {entry.voices.length > 0 && (
                                            <Stack direction='row' gap={1.5} sx={{ flexWrap: 'wrap' }}>
                                                {entry.voices.map((voice) => (
                                                    <VoiceItem key={voice.id}>
                                                        <VoiceRecord
                                                            recordingState='idle'
                                                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                            setRecordingState={() => {}}
                                                            initialAudioUrl={voice.url}
                                                            initialAudioBlob={voice.blob}
                                                            showRecordingControls={false}
                                                            initialAudioDuration={voice.duration}
                                                            onClearRecording={() => {}}
                                                            stackDirection='column'
                                                            fullWidth={false}
                                                        />
                                                    </VoiceItem>
                                                ))}
                                            </Stack>
                                        )}

                                        {entry.files.length > 0 && (
                                            <FilesStack
                                                direction='row'
                                                spacing={1}
                                                sx={{ width: '100%', border: 'none' }}
                                            >
                                                {entry.files.map((file, idx) => (
                                                    <EntryFileThumb
                                                        key={`${file.name}-${idx}`}
                                                        file={file}
                                                        size={50}
                                                        typeLabel={getFileTypeDisplayName(file)}
                                                    />
                                                ))}
                                            </FilesStack>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack direction='row' gap={0.5} sx={{ flexShrink: 0 }}>
                                    <ActionIconButton
                                        onClick={() => onEditBackgroundEntry(entry.id)}
                                        disabled={isEditingEntry}
                                    >
                                        <EdiIcon />
                                    </ActionIconButton>
                                    <ActionIconButton onClick={() => onDeleteBackgroundEntry(entry.id)}>
                                        <CleanIcon />
                                    </ActionIconButton>
                                </Stack>
                            </ContainerSkillAttachItem>
                        </React.Fragment>
                    ))}
                </Stack>
            )}
            <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='*/*'
                onChange={(event) => onFileUpload(event.target.files)}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default BrieflySection;
