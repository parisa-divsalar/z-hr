'use client';

import * as React from 'react';

import { Box, Button, Card, Typography } from '@mui/material';

import rectangleGalleryImg from 'src/assets/images/logo/RectangleGallery.png';

import { imageCardSliderSx } from './ImageCardSlider.styles';

type CardItem = {
    title: string;
    description: string;
    image: string;
    showButton: boolean;
};

type ImageCardProps = CardItem & {
    onClick?: () => void;
};

const rectangleGallerySrc: string =
    typeof rectangleGalleryImg === 'string' ? rectangleGalleryImg : rectangleGalleryImg.src;

const CARDS: CardItem[] = [
    {
        title: 'Crafting Your Perfect Resume in Minutes',
        description: 'Craft your perfect resume in just ha...',
        image: rectangleGallerySrc,
        showButton: true,
    },
    {
        title: 'Build a Standout Resume Quickly',
        description: 'Create a modern, ATS-friendly resume fast...',
        image: rectangleGallerySrc,
        showButton: false,
    },
    {
        title: 'Unlock More Job Opportunities',
        description: 'Tailor your resume to roles you want...',
        image: rectangleGallerySrc,
        showButton: false,
    },
    {
        title: 'AI-Powered Cover Letter in Seconds',
        description: 'Generate a strong cover letter instantly...',
        image: rectangleGallerySrc,
        showButton: false,
    },
];

function ImageCard({ title, description, image, showButton, onClick }: ImageCardProps) {
    return (
        <Card
            elevation={2}
            onClick={onClick}
            sx={imageCardSliderSx.card}
        >
            <Box sx={imageCardSliderSx.cardInner}>
                <Box
                    component='img'
                    alt=''
                    src={image}
                    sx={imageCardSliderSx.cardImage}
                />

                {/* Gradient overlay: above image, below text */}
                <Box sx={imageCardSliderSx.gradientOverlay} />

                <Box sx={imageCardSliderSx.content}>
                    <Typography
                        variant='subtitle1'
                        sx={imageCardSliderSx.title}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant='body2'
                        sx={imageCardSliderSx.description}
                    >
                        {description}
                    </Typography>

                    {showButton ? (
                        <Button
                            size='small'
                            variant='outlined'
                            onClick={(e) => {
                                // Keep the CTA from triggering the card click if the parent wires it.
                                e.stopPropagation();
                            }}
                            sx={imageCardSliderSx.ctaButton}
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
            sx={imageCardSliderSx.root}
        >
            <Box sx={imageCardSliderSx.list}>
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
