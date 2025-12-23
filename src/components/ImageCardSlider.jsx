'use client';

import * as React from 'react';

import { Box, Button, Card, Typography } from '@mui/material';

import rectangleGalleryImg from '@/assets/images/logo/RectangleGallery.png';

const CARDS = [
    {
        title: 'Crafting Your Perfect Resume in Minutes',
        description: 'Craft your perfect resume in just ha...',
        image: rectangleGalleryImg?.src ?? rectangleGalleryImg,
        showButton: true,
    },
    {
        title: 'Build a Standout Resume Quickly',
        description: 'Create a modern, ATS-friendly resume fast...',
        image: rectangleGalleryImg?.src ?? rectangleGalleryImg,
        showButton: false,
    },
    {
        title: 'Unlock More Job Opportunities',
        description: 'Tailor your resume to roles you want...',
        image: rectangleGalleryImg?.src ?? rectangleGalleryImg,
        showButton: false,
    },
    {
        title: 'AI-Powered Cover Letter in Seconds',
        description: 'Generate a strong cover letter instantly...',
        image: rectangleGalleryImg?.src ?? rectangleGalleryImg,
        showButton: false,
    },
];

function ImageCard({ title, description, image, showButton, onClick }) {
    return (
        <Card
            elevation={2}
            onClick={onClick}
            sx={(theme) => ({
                flex: '0 0 auto',
                width: 292,
                height: 392,
                borderRadius: theme.shape.borderRadius * 6, // 24px when default radius is 4
                overflow: 'hidden',
                cursor: 'pointer',
                transform: 'translateZ(0)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4],
                },
            })}
        >
            <Box sx={{ position: 'relative', width: 1, height: 1 }}>
                <Box
                    component='img'
                    alt=''
                    src={image}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                    }}
                />

                {/* Gradient overlay: above image, below text */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 100%)',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        p: 2.5, // 20px
                        color: 'common.white',
                        textAlign: 'left',
                    }}
                >
                    <Typography
                        variant='subtitle1'
                        sx={{
                            fontWeight: 600,
                            lineHeight: 1.25,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant='body2'
                        sx={{
                            mt: 1,
                            opacity: 0.85,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>

                    {showButton ? (
                        <Button
                            size='small'
                            variant='outlined'
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            sx={{
                                mt: 1.5,
                                px: 2,
                                py: 0.5,
                                minWidth: 'unset',
                                color: 'common.white',
                                borderColor: 'common.white',
                                borderRadius: 4, // 16px when default radius is 4
                                textTransform: 'none',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    borderColor: 'common.white',
                                },
                            }}
                        >
                            More
                        </Button>
                    ) : null}
                </Box>
            </Box>
        </Card>
    );
}

export default function ImageCardSlider() {
    return (
        <Box
            sx={{
                width: 1,
                bgcolor: 'common.white',
                px: 4, // 32px
                py: 3, // 24px
                overflowX: { xs: 'auto', md: 'hidden' },
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 3, // 24px
                    width: 'max-content',
                }}
            >
                {CARDS.map((card) => (
                    <ImageCard
                        key={card.title}
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        showButton={card.showButton}
                        onClick={() => {
                            // Hook up navigation / analytics here.
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
