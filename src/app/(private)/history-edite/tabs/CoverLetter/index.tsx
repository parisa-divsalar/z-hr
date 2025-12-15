'use client';

import { useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import { IconButton, Stack, TextField, Typography } from '@mui/material';

import CopyIcon from '@/assets/images/icons/copy.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';

const normalizeToParagraph = (text: string) =>
    text.replace(/\r\n/g, '\n').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

const CoverLetter = () => {
    const [body, setBody] = useState(() =>
        normalizeToParagraph(
            'Dear Hiring Manager,\n\nI’m excited to apply for this role. With my background and experience, I believe I can contribute immediately.',
        ),
    );
    const [draftBody, setDraftBody] = useState(body);
    const [isEditingBody, setIsEditingBody] = useState(false);

    const startEditBody = () => {
        setDraftBody(body);
        setIsEditingBody(true);
    };

    const saveBody = () => {
        const next = normalizeToParagraph(draftBody);
        if (next) setBody(next);
        setIsEditingBody(false);
    };

    const cancelBody = () => {
        setDraftBody(body);
        setIsEditingBody(false);
    };

    const handleCopy = async () => {
        const textToCopy = isEditingBody ? draftBody : body;

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

    return (
        <Stack gap={2}>
            <Stack direction='row' alignItems='flex-start' justifyContent='space-between' gap={2} sx={{ minWidth: 0 }}>
                <Stack direction='row' alignItems='center' gap={1.5} minWidth={0} flex={1}>
                    <Typography
                        variant='body1'
                        fontWeight={492}
                        color='text.primary'
                        sx={{
                            whiteSpace: 'normal',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                        }}
                    >
                        Cover letter
                    </Typography>
                </Stack>

                <Stack direction='row' alignItems='center' gap={1} flexShrink={0}>
                    {isEditingBody ? (
                        <>
                            <IconButton size='small' onClick={saveBody} color='success' aria-label='Save'>
                                <Check fontSize='small' />
                            </IconButton>
                            <IconButton size='small' onClick={cancelBody} color='error' aria-label='Cancel'>
                                <Close fontSize='small' />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton size='small' onClick={startEditBody} aria-label='Edit'>
                            <EditIcon />
                        </IconButton>
                    )}

                    <IconButton size='small' onClick={handleCopy} aria-label='Copy'>
                        <CopyIcon />
                    </IconButton>
                    <IconButton size='small' aria-label='Refresh'>
                        <RefreshIcon />
                    </IconButton>
                    <IconButton size='small' aria-label='Favorite'>
                        <StarIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack minWidth={0}>
                {isEditingBody ? (
                    <TextField
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') cancelBody();
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveBody();
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
                            '& .MuiInputBase-root': {
                                alignItems: 'flex-start',
                            },
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
                        sx={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                        }}
                    >
                        {body}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default CoverLetter;
