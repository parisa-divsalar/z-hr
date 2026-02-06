import React, { useState } from 'react';

import { Button, CircularProgress, IconButton, Menu, MenuItem, Skeleton } from '@mui/material';

import DeleteIcon from '@/assets/images/icons/clean.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { SectionHeaderContainer, SectionTitle, SectionActions } from './styled';

import type { ImproveOption } from './types';

interface SectionHeaderProps {
    title: string;
    onEdit?: () => void;
    onDelete?: () => void;
    isEditing?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
    onImprove?: () => void;
    isImproving?: boolean;
    improveDisabled?: boolean;
    deleteDisabled?: boolean;
    showImproveIcon?: boolean;
    hideActions?: boolean;
    actionsSkeleton?: boolean;
    improveOptions?: ImproveOption[];
    onImproveOption?: (option: ImproveOption) => void;
}

const SectionHeader = ({
    title,
    onEdit,
    onDelete,
    isEditing,
    onSave,
    onCancel,
    isSaving,
    onImprove,
    isImproving,
    improveDisabled,
    deleteDisabled,
    showImproveIcon = true,
    hideActions,
    actionsSkeleton,
    improveOptions,
    onImproveOption,
}: SectionHeaderProps) => {
    const shouldShowActions = !hideActions || Boolean(actionsSkeleton);
    const [improveAnchor, setImproveAnchor] = useState<null | HTMLElement>(null);
    const shouldUseImproveMenu = Boolean(onImproveOption) && Boolean(improveOptions?.length);
    const improveMenuOpen = Boolean(improveAnchor);

    const handleOpenImproveMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (Boolean(improveDisabled) || Boolean(isImproving) || !onImproveOption) return;
        setImproveAnchor(event.currentTarget);
    };

    const handleCloseImproveMenu = () => {
        setImproveAnchor(null);
    };

    const handleSelectImproveOption = (option: ImproveOption) => {
        handleCloseImproveMenu();
        onImproveOption?.(option);
    };

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
                                    <IconButton
                                        size='small'
                                        onClick={onDelete}
                                        disabled={Boolean(isImproving) || Boolean(deleteDisabled) || !onDelete}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {showImproveIcon ? (
                                        <IconButton
                                            size='small'
                                            onClick={shouldUseImproveMenu ? handleOpenImproveMenu : onImprove}
                                            disabled={
                                                Boolean(improveDisabled) ||
                                                Boolean(isImproving) ||
                                                (!onImprove && !onImproveOption)
                                            }
                                        >
                                            {isImproving ? <CircularProgress size={16} /> : <StarIcon />}
                                        </IconButton>
                                    ) : null}
                                    {shouldUseImproveMenu ? (
                                        <Menu
                                            anchorEl={improveAnchor}
                                            open={improveMenuOpen}
                                            onClose={handleCloseImproveMenu}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        >
                                            {(improveOptions ?? []).map((option) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={Boolean(improveDisabled) || Boolean(isImproving)}
                                                    onClick={() => handleSelectImproveOption(option)}
                                                >
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Menu>
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
