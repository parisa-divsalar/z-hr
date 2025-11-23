import { useRef } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';

interface MuiFileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (files: FileList | null) => void;
  children?: React.ReactNode;
}

const MuiFileUpload: React.FC<MuiFileUploadProps> = ({
  label = 'Upload File',
  accept = '*/*',
  multiple = false,
  disabled = false,
  onChange,
  children,
  ...rest
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      onChange?.(files);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <Stack>
        {label && (
          <Typography variant='caption' color={disabled ? 'grey.100' : 'text.secondary'}>
            {label}
          </Typography>
        )}
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
          {...rest}
        />
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          sx={{
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '8px',
            padding: '8px',
            '&:hover': {
              backgroundColor: 'grey.50',
            },
          }}
        >
          {children || <AddIcon />}
        </IconButton>
      </Stack>
    );
};

export default MuiFileUpload;

