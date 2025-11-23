import { useRef, useState } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import FileIcon from '@/assets/images/icons/icon-file.svg';
import VideoIcon from '@/assets/images/icons/Icon-play.svg';
import PhotoIcon from '@/assets/images/icons/select-Icon.svg';

const AddAttachFile = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(menuAnchorEl);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAddIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
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
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...imageFiles]);
        console.log('Photos uploaded:', imageFiles);
      }
    }
  };

  // const handleRemoveFile = (index: number) => {
  //   setUploadedFiles((prev) => {
  //     const newFiles = prev.filter((_, i) => i !== index);
  //     const removedFile = prev[index];
  //     if (removedFile && removedFile.type.startsWith('image/')) {
  //       URL.revokeObjectURL(URL.createObjectURL(removedFile));
  //     }
  //     return newFiles;
  //   });
  // };

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
    </>
  );
};

// {uploadedFiles.length > 0 && (
//   <FilesStack direction='row' spacing={1}>
//     {uploadedFiles.map((file, index) => (
//       <FilePreviewContainer key={`${file.name}-${index}`}>
//         {file.type.startsWith('image/') ? (
//           <img
//             src={URL.createObjectURL(file)}
//             alt={file.name}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//             }}
//           />
//         ) : file.type.startsWith('video/') ? (
//           <VideoIcon style={{ width: '32px', height: '32px', color: '#666' }} />
//         ) : (
//           <FileIcon style={{ width: '32px', height: '32px', color: '#666' }} />
//         )}
//
//         <RemoveFileButton onClick={() => handleRemoveFile(index)}>
//           <Typography variant='caption' sx={{ fontSize: '12px', lineHeight: 1 }}>
//             ×
//           </Typography>
//         </RemoveFileButton>
//       </FilePreviewContainer>
//     ))}
//   </FilesStack>
// )}

export default AddAttachFile;
