import { FC } from 'react';

import { AccessTime, CalendarToday } from '@mui/icons-material';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { InterviewCardRoot, SectionHeader, SectionTitle, SubText, TagPill } from './styled';

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
    <Stack sx={{ marginTop: 3 }} gap={2}>
      <SectionHeader>
        <SectionTitle>Active Interviews</SectionTitle>
        <Button variant='text' size='small' sx={{ textTransform: 'none' }}>
          View All
        </Button>
      </SectionHeader>

      <Grid container spacing={2}>
        {interviews.map((interview) => (
          <Grid size={{ xs: 12, md: 6 }} key={interview.id}>
            <InterviewCardRoot>
              <Stack direction='row' gap={2} alignItems='center' sx={{ flex: 1 }}>
                <Avatar src={interview.logo} alt={interview.company} sx={{ width: 56, height: 56 }}>
                  {interview.company.charAt(0)}
                </Avatar>

                <Stack gap={0.5} sx={{ flex: 1 }}>
                  <Typography variant='body1' fontWeight={600}>
                    {interview.position}
                  </Typography>
                  <SubText>{interview.company}</SubText>

                  <Stack direction='row' gap={2} sx={{ marginTop: 1 }}>
                    <Stack direction='row' gap={0.5} alignItems='center'>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <SubText>{interview.date}</SubText>
                    </Stack>
                    <Stack direction='row' gap={0.5} alignItems='center'>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <SubText>{interview.time}</SubText>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Box>
                <TagPill>{interview.status}</TagPill>
              </Box>
            </InterviewCardRoot>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ActiveInterviews;
