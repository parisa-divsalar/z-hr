'use client';

import * as React from 'react';

import { Box, Button, Card, Typography } from '@mui/material';

import rectangleGalleryImg from 'src/assets/images/logo/RectangleGallery.png';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import { imageCardSliderSx } from './ImageCardSlider.styles';

type CardItem = {
    title: string;
    description: string;
    image: string;
    showButton: boolean;
};

type ImageCardProps = CardItem & {
    onClick?: () => void;
    readMoreLabel: string;
};

const rectangleGallerySrc: string =
    typeof rectangleGalleryImg === 'string' ? rectangleGalleryImg : rectangleGalleryImg.src;

function ImageCard({ title, description, image, showButton, readMoreLabel, onClick }: ImageCardProps) {
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
                            {readMoreLabel}
                        </Button>
                    ) : null}
                </Box>
            </Box>
        </Card>
    );
}

export default function ImageCardSlider() {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).blog;
    const cards = t.cards.map((c) => ({
        title: c.title,
        description: c.description,
        image: rectangleGallerySrc,
        showButton: true,
    }));

    return (
        <Box sx={imageCardSliderSx.root}>
            <Box sx={imageCardSliderSx.list}>
                {cards.map((card) => (
                    <ImageCard
                        key={card.title}
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        showButton={card.showButton}
                        readMoreLabel={t.readMore}
                        onClick={() => {
                            // Hook up navigation / analytics here.
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}


































