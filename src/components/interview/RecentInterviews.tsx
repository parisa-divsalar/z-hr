import { Typography, Box, Stack } from '@mui/material';

import DoneIcon from '@/assets/images/dashboard/done.svg';
import FrameUser from '@/assets/images/icons/frameUser.svg';
import MuiButton from '@/components/UI/MuiButton';

import {
    RecentInterviewsContainer,
    InterviewsList,
    RecentInterviewCard,
    InterviewCardContent,
    InterviewMetaInfo,
} from './styled';

const interviews = [
    {
        title: 'Interview 01',
        date: '11/20/2025',
        duration: 45,
        status: 'Completed',
        chipColor: 'success.main',
        name: 'Zayd Al-Mansoori’s Resume',
    },
];

const RecentInterviews = () => {
    return (
        <Box sx={{ marginTop: 3 }}>
            <RecentInterviewsContainer>
                <InterviewsList>
                    {interviews.map((interview, index) => (
                        <RecentInterviewCard key={index}>
                            <InterviewCardContent>
                                <Box gap={3}>
                                    <Typography variant='subtitle1' color='text.primary' fontWeight='492'>
                                        {interview.title}
                                    </Typography>
                                    <InterviewMetaInfo>
                                        <Typography variant='body2' color='text.secondary' fontWeight='400'>
                                            {interview.date}
                                        </Typography>
                                        <Typography variant='body2' color='text.secondary' fontWeight='400'>
                                            Duration: {interview.duration} min
                                        </Typography>
                                        <Stack direction='row' gap={0.5} alignItems='center'>
                                            <DoneIcon />

                                            <Typography variant='body2' color='text.primary' fontWeight='400'>
                                                Done{' '}
                                            </Typography>
                                        </Stack>
                                    </InterviewMetaInfo>
                                    <Stack direction='row' mt={2} gap={1} alignItems='center'>
                                        <FrameUser />
                                        <Typography variant='subtitle1' color='text.primary' fontWeight='492'>
                                            {interview.name}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <MuiButton text='View ' variant='outlined' size='medium' color='secondary' />
                            </InterviewCardContent>
                        </RecentInterviewCard>
                    ))}
                </InterviewsList>
            </RecentInterviewsContainer>
        </Box>
    );
};

export default RecentInterviews;
