'use client';

import { FC } from 'react';

import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import { PublicRoutes } from '@/config/routes';
import {
    BottomNote,
    ColumnItem,
    ColumnTitle,
    FooterContent,
    FooterGrid,
    FooterWrapper,
    LinksGrid,
    SocialIconBox,
    SocialList,
    TopNav,
    TopNavItem,
    TopRow,
} from '@/app/main/FooterMain/styled';
import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';

const COLUMNS: { title: string; items: string[] }[] = [
    { title: 'Title', items: ['Item', 'Item', 'Item', 'Item', 'Item'] },
    { title: 'Title', items: ['Item', 'Item', 'Item', 'Item', 'Item'] },
    { title: 'Title', items: ['Item', 'Item'] },
    { title: 'Title', items: ['Item', 'Item', 'Item', 'Item'] },
];

const FooterMain: FC = () => {
    return (
        <FooterWrapper as='footer' dir='ltr'>
            <FooterContent>
                <TopRow direction='row'>
                    <Stack direction='row' alignItems='center' gap={2}>
                        <AppImage src={logo} width={24} height={34} />

                        <Typography variant='h4' fontWeight='700' color='common.white'>
                            Z-CV
                        </Typography>

                        <Typography variant='subtitle2' fontWeight='400' sx={{ color: 'rgba(255,255,255,0.55)' }}>
                            AI Resume Maker
                        </Typography>
                    </Stack>

                    <TopNav direction='row'>
                        <Link href='/' style={{ textDecoration: 'none' }}>
                            <TopNavItem variant='subtitle2'>Home</TopNavItem>
                        </Link>
                        <TopNavItem fontWeight='400' variant='subtitle2'>
                            About Us
                        </TopNavItem>
                        <Link href={PublicRoutes.pricing} style={{ textDecoration: 'none' }}>
                            <TopNavItem fontWeight='400' variant='subtitle2'>
                                Our Plans
                            </TopNavItem>
                        </Link>
                        <Link href={PublicRoutes.contactUs} style={{ textDecoration: 'none' }}>
                            <TopNavItem fontWeight='400' variant='subtitle2'>
                                Contact Us
                            </TopNavItem>
                        </Link>
                    </TopNav>
                </TopRow>

                <FooterGrid>
                    <LinksGrid>
                        {COLUMNS.map((col, colIdx) => (
                            <Box key={`${col.title}-${colIdx}`}>
                                <ColumnTitle variant='h5' fontWeight='584'>
                                    {col.title}
                                </ColumnTitle>
                                {col.items.map((item, idx) => (
                                    <ColumnItem
                                        key={`${col.title}-${colIdx}-${idx}`}
                                        variant='subtitle1'
                                        fontWeight='492'
                                    >
                                        {item}
                                    </ColumnItem>
                                ))}
                            </Box>
                        ))}
                    </LinksGrid>

                    <Box sx={{ minWidth: { xs: 0, md: 260 }, width: { xs: '100%', md: 'auto' } }}>
                        <SocialList>
                            <Stack direction='row' alignItems='center' gap={1.5}>
                                <SocialIconBox>
                                    <InstagramIcon fontSize='small' />
                                </SocialIconBox>
                                <Stack>
                                    <Typography variant='body2' fontWeight='400' color='text.secondary'>
                                        Instagram
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='700' color='common.white'>
                                        ZCVOFFICIAL
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction='row' alignItems='center' gap={1.5}>
                                <SocialIconBox>
                                    <TelegramIcon fontSize='small' />
                                </SocialIconBox>
                                <Stack>
                                    <Typography variant='body2' fontWeight='400' color='text.secondary'>
                                        Telegram
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='700' color='common.white'>
                                        ZCVOFFICIAL
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction='row' alignItems='center' gap={1.5}>
                                <SocialIconBox>
                                    <YouTubeIcon fontSize='small' />
                                </SocialIconBox>
                                <Stack>
                                    <Typography variant='body2' fontWeight='400' color='text.secondary'>
                                        YouTube
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='700' color='common.white'>
                                        ZCVOFFICIAL
                                    </Typography>
                                </Stack>
                            </Stack>
                        </SocialList>
                    </Box>
                </FooterGrid>

                <BottomNote variant='caption'>©2025 Z-AI Company</BottomNote>
            </FooterContent>
        </FooterWrapper>
    );
};

export default FooterMain;
