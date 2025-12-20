'use client';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import HeadInterviewIcon from '@/assets/images/dashboard/headIterview.svg';
import InterIcon from '@/assets/images/icons/interv.svg';
import RecentInterviews from '@/components/interview/CartItems/RecentInterviews';
import UpcomingInterview from '@/components/interview/CartItems/UpcomingInterview';
import InterviewStats from '@/components/interview/InterviewStats';
import { InterviewRoot } from '@/components/interview/styled';
import { InterviewDialogProvider } from '@/components/interview/StartInterviewDialogProvider';

const Interview = () => {
    return (
        <InterviewDialogProvider>
            <InterviewRoot>
                <Typography variant='h5' color='text.primary' fontWeight='500'>
                    Interview
                </Typography>

                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <InterviewStats />
                </Stack>

                <Grid size={{ xs: 12, md: 12 }}>
                    <Stack direction='row' alignItems='center' gap={2} mt={3}>
                        <InterIcon />
                        <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                            Your Interviews{' '}
                        </Typography>
                    </Stack>{' '}
                    <RecentInterviews />
                    <UpcomingInterview />
                    <Stack direction='row' alignItems='center' gap={2} mt={3}>
                        <HeadInterviewIcon />
                        <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                            Interview History
                        </Typography>
                    </Stack>{' '}
                    <RecentInterviews />
                    <RecentInterviews />
                </Grid>
            </InterviewRoot>
        </InterviewDialogProvider>
    );
};

export default Interview;
