import { Stack, Typography, Box } from '@mui/material';

import MuiChips from '@/components/UI/MuiChips';

import { InterviewCardRoot, SectionHeader } from './styled';

const RecentInterviews = () => {
  return (
    <InterviewCardRoot>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <SectionHeader>
          <Typography>Recent Interviews</Typography>
        </SectionHeader>

        <Stack spacing={2}>
          {/* Interview Item 1 */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Stack gap={1}>
                <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
                  Frontend Developer Interview
                </Typography>
                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    11/20/2025
                  </Typography>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    Duration: 45 min
                  </Typography>
                </Stack>
              </Stack>
              <MuiChips
                label='Completed'
                color='white'
                sx={{
                  width: 100,
                  height: 25,
                  fontSize: '12px',
                  px: 2,
                  py: 1,
                  bgcolor: 'success.main',
                }}
              />
            </Stack>
          </Box>

          {/* Interview Item 2 */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Stack gap={1}>
                <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
                  React Developer Position
                </Typography>
                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    11/18/2025
                  </Typography>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    Duration: 60 min
                  </Typography>
                </Stack>
              </Stack>
              <MuiChips
                label='Completed'
                color='white'
                sx={{
                  width: 100,
                  height: 25,
                  fontSize: '12px',
                  px: 2,
                  py: 1,
                  bgcolor: 'success.main',
                }}
              />
            </Stack>
          </Box>

          {/* Interview Item 3 */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Stack gap={1}>
                <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
                  Senior UI/UX Interview
                </Typography>
                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    11/15/2025
                  </Typography>
                  <Typography variant='body2' color='text.secondary' fontSize='12px'>
                    Duration: 50 min
                  </Typography>
                </Stack>
              </Stack>
              <MuiChips
                label='In Progress'
                color='white'
                sx={{
                  width: 100,
                  height: 25,
                  fontSize: '12px',
                  px: 2,
                  py: 1,
                  bgcolor: 'info.main',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </InterviewCardRoot>
  );
};

export default RecentInterviews;
