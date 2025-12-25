'use client';

import React from 'react';

import { Button, IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import {
    ProfileHeaderContainer,
    ProfileInfo,
    ActionButtons,
    AvatarContainer,
    ExperienceTextareaAutosize,
} from './styled';

interface ProfileHeaderProps {
    fullName?: string;
    dateOfBirth?: string;
    headline?: string;
    isEditing?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    editText?: string;
    onEditTextChange?: (value: string) => void;
    hideActions?: boolean;
}

const ProfileHeader = ({
    fullName,
    dateOfBirth,
    headline,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    editText,
    onEditTextChange,
    hideActions,
}: ProfileHeaderProps) => {
    if (isEditing) {
        return (
            <ProfileHeaderContainer sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                {!hideActions ? (
                    <ActionButtons sx={{ justifyContent: 'flex-end', width: '100%' }}>
                        <Button size='small' variant='text' color='inherit' onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button size='small' variant='contained' color='primary' onClick={onSave}>
                            Save
                        </Button>
                    </ActionButtons>
                ) : null}

                <ExperienceTextareaAutosize
                    value={editText ?? ''}
                    placeholder={'Full name\nDate of birth\nHeadline'}
                    onChange={(e) => onEditTextChange?.(e.target.value)}
                />
            </ProfileHeaderContainer>
        );
    }

    return (
        <ProfileHeaderContainer>
            <AvatarContainer>
                {/*<MuiAvatar size='large' src={AvatarSrc.src} />*/}
                <ProfileInfo>
                    <>
                        <Typography variant='subtitle1' fontWeight='600' color='text.primary' gutterBottom>
                            {fullName || '—'}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' gutterBottom>
                            {dateOfBirth || '—'}
                        </Typography>
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {headline || '—'}
                        </Typography>
                    </>
                </ProfileInfo>
            </AvatarContainer>

            {!hideActions ? (
                <ActionButtons>
                    <>
                        <IconButton size='small' onClick={onEdit}>
                            <EditIcon />
                        </IconButton>

                        <IconButton size='small'>
                            <StarIcon />
                        </IconButton>
                    </>
                </ActionButtons>
            ) : null}
        </ProfileHeaderContainer>
    );
};

export default ProfileHeader;
