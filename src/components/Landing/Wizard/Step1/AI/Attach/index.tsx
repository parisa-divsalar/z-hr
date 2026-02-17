import { FunctionComponent, useRef, useState } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import PhotoIcon from '@/assets/images/icons/select-Icon.svg';
import { usePlanGate } from '@/hooks/usePlanGate';

interface AddAttachFileProps {
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const AddAttachFile: FunctionComponent<AddAttachFileProps> = (props) => {
  const { uploadedFiles, setUploadedFiles } = props;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(menuAnchorEl);
  const { guardAction, planDialog } = usePlanGate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  console.log({ uploadedFiles });
  const handleAddIconClick = (event: React.MouseEvent<HTMLElement>) => {
    guardAction(() => setMenuAnchorEl(event.currentTarget), 'file_upload');
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAddFile = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleAddVideo = () => {
    videoInputRef.current?.click();
    handleMenuClose();
  };

  const handleAddPhoto = () => {
    photoInputRef.current?.click();
    handleMenuClose();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
      console.log('Files uploaded:', fileArray);
    }
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (files) {
      const videoFiles = Array.from(files).filter((file) => file.type.startsWith('video/'));
      if (videoFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...videoFiles]);
      }
    }
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files) {
      const imageFiles = Array.from(files).filter(
        (file) =>
          file.type.startsWith('image/') ||
          file.name
            .toLowerCase()
            .match(/\.(png|jpe?g|jfif|pjpeg|pjp|webp|avif|gif|bmp|svg|ico|apng|tiff?|heic|heif)$/),
      );
      if (imageFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...imageFiles]);
        console.log('Photos uploaded:', imageFiles);
      }
    }
  };

  return (
    <>
      <IconButton onClick={handleAddIconClick}>
        <AddIcon />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: '0.5rem',
          },
        }}
      >
        <MenuItem onClick={handleAddFile}>
          <FileIcon style={{ marginRight: '8px' }} />
          Add file
        </MenuItem>
        <MenuItem onClick={handleAddVideo}>
          <VideoIcon style={{ marginRight: '8px' }} />
          Add video
        </MenuItem>
        <MenuItem onClick={handleAddPhoto}>
          <PhotoIcon style={{ marginRight: '8px' }} />
          Add photo
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type='file'
        accept='*/*'
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        style={{ display: 'none' }}
      />
      <input
        ref={videoInputRef}
        type='file'
        accept='video/*'
        multiple
        onChange={(e) => handleVideoUpload(e.target.files)}
        style={{ display: 'none' }}
      />
      <input
        ref={photoInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={(e) => handlePhotoUpload(e.target.files)}
        style={{ display: 'none' }}
      />
      {planDialog}
    </>
  );
};

export default AddAttachFile;
