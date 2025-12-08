import React, { FunctionComponent, RefObject } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import AttachIcon from '@/assets/images/icons/attach.svg';
import CleanIcon from '@/assets/images/icons/clearButton.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import { FilePreviewContainer, FilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

import { InputContent } from '../../SKillInput/styled';
import {
  ActionIconButton,
  ActionRow,
  BackgroundEntryIndex,
  ContainerSkill,
  ContainerSkillAttach,
  ContainerSkillAttachItem,
  ContainerSkillAttachVoice,
} from '../styled';

export interface BackgroundEntry {
  id: string;
  text: string;
  files: File[];
  voices: {
    id: string;
    url: string;
    blob: Blob;
  }[];
}

interface BrieflySectionProps {
  backgroundText: string;
  onBackgroundTextChange: (value: string) => void;
  backgroundRef: RefObject<HTMLTextAreaElement>;

  showRecordingControls: boolean;
  onShowVoiceRecorder: () => void;
  recordingState: RecordingState;
  setRecordingState: (value: RecordingState) => void;
  recorderKey: number;
  voiceRecordings: { id: string; url: string; blob: Blob }[];
  onRecordingComplete: (audioUrl: string, audioBlob: Blob) => void;
  onClearRecording: () => void;
  onRemoveSavedRecording: (id: string) => void;

  uploadedFiles: File[];
  filePreviews: (string | undefined)[];
  onOpenFileDialog: () => void;
  onFileUpload: (files: FileList | null) => void;
  onRemoveUploadedFile: (index: number) => void;

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

  return (
    <>
      <Stack direction='row' alignItems='center' gap={1} mt={2}>
        {/* ATS Friendly chip is rendered from parent via AtsFriendlyChip */}
        {/* This wrapper keeps layout consistent if chip render logic changes */}
      </Stack>

      <ContainerSkill direction='row' active={hasBackgroundText}>
        <InputContent
          placeholder='Type your answer...'
          value={backgroundText}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onBackgroundTextChange(event.target.value)}
          ref={backgroundRef}
        />
      </ContainerSkill>

      <ActionRow>
        <Stack direction='row' gap={0.5} sx={{ flexShrink: 0 }}>
          <ActionIconButton aria-label='Attach file' onClick={onOpenFileDialog}>
            <AttachIcon />
          </ActionIconButton>
          <Stack direction='column' alignItems='center' gap={1}>
            {/* دکمه رکورد فقط وقتی نشون داده میشه که در حال رکورد نباشیم */}
            {!showRecordingControls && (
              <ActionIconButton aria-label='Record draft action' onClick={onShowVoiceRecorder}>
                <RecordIcon />
              </ActionIconButton>
            )}

            {/* رکوردر برای گرفتن ویس جدید */}
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
            startIcon={<AttachIcon />}
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

      {/* لیست ویس‌های قبلی که کنار هم نمایش داده می‌شوند */}
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
                onClearRecording={() => onRemoveSavedRecording(item.id)}
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
                <Stack direction='row' sx={{ flex: 1, alignItems: 'flex-start' }}>
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
                  <ActionIconButton onClick={() => onEditBackgroundEntry(entry.id)} disabled={isEditingEntry}>
                    <CleanIcon />
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
