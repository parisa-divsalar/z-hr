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
        description: 'Craft your perfect resume in just ...',
        image: rectangleGallerySrc,
        showButton: true,
    },
    {
        title: 'Build a Standout Resume Quickly Resume',
        description: 'Create a polished resume in only... ',
        image: rectangleGallerySrc,
        showButton: true,
    },
    {
        title: 'Fast and Easy Resume Creation Guide',
        description: 'Get a complete resume ready in...',
        image: rectangleGallerySrc,
        showButton: true,
    },
    {
        title: 'Swift Resume Builder: Your Path to Success',
        description: 'Finish your resume in a quick ...',
        image: rectangleGallerySrc,
        showButton: true,
    },
];

function ImageCard({ title, description, image, showButton, onClick }: ImageCardProps) {
    return (
        <Card
            elevation={2}
            role='button'
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            sx={imageCardSliderSx.card}
        >
            <Box sx={imageCardSliderSx.cardInner}>
                <Box component='img' alt='' src={image} sx={imageCardSliderSx.cardImage} />

                <Box className='imageCardOverlay' sx={imageCardSliderSx.gradientOverlay} />

                <Box className='imageCardContent' sx={imageCardSliderSx.content}>
                    <Typography variant='subtitle1' fontWeight='584' sx={imageCardSliderSx.title}>
                        {title}
                    </Typography>

                    <Typography variant='body2' fontWeight='492' sx={imageCardSliderSx.description}>
                        {description}
                    </Typography>

                    {showButton ? (
                        <Button
                            className='imageCardButton'
                            size='small'
                            variant='outlined'
                            onClick={(e) => {
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
        <Box sx={imageCardSliderSx.root}>
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
