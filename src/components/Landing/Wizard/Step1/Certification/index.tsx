import React, { FunctionComponent, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { StageWizard } from '@/components/Landing/type';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
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
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import BrieflySection, { BackgroundEntry } from '../SlectSkill/Briefly';
import { ToastContainer } from './styled';

interface CertificationProps {
    setStage: (stage: StageWizard) => void;
}

type ToastSeverity = AlertWrapperProps['severity'];

interface ToastInfo {
    id: number;
    message: string;
    severity: ToastSeverity;
}

const Certification: FunctionComponent<CertificationProps> = ({ setStage }) => {
    const { data: wizardData, updateField, recomputeAllFiles } = useWizardStore();

    const [backgroundText, setBackgroundText] = useState<string>('');
    const backgroundRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [_voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [_voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
    const [voiceRecordings, setVoiceRecordings] = useState<{ id: string; url: string; blob: Blob; duration: number }[]>(
        [],
    );
    const [recorderKey, setRecorderKey] = useState<number>(0);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [backgroundEntries, setBackgroundEntries] = useState<BackgroundEntry[]>(() => {
        const stored = (wizardData.certificates as unknown as Array<Partial<BackgroundEntry>>) ?? [];
        return stored.map((entry) => ({
            id: entry.id ?? generateFakeUUIDv4(),
            text: entry.text ?? '',
            files: (entry.files as File[]) ?? [],
            voices:
                (entry.voices as { id: string; url: string; blob: Blob; duration: number }[])?.map((voice) => ({
                    id: voice.id ?? generateFakeUUIDv4(),
                    url: voice.url,
                    blob: voice.blob,
                    duration: voice.duration,
                })) ?? [],
        }));
    });

    const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isEditingEntry, setIsEditingEntry] = useState<boolean>(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [editingEntryBackup, setEditingEntryBackup] = useState<BackgroundEntry | null>(null);

    const isVoiceLimitReached = voiceRecordings.length >= MAX_VOICE_RECORDINGS;

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

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const [filePreviews, setFilePreviews] = useState<(string | undefined)[]>([]);

    const persistEntriesToStore = useCallback(
        (entries: BackgroundEntry[]) => {
            const payload = entries.map((entry) => ({
                text: entry.text,
                voices: entry.voices,
                files: entry.files,
            }));
            updateField('certificates', payload as unknown as typeof wizardData.certificates);
            recomputeAllFiles();
        },
        [updateField, wizardData.certificates, recomputeAllFiles],
    );

    useEffect(() => {
        const urls = uploadedFiles.map((file) =>
            getFileCategory(file) === 'image' || getFileCategory(file) === 'video' ? URL.createObjectURL(file) : undefined,
        );

        setFilePreviews(urls);

        return () => {
            urls.forEach((url) => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [uploadedFiles]);

    const handleFocusBackground = () => {
        backgroundRef.current?.focus();
    };

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

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const ensureFileWithId = (file: File) => {
        const f = file as File & { id?: string };
        if (!f.id) {
            f.id = generateFakeUUIDv4();
        }
        return f;
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

            acceptedFiles.push(ensureFileWithId(file));
        }

        if (acceptedFiles.length > 0) {
            setUploadedFiles((prev) => [...prev.map((file) => ensureFileWithId(file)), ...acceptedFiles]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveUploadedFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    };

    const handleAddBackgroundEntry = () => {
        const hasText = backgroundText.trim() !== '';
        const hasFiles = uploadedFiles.length > 0;
        const hasVoices = voiceRecordings.length > 0;

        if (!hasText && !hasFiles && !hasVoices) {
            return;
        }

        const newEntry: BackgroundEntry = {
            id: generateFakeUUIDv4(),
            text: backgroundText.trim(),
            files: uploadedFiles,
            voices: voiceRecordings,
        };

        setBackgroundEntries((prev) => {
            const next = [...prev, newEntry];
            persistEntriesToStore(next);
            return next;
        });
        setIsEditingEntry(false);
        setEditingEntryId(null);
        setEditingEntryBackup(null);

        setBackgroundText('');
        setUploadedFiles([]);
        setVoiceRecordings([]);
        setShowRecordingControls(false);
        setVoiceUrl(null);
        setVoiceBlob(null);
    };

    const handleEditBackgroundEntry = (id: string) => {
        setIsEditingEntry(true);
        setBackgroundEntries((prev) => {
            const entry = prev.find((item) => item.id === id);

            if (!entry) {
                return prev;
            }

            setEditingEntryId(entry.id);
            setEditingEntryBackup(entry);
            setBackgroundText(entry.text);
            setUploadedFiles(entry.files);
            setVoiceRecordings(entry.voices);

            const remaining = prev.filter((item) => item.id !== id);
            persistEntriesToStore(remaining);
            return remaining;
        });
    };

    const handleSaveBackgroundEntry = () => {
        const hasText = backgroundText.trim() !== '';
        const hasFiles = uploadedFiles.length > 0;
        const hasVoices = voiceRecordings.length > 0;

        if (!hasText && !hasFiles && !hasVoices) {
            return;
        }

        const updatedEntry: BackgroundEntry = {
            id: editingEntryId ?? generateFakeUUIDv4(),
            text: backgroundText.trim(),
            files: uploadedFiles,
            voices: voiceRecordings,
        };

        setBackgroundEntries((prev) => {
            const next = [...prev, updatedEntry];
            persistEntriesToStore(next);
            return next;
        });

        setIsEditingEntry(false);
        setEditingEntryId(null);
        setEditingEntryBackup(null);

        setBackgroundText('');
        setUploadedFiles([]);
        setVoiceRecordings([]);
        setShowRecordingControls(false);
        setVoiceUrl(null);
        setVoiceBlob(null);
    };

    const handleCancelEditBackgroundEntry = () => {
        if (editingEntryBackup) {
            setBackgroundEntries((prev) => {
                const next = [...prev, editingEntryBackup];
                persistEntriesToStore(next);
                return next;
            });
        }

        setIsEditingEntry(false);
        setEditingEntryId(null);
        setEditingEntryBackup(null);

        setBackgroundText('');
        setUploadedFiles([]);
        setVoiceRecordings([]);
        setShowRecordingControls(false);
        setVoiceUrl(null);
        setVoiceBlob(null);
    };

    const handleDeleteBackgroundEntry = (id: string) => {
        setBackgroundEntries((prev) => {
            const target = prev.find((item) => item.id === id);
            if (target) {
                target.voices.forEach((voice) => URL.revokeObjectURL(voice.url));
            }
            const next = prev.filter((item) => item.id !== id);
            persistEntriesToStore(next);
            return next;
        });
    };

    const hasDraft = backgroundText.trim() !== '' || uploadedFiles.length > 0 || voiceRecordings.length > 0;
    const hasCertifications = hasDraft || backgroundEntries.length > 0;

    const handleBack = () => {
        if (hasDraft) {
            if (isEditingEntry) {
                handleSaveBackgroundEntry();
            } else {
                handleAddBackgroundEntry();
            }
        } else {
            persistEntriesToStore(backgroundEntries);
        }

        setStage('EXPERIENCE');
    };

    const handleNext = () => {
        if (hasDraft) {
            if (isEditingEntry) {
                handleSaveBackgroundEntry();
            } else {
                handleAddBackgroundEntry();
            }
        } else {
            persistEntriesToStore(backgroundEntries);
        }

        setStage('DESCRIPTION');
    };

    return (
        <Stack alignItems='center' justifyContent='center' height='100%'>
            <Typography variant='h5' color='text.primary' fontWeight='584' mt={2}>
                7. Capture your certifications
            </Typography>

            {toastInfo && (
                <ToastContainer>
                    <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                </ToastContainer>
            )}

            <BrieflySection
                backgroundText={backgroundText}
                onBackgroundTextChange={setBackgroundText}
                backgroundRef={backgroundRef as RefObject<HTMLTextAreaElement>}
                showRecordingControls={showRecordingControls}
                onShowVoiceRecorder={handleShowVoiceRecorder}
                recordingState={recordingState}
                setRecordingState={setRecordingState}
                recorderKey={recorderKey}
                voiceRecordings={voiceRecordings}
                onRecordingComplete={handleVoiceRecordingComplete}
                onClearRecording={handleClearVoiceRecording}
                onRemoveSavedRecording={handleRemoveSavedRecording}
                uploadedFiles={uploadedFiles}
                filePreviews={filePreviews}
                onOpenFileDialog={handleOpenFileDialog}
                onFileUpload={handleFileUpload}
                onRemoveUploadedFile={handleRemoveUploadedFile}
                getFileTypeDisplayName={getFileTypeDisplayName}
                isEditingEntry={isEditingEntry}
                onAddBackgroundEntry={handleAddBackgroundEntry}
                onCancelEditBackgroundEntry={handleCancelEditBackgroundEntry}
                onSaveBackgroundEntry={handleSaveBackgroundEntry}
                backgroundEntries={backgroundEntries}
                onEditBackgroundEntry={handleEditBackgroundEntry}
                onDeleteBackgroundEntry={handleDeleteBackgroundEntry}
                fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
            />

            <Stack mt={4} mb={6} direction='row' gap={3}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    size='large'
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Back
                </MuiButton>

                <MuiButton
                    color='secondary'
                    endIcon={<ArrowRightIcon />}
                    size='large'
                    onClick={handleNext}
                    disabled={!hasCertifications}
                >
                    Next
                </MuiButton>
            </Stack>
        </Stack>
    );
};

export default Certification;
