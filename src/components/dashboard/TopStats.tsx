import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

import Frame1Icon from '@/assets/images/dashboard/Frame1.svg';
import Frame2Icon from '@/assets/images/dashboard/Frame2.svg';
import Frame3Icon from '@/assets/images/dashboard/Frame3.svg';

import { SmallCardBase, StatTitle, StatValue, StatValueRow } from './styled';

const TopStats = () => {
  return (
    <Grid container spacing={2} width='100%'>
      <Grid size={{ xs: 12, md: 4 }}>
        <SmallCardBase>
          <StatValueRow>
            <Frame1Icon />
            <Stack direction='column' spacing={0.5} ml={1}>
              <StatTitle>Credits Remaining</StatTitle>
              <StatValue>83</StatValue>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SmallCardBase>
          <StatValueRow>
            <Frame2Icon />
            <Stack direction='column' spacing={0.5} ml={1}>
              <StatTitle>Resumes Created</StatTitle>
              <StatValue>3</StatValue>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SmallCardBase>
          <StatValueRow>
            <Frame3Icon />
            <Stack direction='column' spacing={0.5} ml={1}>
              <StatTitle>Interview Practices</StatTitle>
              <StatValueRow>
                <StatValue>3</StatValue>
              </StatValueRow>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>
    </Grid>
  );
};

export default TopStats;
