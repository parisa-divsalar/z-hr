import { FunctionComponent, useState } from 'react';

import { IconButton } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import AddAttachFile from '@/components/Landing/AI/Attach';
import {
  InputContainer,
  CircleContainer,
  InputContent,
  UploadedFilesContainer,
  FilePreviewBox,
  PreviewImage,
  RemoveFileButton,
} from '@/components/Landing/AI/Text/styled';
import { AIStatus } from '@/components/Landing/type';

interface AIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
}

const AddAttachFileAny: any = AddAttachFile;

const AIInputPrompt: FunctionComponent<AIInputPromptProps> = (props) => {
  const { setAiStatus, search, setSearch } = props;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInput = (e: any) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {uploadedFiles.length > 0 && (
        <UploadedFilesContainer>
          {uploadedFiles.map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            return (
              <FilePreviewBox key={`${file.name}-${index}`}>
                <RemoveFileButton size='small' onClick={() => handleRemoveFile(index)} aria-label='remove file'>
                  ×
                </RemoveFileButton>
                {isImage ? (
                  <PreviewImage src={URL.createObjectURL(file)} alt={file.name} />
                ) : isVideo ? (
                  <VideoIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                ) : (
                  <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
                )}
              </FilePreviewBox>
            );
          })}
        </UploadedFilesContainer>
      )}

      <InputContainer direction='row' active={!!search}>
        <AddAttachFileAny onFilesChange={setUploadedFiles} />

        <InputContent
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onInput={handleInput}
          placeholder='Type your prompt...'
        />

        {search !== '' ? (
          <IconButton onClick={() => setAiStatus('WIZARD')}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </InputContainer>
    </>
  );
};

export default AIInputPrompt;
