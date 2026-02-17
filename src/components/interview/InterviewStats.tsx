'use client';

import { useMemo, useState } from 'react';

import { Grid, Stack, Typography } from '@mui/material';

import InterviewIcon from '@/assets/images/dashboard/imag/interview.svg';
import InterVoice from '@/assets/images/icons/interVoice.svg';
import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';

import { useInterviewDialog } from './StartInterviewDialogProvider';
import { SmallCardBase, StatValueRow } from './styled';

const InterviewStats = () => {
    const { openStartDialog } = useInterviewDialog();
    const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
    const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
    const [lockedFeatureLabel, setLockedFeatureLabel] = useState<string>('this feature');

    const enabled = useMemo(() => new Set((access?.enabledKeys ?? []).filter(Boolean)), [access?.enabledKeys]);
    const isChatLocked = !isAccessLoading && !(enabled.has('question_interview') || enabled.has('text_interview'));
    const isVoiceLocked = !isAccessLoading && !enabled.has('voice_interview');

    const openLockedDialog = (label: string) => {
        setLockedFeatureLabel(label);
        setLockedDialogOpen(true);
    };

    const handleChatInterview = () => {
        if (isAccessLoading) return;
        if (isChatLocked) {
            openLockedDialog('Chat Interview');
            return;
        }
        openStartDialog('chat');
    };

    const handleVoiceInterview = () => {
        if (isAccessLoading) return;
        if (isVoiceLocked) {
            openLockedDialog('Voice Interview');
            return;
        }
        openStartDialog('voice');
    };

    return (
        <>
            <PlanRequiredDialog
                open={lockedDialogOpen}
                onClose={() => setLockedDialogOpen(false)}
                title='Feature locked'
                headline={`"${lockedFeatureLabel}" is disabled for your account.`}
                bodyText='Buy coins/upgrade your plan, then enable it in More Features (Step 3).'
                primaryLabel='Buy plan / coins'
                primaryHref={PublicRoutes.pricing}
            />
            <Grid container spacing={2} width='100%'>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SmallCardBase>
                        <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Stack sx={{ width: 100, height: 100 }}>
                                    <InterviewIcon />
                                </Stack>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                                        Chat Interview
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                                        2/3 free credits used
                                    </Typography>
                                    <Typography mt={2} variant='subtitle2' fontWeight='400' color='text.primary'>
                                        2 Credit
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack mt={7}>
                                <MuiButton
                                    variant='outlined'
                                    color='secondary'
                                    onClick={handleChatInterview}
                                    aria-disabled={isChatLocked || isAccessLoading}
                                    sx={
                                        isChatLocked || isAccessLoading
                                            ? { opacity: 0.55, cursor: 'not-allowed' }
                                            : undefined
                                    }
                                >
                                    Start
                                </MuiButton>
                            </Stack>
                        </StatValueRow>
                    </SmallCardBase>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <SmallCardBase>
                        <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Stack sx={{ width: 100, height: 100 }}>
                                    <InterVoice />
                                </Stack>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                                        Voice Interview
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                                        2/3 free credits used
                                    </Typography>
                                    <Typography mt={2} variant='subtitle2' fontWeight='400' color='text.primary'>
                                        2 Credit
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack mt={7}>
                                <MuiButton
                                    variant='outlined'
                                    color='secondary'
                                    onClick={handleVoiceInterview}
                                    aria-disabled={isVoiceLocked || isAccessLoading}
                                    sx={
                                        isVoiceLocked || isAccessLoading
                                            ? { opacity: 0.55, cursor: 'not-allowed' }
                                            : undefined
                                    }
                                >
                                    Start
                                </MuiButton>
                            </Stack>
                        </StatValueRow>
                    </SmallCardBase>
                </Grid>
            </Grid>
        </>
    );
};

export default InterviewStats;
