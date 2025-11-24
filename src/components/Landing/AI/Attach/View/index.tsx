import { FunctionComponent } from 'react';

import { Typography } from '@mui/material';

import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import { FilePreviewContainer, FilesStack, RemoveFileButton } from '@/components/Landing/AI/Attach/View/styled';

interface AttachViewProps {
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const AttachView: FunctionComponent<AttachViewProps> = (props) => {
  const { uploadedFiles, setUploadedFiles } = props;

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      const removedFile = prev[index];
      if (removedFile && removedFile.type.startsWith('image/')) {
        URL.revokeObjectURL(URL.createObjectURL(removedFile));
      }
      return newFiles;
    });
  };

  return (
    <FilesStack direction='row' spacing={1}>
      {uploadedFiles.map((file, index) => (
        <FilePreviewContainer key={`${file.name}-${index}`}>
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

          <RemoveFileButton onClick={() => handleRemoveFile(index)}>
            <Typography variant='caption' sx={{ fontSize: '12px', lineHeight: 1 }}>
              ×
            </Typography>
          </RemoveFileButton>
        </FilePreviewContainer>
      ))}
    </FilesStack>
  );
};

export default AttachView;
