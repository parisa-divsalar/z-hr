import { Box, Container, Stack, Typography } from '@mui/material';

import PlansBelowComparison from './PlansBelowComparison';
import PricingComparison from './PricingComparison';

export default function Pricing() {
    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: '#fff',
                py: { xs: 5, md: 8 },
            }}
        >
            <Container maxWidth='lg'>
                <Stack spacing={1} alignItems='center' textAlign='center'>
                    <Typography variant='h3' fontWeight={800} color='text.primary'>
                        Pricing
                    </Typography>
                    <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 760 }}>
                        Compare plans and pick the best option for your needs.
                    </Typography>
                </Stack>

                <PricingComparison />
                <PlansBelowComparison />
            </Container>
        </Box>
    );
}
