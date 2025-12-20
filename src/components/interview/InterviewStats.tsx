'use client';

import { Grid, Stack, Typography } from '@mui/material';

import InterviewIcon from '@/assets/images/dashboard/imag/interview.svg';
import InterVoice from '@/assets/images/icons/interVoice.svg';
import MuiButton from '@/components/UI/MuiButton';

import { useInterviewDialog } from './StartInterviewDialogProvider';
import { SmallCardBase, StatValueRow } from './styled';

const InterviewStats = () => {
    const { openStartDialog } = useInterviewDialog();

    return (
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
                            <MuiButton variant='outlined' color='secondary' onClick={() => openStartDialog('chat')}>
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
                            <MuiButton variant='outlined' color='secondary' onClick={() => openStartDialog('voice')}>
                                Start
                            </MuiButton>
                        </Stack>
                    </StatValueRow>
                </SmallCardBase>
            </Grid>
        </Grid>
    );
};

export default InterviewStats;
