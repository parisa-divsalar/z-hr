import { FC } from 'react';

import { AccessTime, CalendarToday } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  InterviewCardRoot,
  SectionHeader,
  SubText,
  TagPill,
  ActiveInterviewsRoot,
  ViewAllButton,
  InterviewCardFlex,
  CompanyAvatar,
  InterviewDetails,
  DateTimeStack,
} from './styled';

const ActiveInterviews: FC = () => {
  const interviews = [
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Frontend Developer',
      date: '2025-12-01',
      time: '10:00 AM',
      status: 'Upcoming',
      logo: '/images/company1.png',
    },
    {
      id: 2,
      company: 'Innovation Labs',
      position: 'Full Stack Engineer',
      date: '2025-12-05',
      time: '2:00 PM',
      status: 'Scheduled',
      logo: '/images/company2.png',
    },
  ];

  return (
    <ActiveInterviewsRoot>
      <SectionHeader>
        <Typography variant='subtitle1'>Active Interviews</Typography>
        <ViewAllButton variant='text' size='small'>
          View All
        </ViewAllButton>
      </SectionHeader>

      <Grid container spacing={2}>
        {interviews.map((interview) => (
          <Grid size={{ xs: 12, md: 6 }} key={interview.id}>
            <InterviewCardRoot>
              <InterviewCardFlex direction='row' gap={2} alignItems='center'>
                <CompanyAvatar src={interview.logo} alt={interview.company}>
                  {interview.company.charAt(0)}
                </CompanyAvatar>

                <InterviewDetails gap={0.5}>
                  <Typography variant='body1' fontWeight={600}>
                    {interview.position}
                  </Typography>
                  <SubText>{interview.company}</SubText>

                  <DateTimeStack direction='row' gap={2}>
                    <Stack direction='row' gap={0.5} alignItems='center'>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <SubText>{interview.date}</SubText>
                    </Stack>
                    <Stack direction='row' gap={0.5} alignItems='center'>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <SubText>{interview.time}</SubText>
                    </Stack>
                  </DateTimeStack>
                </InterviewDetails>
              </InterviewCardFlex>

              <Box>
                <TagPill>{interview.status}</TagPill>
              </Box>
            </InterviewCardRoot>
          </Grid>
        ))}
      </Grid>
    </ActiveInterviewsRoot>
  );
};

export default ActiveInterviews;
