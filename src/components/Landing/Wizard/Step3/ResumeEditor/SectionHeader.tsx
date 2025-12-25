import React from 'react';

import { Check, Close } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { SectionHeaderContainer, SectionTitle, SectionActions } from './styled';

interface SectionHeaderProps {
    title: string;
    onEdit?: () => void;
    isEditing?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    onImprove?: () => void;
    isImproving?: boolean;
    improveDisabled?: boolean;
}

const SectionHeader = ({
    title,
    onEdit,
    isEditing,
    onSave,
    onCancel,
    onImprove,
    isImproving,
    improveDisabled,
}: SectionHeaderProps) => {
    return (
        <SectionHeaderContainer>
            <SectionTitle variant='subtitle1'>{title}</SectionTitle>
            <SectionActions>
                {isEditing ? (
                    <>
                        <IconButton size='small' onClick={onSave} color='success'>
                            <Check fontSize='small' />
                        </IconButton>
                        <IconButton size='small' onClick={onCancel} color='error'>
                            <Close fontSize='small' />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton size='small' onClick={onEdit} disabled={Boolean(isImproving)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            size='small'
                            onClick={onImprove}
                            disabled={Boolean(improveDisabled) || Boolean(isImproving) || !onImprove}
                        >
                            {isImproving ? <CircularProgress size={16} /> : <StarIcon />}
                        </IconButton>
                    </>
                )}
            </SectionActions>
        </SectionHeaderContainer>
    );
};

export default SectionHeader;
