'use client';

import React from 'react';

import { Check, Close } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import { ProfileHeaderContainer, ProfileInfo, ActionButtons, AvatarContainer, ProfileFieldTextareaAutosize } from './styled';

type ProfileField = 'fullName' | 'dateOfBirth' | 'headline';

interface ProfileHeaderProps {
    fullName?: string;
    dateOfBirth?: string;
    headline?: string;
    isEditing?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    draftProfile?: { fullName: string; dateOfBirth: string; headline: string };
    onDraftChange?: (field: ProfileField, value: string) => void;
}

const ProfileHeader = ({
    fullName,
    dateOfBirth,
    headline,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    draftProfile,
    onDraftChange,
}: ProfileHeaderProps) => {
    return (
        <ProfileHeaderContainer>
            <AvatarContainer>
                {/*<MuiAvatar size='large' src={AvatarSrc.src} />*/}
                <ProfileInfo>
                    {isEditing ? (
                        <Box display='flex' flexDirection='column' gap={1}>
                            <ProfileFieldTextareaAutosize
                                minRows={1}
                                placeholder='Full name'
                                value={draftProfile?.fullName ?? ''}
                                onChange={(e) => onDraftChange?.('fullName', e.target.value)}
                            />
                            <ProfileFieldTextareaAutosize
                                minRows={1}
                                placeholder='Date of birth'
                                value={draftProfile?.dateOfBirth ?? ''}
                                onChange={(e) => onDraftChange?.('dateOfBirth', e.target.value)}
                            />
                            <ProfileFieldTextareaAutosize
                                minRows={1}
                                placeholder='Headline'
                                value={draftProfile?.headline ?? ''}
                                onChange={(e) => onDraftChange?.('headline', e.target.value)}
                            />
                        </Box>
                    ) : (
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
                    )}
                </ProfileInfo>
            </AvatarContainer>

            <ActionButtons>
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
                )}
            </ActionButtons>
        </ProfileHeaderContainer>
    );
};

export default ProfileHeader;
