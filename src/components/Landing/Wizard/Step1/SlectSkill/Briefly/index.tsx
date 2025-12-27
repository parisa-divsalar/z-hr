import React, { FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import CleanIcon from '@/assets/images/icons/clean.svg';
import EdiIcon from '@/assets/images/icons/edit.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import { FilePreviewContainer, FileTypeLabel } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import VideoThumbDialog from '@/components/Landing/Wizard/Step1/Common/VideoThumbDialog';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

import { getFileCategory } from '../../attachmentRules';
import { InputContent } from '../../SKillInput/styled';
import {
    ActionButtonsGroup,
    ActionIconButton,
    ActionRow,
    AddEntryButton,
    BackgroundEntryIndex,
    ContainerSkill,
    ContainerSkillAttachTop,
    ContainerSkillAttachVoice,
    EntriesDivider,
    EntriesListContainer,
    EntryActionsGroup,
    EntryBodyRow,
    EntryBodyStack,
    EntryFilesStack,
    EntryItemContainer,
    EntryText,
    FullWidthFilesStack,
    TransparentRemoveFileButton,
    VoiceItem,
    WrapRow,
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
        } catch {
            // ignore conversion failures; we'll fall back to the generic file icon
        }
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

    return <VideoThumbDialog url={displayUrl} title={file.name} />;
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

    const hasBackgroundText = backgroundText.trim() !== '';
    const hasDraft = hasBackgroundText || uploadedFiles.length > 0 || voiceRecordings.length > 0;
    const shouldHighlightAddButton = backgroundEntries.length === 0 && !isEditingEntry;
    const entriesListRef = useRef<HTMLDivElement | null>(null);
    const previousEntriesLengthRef = useRef<number>(backgroundEntries.length);

    useEffect(() => {
        if (backgroundEntries.length > previousEntriesLengthRef.current) {
            // When a new entry is added, avoid scrolling "up" (which feels like the page jumps under the navbar).
            // Only scroll down inside the resume-builder scroll container if the list is below the visible viewport.
            const container = document.getElementById('resume-builder-scroll') as HTMLElement | null;
            const listEl = entriesListRef.current;
            if (container && listEl) {
                requestAnimationFrame(() => {
                    const cRect = container.getBoundingClientRect();
                    const lRect = listEl.getBoundingClientRect();

                    const isListAboveViewport = lRect.top < cRect.top;
                    const isListBelowViewport = lRect.bottom > cRect.bottom;

                    // Never scroll upward automatically.
                    if (!isListAboveViewport && isListBelowViewport) {
                        const delta = lRect.bottom - cRect.bottom;
                        container.scrollTo({ top: container.scrollTop + delta + 16, behavior: 'smooth' });
                    }
                });
            }
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
                    style={{ maxHeight: 240 }}
                    ref={backgroundRef}
                />
            </ContainerSkill>
            <ActionRow>
                <ActionButtonsGroup direction='row' gap={0.5}>
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
                </ActionButtonsGroup>

                {!isEditingEntry ? (
                    <AddEntryButton
                        color='primary'
                        size='medium'
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={onAddBackgroundEntry}
                        disabled={!hasDraft}
                        highlighted={shouldHighlightAddButton}
                    >
                        Add
                    </AddEntryButton>
                ) : (
                    <ActionButtonsGroup direction='row' gap={1}>
                        <MuiButton color='error' size='medium' variant='text' onClick={onCancelEditBackgroundEntry}>
                            Cancel
                        </MuiButton>
                        <MuiButton
                            color='primary'
                            size='medium'
                            variant='contained'
                            onClick={onSaveBackgroundEntry}
                            disabled={!hasDraft}
                        >
                            Save
                        </MuiButton>
                    </ActionButtonsGroup>
                )}
            </ActionRow>
            {voiceRecordings.length > 0 && (
                <ContainerSkillAttachVoice direction='row' active>
                    <WrapRow direction='row' gap={1.5}>
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
                    </WrapRow>
                </ContainerSkillAttachVoice>
            )}
            {uploadedFiles.length > 0 && (
                <ContainerSkillAttachTop direction='column' active>
                    <FullWidthFilesStack direction='row' spacing={1}>
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

                                <TransparentRemoveFileButton onClick={() => onRemoveUploadedFile(index)}>
                                    <CleanIcon width={24} height={24} />
                                </TransparentRemoveFileButton>
                            </FilePreviewContainer>
                        ))}
                    </FullWidthFilesStack>
                </ContainerSkillAttachTop>
            )}
            <EntriesDivider />
            {backgroundEntries.length > 0 && (
                <EntriesListContainer ref={entriesListRef} spacing={1}>
                    {backgroundEntries.map((entry, index) => (
                        <React.Fragment key={entry.id}>
                            <EntryItemContainer direction='row' active>
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
                                <EntryBodyRow direction='row'>
                                    <EntryBodyStack spacing={1}>
                                        {entry.text && (
                                            <EntryText variant='body2' fontWeight='400' color='text.primary'>
                                                {entry.text}
                                            </EntryText>
                                        )}

                                        {entry.voices.length > 0 && (
                                            <WrapRow direction='row' gap={1.5}>
                                                {entry.voices.map((voice) => (
                                                    <VoiceItem key={voice.id}>
                                                        <VoiceRecord
                                                            recordingState='idle'
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
                                            </WrapRow>
                                        )}

                                        {entry.files.length > 0 && (
                                            <EntryFilesStack direction='row' spacing={1}>
                                                {entry.files.map((file, idx) => (
                                                    <EntryFileThumb
                                                        key={`${file.name}-${idx}`}
                                                        file={file}
                                                        size={50}
                                                        typeLabel={getFileTypeDisplayName(file)}
                                                    />
                                                ))}
                                            </EntryFilesStack>
                                        )}
                                    </EntryBodyStack>
                                </EntryBodyRow>
                                <EntryActionsGroup direction='row' gap={0.5}>
                                    <ActionIconButton
                                        onClick={() => onEditBackgroundEntry(entry.id)}
                                        disabled={isEditingEntry}
                                    >
                                        <EdiIcon />
                                    </ActionIconButton>
                                    <ActionIconButton onClick={() => onDeleteBackgroundEntry(entry.id)}>
                                        <CleanIcon />
                                    </ActionIconButton>
                                </EntryActionsGroup>
                            </EntryItemContainer>
                        </React.Fragment>
                    ))}
                </EntriesListContainer>
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
