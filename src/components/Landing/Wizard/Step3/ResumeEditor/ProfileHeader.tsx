'use client';

import React from 'react';

import { Box, Button, IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import {
    ProfileHeaderContainer,
    ProfileInfo,
    ActionButtons,
    AvatarContainer,
    ExperienceTextareaAutosize,
} from './styled';

const normalizeMainSkill = (value?: string) =>
    String(value ?? '')
        .trim()
        .replace(/^web\s*frameworks?\s*:\s*/i, '')
        .replace(/^wizard\s*status\s*:\s*/i, '')
        .trim();

interface ProfileHeaderProps {
    fullName?: string;
    dateOfBirth?: string;
    visaStatus?: string;
    mainSkill?: string;
    phone?: string;
    email?: string;
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
    visaStatus,
    mainSkill,
    phone,
    email,
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
                    placeholder={'Full name\n\nDD/MM/YYYY\n\nVisa Status: ... • ...\n\nPhone: ...\nEmail: ...'}
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
                        <Typography variant='body1' fontWeight='500' color='text.primary' gutterBottom>
                            {fullName || '—'}
                        </Typography>
                        <Typography variant='subtitle2' color='text.primary' gutterBottom>
                            {dateOfBirth || '—'}
                        </Typography>
                        <Typography variant='subtitle2' color='text.primary' gutterBottom>
                            {`Visa Status: ${visaStatus || '—'}`}
                            {normalizeMainSkill(mainSkill) ? ` • ${normalizeMainSkill(mainSkill)}` : ''}
                        </Typography>
                        <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                            <Box component='span'>{`Phone: ${phone || '—'}`}</Box>
                            <Box component='span' sx={{ display: 'inline-block', mx: 2 }} />
                            <Box component='span'>{`Email: ${email || '—'}`}</Box>
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
