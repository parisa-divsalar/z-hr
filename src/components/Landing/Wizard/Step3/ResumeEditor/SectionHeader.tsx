import React from 'react';

import { Button, CircularProgress, IconButton, Skeleton } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { SectionHeaderContainer, SectionTitle, SectionActions } from './styled';

interface SectionHeaderProps {
    title: string;
    onEdit?: () => void;
    isEditing?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
    onImprove?: () => void;
    isImproving?: boolean;
    improveDisabled?: boolean;
    showImproveIcon?: boolean;
    hideActions?: boolean;
    actionsSkeleton?: boolean;
}

const SectionHeader = ({
    title,
    onEdit,
    isEditing,
    onSave,
    onCancel,
    isSaving,
    onImprove,
    isImproving,
    improveDisabled,
    showImproveIcon = true,
    hideActions,
    actionsSkeleton,
}: SectionHeaderProps) => {
    const shouldShowActions = !hideActions || Boolean(actionsSkeleton);

    return (
        <SectionHeaderContainer>
            <SectionTitle variant='subtitle1'>{title}</SectionTitle>
            {shouldShowActions ? (
                <SectionActions>
                    {isEditing ? (
                        <>
                            <Button
                                size='small'
                                variant='text'
                                color='inherit'
                                onClick={onCancel}
                                disabled={Boolean(isSaving)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='small'
                                variant='contained'
                                color='primary'
                                onClick={onSave}
                                disabled={Boolean(isSaving) || !onSave}
                                startIcon={isSaving ? <CircularProgress size={14} color='inherit' /> : undefined}
                            >
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            {actionsSkeleton ? (
                                <>
                                    <Skeleton variant='circular' width={28} height={28} />
                                    {showImproveIcon ? <Skeleton variant='circular' width={28} height={28} /> : null}
                                </>
                            ) : (
                                <>
                                    <IconButton size='small' onClick={onEdit} disabled={Boolean(isImproving)}>
                                        <EditIcon />
                                    </IconButton>
                                    {showImproveIcon ? (
                                        <IconButton
                                            size='small'
                                            onClick={onImprove}
                                            disabled={Boolean(improveDisabled) || Boolean(isImproving) || !onImprove}
                                        >
                                            {isImproving ? <CircularProgress size={16} /> : <StarIcon />}
                                        </IconButton>
                                    ) : null}
                                </>
                            )}
                        </>
                    )}
                </SectionActions>
            ) : null}
        </SectionHeaderContainer>
    );
};

export default SectionHeader;
