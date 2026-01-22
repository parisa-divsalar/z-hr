'use client';

import { Stack, Typography } from '@mui/material';

import HeadInterviewIcon from '@/assets/images/dashboard/headIterview.svg';
import InterIcon from '@/assets/images/icons/interv.svg';
import RecentInterviews from '@/components/interview/CartItems/RecentInterviews';
import UpcomingInterview from '@/components/interview/CartItems/UpcomingInterview';
import InterviewStats from '@/components/interview/InterviewStats';
import { InterviewDialogProvider } from '@/components/interview/StartInterviewDialogProvider';
import { InterviewRoot } from '@/components/interview/styled';

const Interview = () => {
    return (
        <InterviewDialogProvider>
            <InterviewRoot>
                <Typography variant='h5' color='text.primary' fontWeight='500'>
                    Interview
                </Typography>

                <Stack spacing={3} sx={{ width: '100%' }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='space-between'
                        gap={2}
                    >
                        <InterviewStats />
                    </Stack>

                    <Stack direction='column' gap={2}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems='center'
                            gap={2}
                            mt={1}
                        >
                            <InterIcon />
                            <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                                Your Interviews
                            </Typography>
                        </Stack>
                        <RecentInterviews />
                        <UpcomingInterview />
                    </Stack>

                    <Stack direction='column' gap={2}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems='center'
                            gap={2}
                            mt={1}
                        >
                            <HeadInterviewIcon />
                            <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                                Interview History
                            </Typography>
                        </Stack>
                        <RecentInterviews />
                        <RecentInterviews />
                    </Stack>
                </Stack>
            </InterviewRoot>
        </InterviewDialogProvider>
    );
};

export default Interview;
