'use client';

import { FC } from 'react';

import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';

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
import { PublicRoutes } from '@/config/routes';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

const FooterMain: FC = () => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).footer;

    const COLUMNS: { title: string; items: string[] }[] = [
        { title: t.columnTitle, items: [t.columnItem, t.columnItem, t.columnItem, t.columnItem, t.columnItem] },
        { title: t.columnTitle, items: [t.columnItem, t.columnItem, t.columnItem, t.columnItem, t.columnItem] },
        { title: t.columnTitle, items: [t.columnItem, t.columnItem] },
        { title: t.columnTitle, items: [t.columnItem, t.columnItem, t.columnItem, t.columnItem] },
    ];

    return (
        <FooterWrapper as='footer' dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <FooterContent>
                <TopRow direction='row'>
                    <Stack direction='row' alignItems='center' gap={2}>
                        <AppImage src={logo} width={24} height={34} />

                        <Typography variant='h4' fontWeight='700' color='common.white'>
                            Z-CV
                        </Typography>

                        <Typography variant='subtitle2' fontWeight='400' sx={{ color: 'rgba(255,255,255,0.55)' }}>
                            {t.aiResumeMaker}
                        </Typography>
                    </Stack>

                    <TopNav direction='row'>
                        <Link href='/' style={{ textDecoration: 'none' }}>
                            <TopNavItem variant='subtitle2'>{t.home}</TopNavItem>
                        </Link>
                        <TopNavItem fontWeight='400' variant='subtitle2'>
                            {t.aboutUs}
                        </TopNavItem>
                        <Link href={PublicRoutes.pricing} style={{ textDecoration: 'none' }}>
                            <TopNavItem fontWeight='400' variant='subtitle2'>
                                {t.ourPlans}
                            </TopNavItem>
                        </Link>
                        <Link href={PublicRoutes.contactUs} style={{ textDecoration: 'none' }}>
                            <TopNavItem fontWeight='400' variant='subtitle2'>
                                {t.contactUs}
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

                <BottomNote variant='caption'>{t.copyright}</BottomNote>
            </FooterContent>
        </FooterWrapper>
    );
};

export default FooterMain;
