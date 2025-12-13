import { FunctionComponent, useEffect, useMemo } from 'react';

import { Typography } from '@mui/material';

import CleanIcon from '@/assets/images/icons/clean.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import { FilePreviewContainer, FilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import { getFileCategory } from '@/components/Landing/Wizard/Step1/attachmentRules';

interface AttachViewProps {
  voiceUrl: string | null;
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const AttachView: FunctionComponent<AttachViewProps> = (props) => {
  const { uploadedFiles, setUploadedFiles, voiceUrl } = props;

  const previews = useMemo(
    () =>
      uploadedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [uploadedFiles],
  );

  useEffect(() => {
    return () => {
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <>
      {uploadedFiles.length > 0 ||
        (voiceUrl && (
          <Typography variant='h6' color='secondary.main'>
            Your prompt
          </Typography>
        ))}

      <FilesStack direction='row' spacing={1}>
        {previews.map(({ file, url }, index) => (
          <FilePreviewContainer key={`${(file as any)?.id ?? file.name}-${file.lastModified}`}>
            {getFileCategory(file) === 'image' ? (
              <img
                src={url}
                alt={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#F9F9FA',
                }}
              />
            ) : getFileCategory(file) === 'video' ? (
              <video
                src={url}
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
            ) : (
              <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
            )}

            <RemoveFileButton
              onClick={() => handleRemoveFile(index)}
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
    </>
  );
};

export default AttachView;
