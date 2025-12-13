import React, { FunctionComponent, KeyboardEvent, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';

interface VideoThumbDialogProps {
    url: string;
    title?: string;
}

const VideoThumbDialog: FunctionComponent<VideoThumbDialogProps> = ({ url, title }) => {
    const [open, setOpen] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
        }
    };

    return (
        <>
            <Box
                role='button'
                tabIndex={0}
                aria-label={title ? `Play ${title}` : 'Play video'}
                onClick={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                sx={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    outline: 'none',
                    borderRadius: 'inherit',
                    backgroundColor: '#F9F9FA',
                    '&:focus-visible': {
                        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.65)',
                    },
                }}
            >
                <video
                    src={url}
                    preload='metadata'
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        pointerEvents: 'none',
                        backgroundColor: '#F9F9FA',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '999px',
                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <PlayArrowRoundedIcon sx={{ color: '#fff', fontSize: 18, ml: '1px' }} />
                    </Box>
                </Box>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
                <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} py={1.5} gap={2}>
                    <Typography variant='subtitle1' fontWeight={600} color='text.primary' sx={{ minWidth: 0 }}>
                        {title ?? 'Video'}
                    </Typography>
                    <IconButton aria-label='Close' onClick={() => setOpen(false)} size='small'>
                        <CloseRoundedIcon />
                    </IconButton>
                </Stack>

                <DialogContent sx={{ pt: 0 }}>
                    <video
                        key={url}
                        src={url}
                        controls
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            maxHeight: '70vh',
                            display: 'block',
                            backgroundColor: '#000',
                            borderRadius: 8,
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default VideoThumbDialog;


