'use client';

import { Stack, Typography } from '@mui/material';

import PricingComparison from '@/app/main/Pricing/PricingComparison';

const Pricing = () => {
    return (
        <Stack
            sx={(theme) => ({
                pt: { xs: 4, md: 6 },
                backgroundColor: theme.palette.secondary.contrastText,
            })}
            justifyContent='center'
            alignItems='center'
            width='100%'
            textAlign='center'
            gap={2}
            mt={5}
        >
            <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                Our Plans
            </Typography>

            <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.
                </Typography>
            </Typography>

            <PricingComparison />
        </Stack>
    );
};

export default Pricing;
