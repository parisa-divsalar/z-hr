import { Typography, Box, Stack } from '@mui/material';

import DoneIcon from '@/assets/images/dashboard/done.svg';
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
    title: 'Frontend Developer Interview',
    date: '11/20/2025',
    duration: 45,
    status: 'Completed',
    chipColor: 'success.main',
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
                  <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
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
                      <DoneIcon style={{ fontSize: 14 }} />

                      <Typography variant='body2' color='text.primary' fontWeight='400'>
                        Done{' '}
                      </Typography>
                    </Stack>
                  </InterviewMetaInfo>
                </Box>
                <MuiButton text='Result ' variant='outlined' size='small' color='secondary' />
              </InterviewCardContent>
            </RecentInterviewCard>
          ))}
        </InterviewsList>
      </RecentInterviewsContainer>
    </Box>
  );
};

export default RecentInterviews;
