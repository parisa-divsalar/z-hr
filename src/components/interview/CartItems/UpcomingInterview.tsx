'use client';

import { useMemo, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import FrameUser from '@/assets/images/icons/frameUser.svg';
import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import MuiButton from '@/components/UI/MuiButton';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';

import { CardBaseiNTER, SectionHeader, StepsLeftChip } from '../styled';

const UpcomingInterview2 = () => {
    const router = useRouter();
    const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
    const [lockedOpen, setLockedOpen] = useState(false);

    const enabled = useMemo(() => new Set((access?.enabledKeys ?? []).filter(Boolean)), [access?.enabledKeys]);
    const isChatLocked = !isAccessLoading && !enabled.has('question_interview');

    const handleContinue = () => {
        if (isAccessLoading) return;
        if (isChatLocked) {
            setLockedOpen(true);
            return;
        }
        router.push('/inter-view/chat-inter-view');
    };

    return (
        <>
            <PlanRequiredDialog
                open={lockedOpen}
                onClose={() => setLockedOpen(false)}
                title='Feature locked'
                headline='Chat Interview is disabled for your account.'
                bodyText='Buy coins/upgrade your plan, then enable it in More Features (Step 3).'
                primaryLabel='Buy plan / coins'
                primaryHref={PrivateRoutes.payment}
                secondaryLabel='Pricing'
                secondaryHref={PublicRoutes.pricing}
            />

            <CardBaseiNTER mt={2}>
                <SectionHeader>
                    <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                        Interview
                    </Typography>
                    <MuiButton
                        text='Continue'
                        color='secondary'
                        variant='contained'
                        endIcon={<ArrowRightIcon />}
                        onClick={handleContinue}
                        aria-disabled={isChatLocked || isAccessLoading}
                        sx={
                            isChatLocked || isAccessLoading
                                ? { opacity: 0.55, cursor: 'not-allowed' }
                                : undefined
                        }
                    />
                </SectionHeader>

                <Stack>
                    <Stack gap={1}>
                        <Stack direction='row' gap={1.5} alignItems='center'>
                            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                                Chat Interview
                            </Typography>
                            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                                09/09/2025
                            </Typography>
                            <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
                                9/2
                            </Typography>

                            <StepsLeftChip>7 Steps left</StepsLeftChip>
                        </Stack>
                        <Stack direction='row' gap={1} alignItems='center'>
                            <FrameUser />
                            <Typography variant='subtitle1' color='text.primary' fontWeight='492'>
                                Zayd Al-Mansoori’s Resume
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardBaseiNTER>
        </>
    );
};

export default UpcomingInterview2;
