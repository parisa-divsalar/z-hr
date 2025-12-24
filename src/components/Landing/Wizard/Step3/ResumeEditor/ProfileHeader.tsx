'use client';

import React from 'react';

import { Check, Close } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { ProfileHeaderContainer, ProfileInfo, ActionButtons, AvatarContainer, ExperienceTextareaAutosize } from './styled';

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
}: ProfileHeaderProps) => {
    if (isEditing) {
        return (
            <ProfileHeaderContainer sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                <ActionButtons sx={{ justifyContent: 'flex-end', width: '100%' }}>
                    <IconButton size='small' onClick={onSave} color='success'>
                        <Check fontSize='small' />
                    </IconButton>
                    <IconButton size='small' onClick={onCancel} color='error'>
                        <Close fontSize='small' />
                    </IconButton>
                </ActionButtons>

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

            <ActionButtons>
                <>
                    <IconButton size='small' onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size='small'>
                        <RefreshIcon />
                    </IconButton>
                    <IconButton size='small'>
                        <StarIcon />
                    </IconButton>
                </>
            </ActionButtons>
        </ProfileHeaderContainer>
    );
};

export default ProfileHeader;
