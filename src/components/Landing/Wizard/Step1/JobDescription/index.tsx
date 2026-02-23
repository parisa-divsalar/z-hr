import React, { FunctionComponent, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { StageWizard } from '@/components/Landing/type';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import {
    FILE_CATEGORY_LIMITS,
    getFileCategory,
    getFileTypeDisplayName,
    isDuplicateFile,
    isVideoDurationValid,
    MAX_VOICE_DURATION_SECONDS,
    MAX_VOICE_RECORDINGS,
} from '@/components/Landing/Wizard/Step1/attachmentRules';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import { AtsFriendlyChip, SummaryTextContainer, ToastContainer } from './styled';
import BrieflySection, { BackgroundEntry } from '../SlectSkill/Briefly';

type ToastSeverity = AlertWrapperProps['severity'];

interface JobDescriptionProps {
    setStage: (stage: StageWizard) => void;
}

interface VoiceRecording {
    id: string;
    url: string;
    blob: Blob;
    duration: number;
}

type SectionToastT = {
    voiceLimit: (n: number) => string;
    voiceDuration: string;
    fileAlreadyUploaded: string;
    fileLimit: (limit: number, label: string) => string;
    videoDuration: string;
};

const useBrieflySectionState = (
    showToast: (message: string, severity?: ToastSeverity) => void,
    sectionT: SectionToastT,
    fileCategoryLabels: { images: string; videos: string; pdfFiles: string; wordFiles: string },
) => {
    const [backgroundText, setBackgroundText] = useState<string>('');
    const backgroundRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [_voiceUrl, setVoiceUrl] = useState<string | null>(null);
    const [_voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
    const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
    const [recorderKey, setRecorderKey] = useState<number>(0);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [backgroundEntries, setBackgroundEntries] = useState<BackgroundEntry[]>([]);

    const [isEditingEntry, setIsEditingEntry] = useState<boolean>(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [editingEntryBackup, setEditingEntryBackup] = useState<BackgroundEntry | null>(null);

    const [filePreviews, setFilePreviews] = useState<(string | undefined)[]>([]);

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
        if (voiceRecordings.length >= MAX_VOICE_RECORDINGS) {
            showToast(sectionT.voiceLimit(MAX_VOICE_RECORDINGS));
            return;
        }

        setShowRecordingControls(true);
        setRecorderKey((prev) => prev + 1);
        handleFocusBackground();
    };

    const handleVoiceRecordingComplete = (audioUrl: string, audioBlob: Blob, duration: number) => {
        const isRecordingValid = duration > 0 && audioBlob.size > 0;
        if (!isRecordingValid) {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        if (duration > MAX_VOICE_DURATION_SECONDS) {
            showToast(sectionT.voiceDuration, 'info');
            setShowRecordingControls(false);
            setVoiceUrl(null);
            setVoiceBlob(null);
            return;
        }

        if (voiceRecordings.length >= MAX_VOICE_RECORDINGS) {
            showToast(sectionT.voiceLimit(MAX_VOICE_RECORDINGS));
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

    const handleFileUpload = (files: FileList | null) => {
        if (!files) {
            return;
        }

        const filesArray = Array.from(files);

        const processFiles = async () => {
            const acceptedFiles: File[] = [];

            for (const file of filesArray) {
                const category = getFileCategory(file);
                const currentFiles = [...uploadedFiles, ...acceptedFiles];

                if (isDuplicateFile(file, currentFiles)) {
                    showToast(sectionT.fileAlreadyUploaded);
                    continue;
                }

                if (category !== 'other') {
                    const limit = FILE_CATEGORY_LIMITS[category];
                    const currentCount =
                        uploadedFiles.filter((existingFile) => getFileCategory(existingFile) === category).length +
                        acceptedFiles.filter((fileItem) => getFileCategory(fileItem) === category).length;
                    const label =
                        category === 'image'
                            ? fileCategoryLabels.images
                            : category === 'video'
                              ? fileCategoryLabels.videos
                              : category === 'pdf'
                                ? fileCategoryLabels.pdfFiles
                                : fileCategoryLabels.wordFiles;

                    if (currentCount >= limit) {
                        showToast(sectionT.fileLimit(limit, label));
                        continue;
                    }
                }

                if (category === 'video') {
                    const isDurationValid = await isVideoDurationValid(file);
                    if (!isDurationValid) {
                        showToast(sectionT.videoDuration);
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

        void processFiles();
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

        setBackgroundEntries((prev) => [...prev, newEntry]);
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

            return prev.filter((item) => item.id !== id);
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

        setBackgroundEntries((prev) => [...prev, updatedEntry]);

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
            setBackgroundEntries((prev) => [...prev, editingEntryBackup]);
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
            return prev.filter((item) => item.id !== id);
        });
    };

    return {
        backgroundText,
        setBackgroundText,
        backgroundRef,
        fileInputRef,
        showRecordingControls,
        onShowVoiceRecorder: handleShowVoiceRecorder,
        recordingState,
        setRecordingState,
        recorderKey,
        voiceRecordings,
        setVoiceRecordings,
        onRecordingComplete: handleVoiceRecordingComplete,
        onClearRecording: handleClearVoiceRecording,
        onRemoveSavedRecording: handleRemoveSavedRecording,
        uploadedFiles,
        setUploadedFiles,
        filePreviews,
        onOpenFileDialog: handleOpenFileDialog,
        onFileUpload: handleFileUpload,
        onRemoveUploadedFile: handleRemoveUploadedFile,
        isEditingEntry,
        setIsEditingEntry,
        onAddBackgroundEntry: handleAddBackgroundEntry,
        onCancelEditBackgroundEntry: handleCancelEditBackgroundEntry,
        onSaveBackgroundEntry: handleSaveBackgroundEntry,
        backgroundEntries,
        setBackgroundEntries,
        onEditBackgroundEntry: handleEditBackgroundEntry,
        onDeleteBackgroundEntry: handleDeleteBackgroundEntry,
    };
};

const JobDescription: FunctionComponent<JobDescriptionProps> = ({ setStage }) => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).landing.wizard.jobDescription;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const fileCategoryLabels = getMainTranslations(locale).landing.wizard.fileCategoryLabels;
    const { data: wizardData, updateField, recomputeAllFiles } = useWizardStore();

    const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const sectionOne = useBrieflySectionState(showToast, t, fileCategoryLabels);
    const sectionTwo = useBrieflySectionState(showToast, t, fileCategoryLabels);

    useEffect(() => {
        const jd = wizardData.jobDescription as
            | { text?: string; voices?: VoiceRecording[]; files?: File[] }
            | undefined;
        if (jd) {
            if (jd.text) {
                sectionOne.setBackgroundText(jd.text);
            }
            if (jd.files && jd.files.length > 0) {
                sectionOne.setUploadedFiles(jd.files);
            }
            if (jd.voices && jd.voices.length > 0) {
                sectionOne.setVoiceRecordings(
                    jd.voices.map((v) => ({
                        id: v.id ?? generateFakeUUIDv4(),
                        url: v.url,
                        blob: v.blob,
                        duration: v.duration,
                    })),
                );
            }
        }

        const addInfo = wizardData.additionalInfo as
            | { text?: string; voices?: VoiceRecording[]; files?: File[] }
            | undefined;
        if (addInfo) {
            if (addInfo.text) {
                sectionTwo.setBackgroundText(addInfo.text);
            }
            if (addInfo.files && addInfo.files.length > 0) {
                sectionTwo.setUploadedFiles(addInfo.files);
            }
            if (addInfo.voices && addInfo.voices.length > 0) {
                sectionTwo.setVoiceRecordings(
                    addInfo.voices.map((v) => ({
                        id: v.id ?? generateFakeUUIDv4(),
                        url: v.url,
                        blob: v.blob,
                        duration: v.duration,
                    })),
                );
            }
        }
    }, []);

    const hasJobDescription = [sectionOne, sectionTwo].some((section) => section.backgroundEntries.length > 0);

    const persistSectionToStore = useCallback(
        (
            target: 'jobDescription' | 'additionalInfo',
            section: {
                backgroundText: string;
                uploadedFiles: File[];
                voiceRecordings: VoiceRecording[];
                backgroundEntries: BackgroundEntry[];
            },
        ) => {
            const mergedText = [
                ...section.backgroundEntries.map((e) => e.text).filter((t) => t && t.trim() !== ''),
            ].join('\n\n');

            const mergedFiles = [
                ...section.backgroundEntries.flatMap((e) => e.files),
            ];
            const mergedVoices = [
                ...section.backgroundEntries.flatMap((e) => e.voices),
            ];

            updateField(target, {
                text: mergedText,
                files: mergedFiles,
                voices: mergedVoices,
            } as unknown as (typeof wizardData)[typeof target]);

            recomputeAllFiles();
        },
        [updateField, wizardData, recomputeAllFiles],
    );

    const handleBack = () => {
        persistSectionToStore('jobDescription', {
            backgroundText: sectionOne.backgroundText,
            uploadedFiles: sectionOne.uploadedFiles,
            voiceRecordings: sectionOne.voiceRecordings as VoiceRecording[],
            backgroundEntries: sectionOne.backgroundEntries,
        });
        persistSectionToStore('additionalInfo', {
            backgroundText: sectionTwo.backgroundText,
            uploadedFiles: sectionTwo.uploadedFiles,
            voiceRecordings: sectionTwo.voiceRecordings as VoiceRecording[],
            backgroundEntries: sectionTwo.backgroundEntries,
        });

        setStage('CERTIFICATION');
    };

    const handleNext = () => {
        persistSectionToStore('jobDescription', {
            backgroundText: sectionOne.backgroundText,
            uploadedFiles: sectionOne.uploadedFiles,
            voiceRecordings: sectionOne.voiceRecordings as VoiceRecording[],
            backgroundEntries: sectionOne.backgroundEntries,
        });
        persistSectionToStore('additionalInfo', {
            backgroundText: sectionTwo.backgroundText,
            uploadedFiles: sectionTwo.uploadedFiles,
            voiceRecordings: sectionTwo.voiceRecordings as VoiceRecording[],
            backgroundEntries: sectionTwo.backgroundEntries,
        });

        setStage('QUESTIONS');
    };

    return (
        <Stack
            alignItems='center'
            justifyContent='center'
            dir={dir}
            sx={{
                width: '100%',
                px: { xs: 2, sm: 4, md: 6 },
                boxSizing: 'border-box',
                direction: dir,
            }}
        >
            <Typography variant='h5' color='text.primary' fontWeight='584' mt={2}>
                8. {t.title}{' '}
            </Typography>

            <Stack direction='row' alignItems='center' gap={1} mt={1}>
                <AtsFriendlyChip color='warning' label={t.atsFriendly} />
            </Stack>
            <SummaryTextContainer key={`summary-1-${locale}`}>
                <Typography
                    fontWeight='400'
                    variant='subtitle2'
                    color='text.secondary'
                    justifyContent='center'
                    alignItems='center'
                    textAlign='center'
                    mt={1}
                >
                    {getMainTranslations(locale).landing.wizard.jobDescription.summaryText}
                </Typography>
            </SummaryTextContainer>

            {toastInfo && (
                <ToastContainer>
                    <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                </ToastContainer>
            )}

            <BrieflySection
                dir={dir}
                backgroundText={sectionOne.backgroundText}
                onBackgroundTextChange={sectionOne.setBackgroundText}
                backgroundRef={sectionOne.backgroundRef as RefObject<HTMLTextAreaElement>}
                showRecordingControls={sectionOne.showRecordingControls}
                onShowVoiceRecorder={sectionOne.onShowVoiceRecorder}
                recordingState={sectionOne.recordingState}
                setRecordingState={sectionOne.setRecordingState}
                recorderKey={sectionOne.recorderKey}
                voiceRecordings={sectionOne.voiceRecordings}
                onRecordingComplete={sectionOne.onRecordingComplete}
                onClearRecording={sectionOne.onClearRecording}
                onRemoveSavedRecording={sectionOne.onRemoveSavedRecording}
                uploadedFiles={sectionOne.uploadedFiles}
                filePreviews={sectionOne.filePreviews}
                onOpenFileDialog={sectionOne.onOpenFileDialog}
                onFileUpload={sectionOne.onFileUpload}
                onRemoveUploadedFile={sectionOne.onRemoveUploadedFile}
                getFileTypeDisplayName={getFileTypeDisplayName}
                isEditingEntry={sectionOne.isEditingEntry}
                onAddBackgroundEntry={sectionOne.onAddBackgroundEntry}
                onCancelEditBackgroundEntry={sectionOne.onCancelEditBackgroundEntry}
                onSaveBackgroundEntry={sectionOne.onSaveBackgroundEntry}
                backgroundEntries={sectionOne.backgroundEntries}
                onEditBackgroundEntry={sectionOne.onEditBackgroundEntry}
                onDeleteBackgroundEntry={sectionOne.onDeleteBackgroundEntry}
                fileInputRef={sectionOne.fileInputRef as RefObject<HTMLInputElement>}
                placeholderText={t.placeholder}
                addButtonLabel={t.add}
                cancelLabel={t.cancel}
                saveLabel={t.save}
            />

            <Typography variant='h5' color='text.primary' fontWeight='584' mt={4}>
                9. {t.title2}{' '}
            </Typography>

            <Stack direction='row' alignItems='center' gap={1} mt={1}>
                <AtsFriendlyChip color='warning' label={t.atsFriendly} />
            </Stack>
            <SummaryTextContainer key={`summary-2-${locale}`}>
                <Typography
                    fontWeight='400'
                    variant='subtitle2'
                    color='text.secondary'
                    justifyContent='center'
                    alignItems='center'
                    textAlign='center'
                    mt={1}
                >
                    {getMainTranslations(locale).landing.wizard.jobDescription.summaryText2}
                </Typography>
            </SummaryTextContainer>
            <BrieflySection
                dir={dir}
                backgroundText={sectionTwo.backgroundText}
                onBackgroundTextChange={sectionTwo.setBackgroundText}
                backgroundRef={sectionTwo.backgroundRef as RefObject<HTMLTextAreaElement>}
                showRecordingControls={sectionTwo.showRecordingControls}
                onShowVoiceRecorder={sectionTwo.onShowVoiceRecorder}
                recordingState={sectionTwo.recordingState}
                setRecordingState={sectionTwo.setRecordingState}
                recorderKey={sectionTwo.recorderKey}
                voiceRecordings={sectionTwo.voiceRecordings}
                onRecordingComplete={sectionTwo.onRecordingComplete}
                onClearRecording={sectionTwo.onClearRecording}
                onRemoveSavedRecording={sectionTwo.onRemoveSavedRecording}
                uploadedFiles={sectionTwo.uploadedFiles}
                filePreviews={sectionTwo.filePreviews}
                onOpenFileDialog={sectionTwo.onOpenFileDialog}
                onFileUpload={sectionTwo.onFileUpload}
                onRemoveUploadedFile={sectionTwo.onRemoveUploadedFile}
                getFileTypeDisplayName={getFileTypeDisplayName}
                isEditingEntry={sectionTwo.isEditingEntry}
                onAddBackgroundEntry={sectionTwo.onAddBackgroundEntry}
                onCancelEditBackgroundEntry={sectionTwo.onCancelEditBackgroundEntry}
                onSaveBackgroundEntry={sectionTwo.onSaveBackgroundEntry}
                backgroundEntries={sectionTwo.backgroundEntries}
                onEditBackgroundEntry={sectionTwo.onEditBackgroundEntry}
                onDeleteBackgroundEntry={sectionTwo.onDeleteBackgroundEntry}
                fileInputRef={sectionTwo.fileInputRef as RefObject<HTMLInputElement>}
                placeholderText={t.placeholder}
                addButtonLabel={t.add}
                cancelLabel={t.cancel}
                saveLabel={t.save}
            />

            <Stack mt={4} mb={6} direction={dir === 'rtl' ? 'row-reverse' : 'row'} gap={3}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    size='large'
                    startIcon={dir === 'rtl' ? undefined : <ArrowBackIcon />}
                    endIcon={dir === 'rtl' ? <ArrowBackIcon /> : undefined}
                    onClick={handleBack}
                >
                    {t.back}
                </MuiButton>

                <MuiButton
                    color='secondary'
                    startIcon={dir === 'rtl' ? <ArrowRightIcon /> : undefined}
                    endIcon={dir === 'rtl' ? undefined : <ArrowRightIcon />}
                    size='large'
                    onClick={handleNext}
                    disabled={!hasJobDescription}
                >
                    {t.next}
                </MuiButton>
            </Stack>
        </Stack>
    );
};

interface ToastInfo {
    id: number;
    message: string;
    severity: ToastSeverity;
}

export default JobDescription;
