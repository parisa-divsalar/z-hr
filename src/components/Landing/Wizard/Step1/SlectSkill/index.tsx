import React, { FunctionComponent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import CleanIcon from '@/assets/images/icons/clearButton.svg';
import EdiIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import TooltipIcon from '@/assets/images/icons/tooltip.svg';
import { StageWizard } from '@/components/Landing/type';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import { FilePreviewContainer, FilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';
import { SelectOption } from '@/components/UI/MuiSelectOptions';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import { BackgroundEntry } from './Briefly';
import { AllSkill } from './data';
import EditSkillDialog from './EditSkillDialog';
import {
  ActionIconButton,
  ActionRow,
  BackgroundEntryIndex,
  ContainerSkill,
  ContainerSkillAttach,
  ContainerSkillAttachItem,
  ContainerSkillAttachVoice,
  SkillContainer,
} from './styled';
import { TSkill } from './type';

interface SelectSkillProps {
  setStage: (stage: StageWizard) => void;
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
  const [isEditingEntry, setIsEditingEntry] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryBackup, setEditingEntryBackup] = useState<BackgroundEntry | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const backgroundRef = useRef<HTMLTextAreaElement>(null);
  const customSkillRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [showRecordingControls, setShowRecordingControls] = useState<boolean>(false);
  const [_voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [_voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceRecordings, setVoiceRecordings] = useState<{ id: string; url: string; blob: Blob }[]>([]);
  const [recorderKey, setRecorderKey] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [backgroundEntries, setBackgroundEntries] = useState<BackgroundEntry[]>([]);

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  const handleFocusBackground = () => {
    backgroundRef.current?.focus();
  };

  const handleShowVoiceRecorder = () => {
    setShowRecordingControls(true);
    setRecorderKey((prev) => prev + 1);
    handleFocusBackground();
  };

  const handleVoiceRecordingComplete = (audioUrl: string, audioBlob: Blob) => {
    setVoiceRecordings((prev) => [
      ...prev,
      {
        id: generateFakeUUIDv4(),
        url: audioUrl,
        blob: audioBlob,
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
    setVoiceRecordings((prev) => prev.filter((item) => item.id !== id));
  };

  const hasBackgroundText = backgroundText.trim() !== '';
  const hasSelectedSkills = skills.some((skill) => skill.selected);
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

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const fileList = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileList]);

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
    setBackgroundEntries((prev) => prev.filter((item) => item.id !== id));
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
            <TooltipContent spacing={1}>
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

      <Stack direction='row' alignItems='center' gap={1} mt={2}>
        <AtsFriendlyChip color='warning.main' label='ATS Friendly' />
      </Stack>
      <Stack sx={{ width: '498px' }} justifyContent='center' alignItems='center'>
        <Typography
          fontWeight='400'
          variant='body1'
          color='text.secondry'
          justifyContent='center'
          alignItems='center'
          textAlign='center'
        >
          Your summary shows employers you’re right for their job. We’ll help you write a great one with expert content
          you can customize.
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
            {/* دکمه رکورد فقط وقتی نشون داده میشه که در حال رکورد نباشیم */}
            {!showRecordingControls && (
              <ActionIconButton aria-label='Record draft action' onClick={handleShowVoiceRecorder}>
                <RecordIcon />
              </ActionIconButton>
            )}

            {/* رکوردر برای گرفتن ویس جدید */}
            {showRecordingControls && (
              <VoiceRecord
                key={recorderKey}
                onRecordingComplete={handleVoiceRecordingComplete}
                showRecordingControls={showRecordingControls}
                recordingState={recordingState}
                setRecordingState={setRecordingState}
                onClearRecording={handleClearVoiceRecording}
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
            onClick={handleAddBackgroundEntry}
            sx={{ flexShrink: 0 }}
          >
            Add
          </MuiButton>
        ) : (
          <Stack direction='row' gap={1} sx={{ flexShrink: 0 }}>
            <MuiButton color='error' size='medium' variant='text' onClick={handleCancelEditBackgroundEntry}>
              Cancel
            </MuiButton>
            <MuiButton color='primary' size='medium' variant='contained' onClick={handleSaveBackgroundEntry}>
              Save
            </MuiButton>
          </Stack>
        )}
      </ActionRow>
      {voiceRecordings.length > 0 && (
        <ContainerSkillAttachVoice direction='row' active sx={{ mt: 2, alignItems: 'flex-start' }}>
          <Stack direction='row' gap={1} sx={{ flexWrap: 'wrap' }}>
            {voiceRecordings.map((item) => (
              <VoiceRecord
                key={item.id}
                recordingState='idle'
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setRecordingState={() => {}}
                initialAudioUrl={item.url}
                initialAudioBlob={item.blob}
                showRecordingControls={false}
                onClearRecording={() => handleRemoveSavedRecording(item.id)}
                stackDirection='column'
                fullWidth={false}
              />
            ))}
          </Stack>
        </ContainerSkillAttachVoice>
      )}

      {uploadedFiles.length > 0 && (
        <ContainerSkillAttach direction='column' active sx={{ mt: 2, alignItems: 'flex-start' }}>
          <FilesStack direction='row' spacing={1} sx={{ width: '100%' }}>
            {uploadedFiles.map((file, index) => (
              <FilePreviewContainer key={`${file.name}-${index}`} size={68}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={filePreviews[index]}
                    alt={file.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : file.type.startsWith('video/') ? (
                  <VideoIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                ) : (
                  <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                )}

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
        <Stack sx={{ maxWidth: '550px', width: '550px' }} spacing={1}>
          {backgroundEntries.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <ContainerSkillAttachItem
                direction='row'
                active
                sx={{ alignItems: 'stretch', justifyContent: 'space-between' }}
              >
                <BackgroundEntryIndex>
                  <Typography justifyContent='center' fontWeight='584' variant='subtitle1' color='primary.main'>
                    #{index + 1}
                  </Typography>
                </BackgroundEntryIndex>
                <Stack direction='row' spacing={1} sx={{ flex: 1, alignItems: 'flex-start' }}>
                  <Stack
                    sx={{
                      minWidth: 32,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      pt: 0.5,
                    }}
                  ></Stack>

                  <Stack spacing={1} sx={{ flex: 1 }}>
                    {entry.text && (
                      <Typography variant='body2' color='text.primary' fontWeight='400'>
                        {entry.text}
                      </Typography>
                    )}

                    {entry.voices.length > 0 && (
                      <Stack direction='row' gap={1} sx={{ flexWrap: 'wrap' }}>
                        {entry.voices.map((voice) => (
                          <VoiceRecord
                            key={voice.id}
                            recordingState='idle'
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            setRecordingState={() => {}}
                            initialAudioUrl={voice.url}
                            initialAudioBlob={voice.blob}
                            showRecordingControls={false}
                            onClearRecording={() => {}}
                            stackDirection='column'
                            fullWidth={false}
                          />
                        ))}
                      </Stack>
                    )}

                    {entry.files.length > 0 && (
                      <FilesStack direction='row' spacing={1} sx={{ width: '100%', border: 'none' }}>
                        {entry.files.map((file, idx) => (
                          <FilePreviewContainer key={`${file.name}-${idx}`} size={50}>
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : file.type.startsWith('video/') ? (
                              <VideoIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                            ) : (
                              <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                            )}
                          </FilePreviewContainer>
                        ))}
                      </FilesStack>
                    )}
                  </Stack>
                </Stack>
                <Stack direction='row' gap={0.5} sx={{ flexShrink: 0 }}>
                  <ActionIconButton onClick={() => handleEditBackgroundEntry(entry.id)} disabled={isEditingEntry}>
                    <EdiIcon />
                  </ActionIconButton>
                  <ActionIconButton onClick={() => handleDeleteBackgroundEntry(entry.id)}>
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
        onChange={(event) => handleFileUpload(event.target.files)}
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
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSkillInput(event.target.value)}
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
          onClick={() => setStage('QUESTIONS')}
          disabled={!hasBackgroundText || !hasSelectedSkills}
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
