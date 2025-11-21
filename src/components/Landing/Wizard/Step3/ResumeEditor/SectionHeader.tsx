import React from 'react';

import { Check, Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { SectionHeaderContainer, SectionTitle, SectionActions } from './styled';

interface SectionHeaderProps {
  title: string;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const SectionHeader = ({ title, onEdit, isEditing, onSave, onCancel }: SectionHeaderProps) => {
  return (
    <SectionHeaderContainer>
      <SectionTitle variant="h6">
        {title}
      </SectionTitle>
      <SectionActions>
        {isEditing ? (
          <>
            <IconButton size="small" onClick={onSave} color="success">
              <Check fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onCancel} color="error">
              <Close fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size="small">
              <RefreshIcon />
            </IconButton>
            <IconButton size="small">
              <StarIcon />
            </IconButton>
          </>
        )}
      </SectionActions>
    </SectionHeaderContainer>
  );
};

export default SectionHeader;
