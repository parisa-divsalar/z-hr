'use client';

import { useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Stack, TextField, Typography } from '@mui/material';

import CopyIcon from '@/assets/images/icons/copy.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import MuiButton from '@/components/UI/MuiButton';

type CoverLetterItem = {
    id: string;
    title: string;
    body: string;
    draftBody: string;
    isEditing: boolean;
};

const normalizeCoverLetter = (text: string) => text.replace(/\r\n/g, '\n').trim();

const DEFAULT_COVER_LETTER = `Dear Hiring Manager,

I am excited to apply for the Motion Design position at your company. With a strong background in front-end development, I have honed my skills in creating engaging and user-friendly interfaces. My experience collaborating with designers has equipped me with a keen eye for aesthetics and a deep understanding of how motion can enhance user experience.

I am passionate about bringing ideas to life through dynamic visuals and innovative design solutions. I look forward to the opportunity to contribute my skills to your team and help elevate your projects to new heights.

Best regards,

Zayd Al-Mansoori’s`;

const iconButtonSx = {
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
    p: 0,
    borderRadius: 2,
    border: 'none',
    backgroundColor: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    '&:hover': { backgroundColor: 'grey.50' },
    '& svg': {
        width: 24,
        height: 24,
        flexShrink: 0,
        display: 'block',
    },
    // These icon svgs include an outer border rect; hide it in this tab.
    '& svg > rect': {
        display: 'none',
    },
} as const;

const CoverLetter = () => {
    const [items, setItems] = useState<CoverLetterItem[]>(() => {
        const body = normalizeCoverLetter(DEFAULT_COVER_LETTER);
        return [
            { id: 'cl-1', title: 'Cover letter', body, draftBody: body, isEditing: false },
            { id: 'cl-2', title: 'Cover letter', body, draftBody: body, isEditing: false },
        ];
    });

    const startEdit = (id: string) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, isEditing: true, draftBody: it.body } : { ...it, isEditing: false },
            ),
        );
    };

    const save = (id: string) => {
        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== id) return it;
                const next = normalizeCoverLetter(it.draftBody);
                return { ...it, body: next || it.body, draftBody: next || it.body, isEditing: false };
            }),
        );
    };

    const cancel = (id: string) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, draftBody: it.body, isEditing: false } : it)));
    };

    const updateDraft = (id: string, value: string) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, draftBody: value } : it)));
    };

    const handleCopy = async (id: string) => {
        const item = items.find((x) => x.id === id);
        if (!item) return;
        const textToCopy = item.isEditing ? item.draftBody : item.body;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                return;
            }
        } catch {
            // fall back
        }

        try {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch {
            // ignore
        }
    };

    const handleAddNew = () => {
        const body = normalizeCoverLetter(DEFAULT_COVER_LETTER);
        setItems((prev) => [
            ...prev.map((it) => ({ ...it, isEditing: false })),
            {
                id: `cl-${Date.now()}`,
                title: 'Cover letter',
                body,
                draftBody: body,
                isEditing: true,
            },
        ]);
    };

    return (
        <Stack gap={2}>
            {items.map((item) => (
                <Stack
                    key={item.id}
                    gap={2}
                    sx={{
                        border: '1px solid',
                        borderColor: 'grey.100',
                        borderRadius: 2,
                        backgroundColor: 'common.white',
                        px: 2.5,
                        py: 2.25,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant='body1'
                        fontWeight={492}
                        color='text.primary'
                        sx={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                        {item.title}
                    </Typography>

                    {item.isEditing ? (
                        <TextField
                            value={item.draftBody}
                            onChange={(e) => updateDraft(item.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') cancel(item.id);
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save(item.id);
                            }}
                            placeholder='Type/paste your cover letter...'
                            multiline
                            minRows={6}
                            maxRows={14}
                            variant='standard'
                            size='small'
                            fullWidth
                            autoFocus={false}
                            InputProps={{ disableUnderline: true }}
                            sx={{
                                minWidth: 0,
                                '& .MuiInputBase-root': { alignItems: 'flex-start' },
                                '& .MuiInputBase-input': {
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    whiteSpace: 'pre-wrap',
                                },
                            }}
                        />
                    ) : (
                        <Typography
                            variant='body2'
                            color='text.primary'
                            sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}
                        >
                            {item.body}
                        </Typography>
                    )}

                    <Stack direction='row' alignItems='center' gap={1}>
                        {item.isEditing ? (
                            <>
                                <IconButton sx={iconButtonSx} onClick={() => save(item.id)} aria-label='Save'>
                                    <Check fontSize='small' />
                                </IconButton>
                                <IconButton sx={iconButtonSx} onClick={() => cancel(item.id)} aria-label='Cancel'>
                                    <Close fontSize='small' />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton sx={iconButtonSx} onClick={() => startEdit(item.id)} aria-label='Edit'>
                                <EditIcon />
                            </IconButton>
                        )}

                        <IconButton sx={iconButtonSx} onClick={() => handleCopy(item.id)} aria-label='Copy'>
                            <CopyIcon />
                        </IconButton>
                        <IconButton sx={iconButtonSx} aria-label='Refresh'>
                            <RefreshIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            ))}

            <Stack alignItems='flex-start'>
                <MuiButton
                    onClick={handleAddNew}
                    text='Add New'
                    variant='outlined'
                    color='secondary'
                    size='small'
                    startIcon={<AddIcon fontSize='small' />}
                />
            </Stack>
        </Stack>
    );
};

export default CoverLetter;
