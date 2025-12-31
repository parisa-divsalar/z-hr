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
    onImprove?: () => void;
    isImproving?: boolean;
    improveDisabled?: boolean;
    /**
     * Controls whether the "Improve" (star) icon is shown next to the edit icon.
     * Defaults to true to keep existing behavior.
     */
    showImproveIcon?: boolean;
    hideActions?: boolean;
    /**
     * When true, render skeleton placeholders for action buttons (edit/improve).
     * Useful for auto-improve flows where actions are temporarily unavailable.
     */
    actionsSkeleton?: boolean;
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
                            <Button size='small' variant='text' color='inherit' onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button size='small' variant='contained' color='primary' onClick={onSave}>
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            {actionsSkeleton ? (
                                <>
                                    <Skeleton variant='circular' width={28} height={28} />
                                    {showImproveIcon ? (
                                        <Skeleton variant='circular' width={28} height={28} />
                                    ) : null}
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
