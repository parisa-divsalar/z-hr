'use client';

import { Box, Typography } from '@mui/material';

import PricingComparison from './PricingComparison';

const Pricing = () => {
    return (
        <Box sx={{ pt: { xs: 4, md: 6 } }}>
            <Typography
                variant='h4'
                sx={{
                    textAlign: 'center',
                    fontWeight: 800,
                    letterSpacing: -0.4,
                    mb: { xs: 2.5, md: 3 },
                }}
            >
                Pricing
            </Typography>

            <PricingComparison />
        </Box>
    );
};

export default Pricing;
