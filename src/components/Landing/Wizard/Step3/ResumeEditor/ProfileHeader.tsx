'use client';

import React from 'react';

import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';

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
        .replace(/^visa\s*status\s*:\s*/i, '')
        .replace(/^visa\s*:\s*/i, '')
        .trim();

const normalizeVisaStatusValue = (value?: unknown): string => {
    const raw = String(value ?? '')
        .replace(/\r/g, '')
        .trim();
    if (!raw) return '';

    const lines = raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

    for (const line of lines) {
        const m = line.match(/^(?:visa\s*status|visa)\s*:\s*(.*)$/i);
        if (m) return String(m[1] ?? '').trim();
    }

    return String(lines[0] ?? raw).trim();
};

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
    isSaving?: boolean;
    editText?: string;
    onEditTextChange?: (value: string) => void;
    hideActions?: boolean;
    /**
     * Controls whether the "Improve" (star) icon is shown next to the edit icon.
     * Defaults to true to keep existing behavior.
     */
    showImproveIcon?: boolean;
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
    isSaving,
    editText,
    onEditTextChange,
    hideActions,
    showImproveIcon = true,
}: ProfileHeaderProps) => {
    const normalizedVisaStatus = normalizeVisaStatusValue(visaStatus);
    const normalizedMainSkill = normalizeMainSkill(mainSkill);

    const shouldAppendMainSkill = (() => {
        if (!normalizedMainSkill) return false;
        if (!normalizedVisaStatus) return true;

        const visaLower = normalizedVisaStatus.toLowerCase();
        const skillLower = normalizedMainSkill.toLowerCase();

        if (skillLower.includes('visa status')) return false;
        if (visaLower === skillLower) return false;
        if (visaLower.includes(skillLower)) return false;

        return true;
    })();

    if (isEditing) {
        return (
            <ProfileHeaderContainer sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                {!hideActions ? (
                    <ActionButtons sx={{ justifyContent: 'flex-end', width: '100%' }}>
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
                            {`Visa Status: ${normalizedVisaStatus || '—'}`}
                            {shouldAppendMainSkill ? ` • ${normalizedMainSkill}` : ''}
                        </Typography>
                        <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                            <Box component='span'>{`Phone: ${phone || '—'}`}</Box>
                            <Box component='span' sx={{ mx: 1.5 }}>
                                {' | '}
                            </Box>
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

                        {showImproveIcon ? (
                            <IconButton size='small'>
                                <StarIcon />
                            </IconButton>
                        ) : null}
                    </>
                </ActionButtons>
            ) : null}
        </ProfileHeaderContainer>
    );
};

export default ProfileHeader;
