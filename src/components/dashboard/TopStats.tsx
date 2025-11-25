import { Stack } from '@mui/material';

import MuiChip from '@/components/UI/MuiChip';

import {
  SmallCardBase,
  StatTitle,
  StatValue,
  StatValueRow,
  OrangeBadge,
  DASHBOARD_COLORS,
} from './styled';

const TopStats = () => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      gap={2}
      width='100%'
    >
      <SmallCardBase sx={{ flex: 1 }}>
        <StatTitle>Credits Remaining</StatTitle>
        <StatValueRow>
          <StatValue>83</StatValue>
          <OrangeBadge>+50</OrangeBadge>
        </StatValueRow>
      </SmallCardBase>

      <SmallCardBase sx={{ flex: 1 }}>
        <StatTitle>Resumes Created</StatTitle>
        <StatValue>3</StatValue>
      </SmallCardBase>

      <SmallCardBase sx={{ flex: 1 }}>
        <StatTitle>Interview Practices</StatTitle>
        <StatValueRow>
          <StatValue>3</StatValue>
          <MuiChip
            size='small'
            label='+1 today'
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 22,
              backgroundColor: '#F0F0F0',
              color: DASHBOARD_COLORS.lightText,
            }}
          />
        </StatValueRow>
      </SmallCardBase>
    </Stack>
  );
};

export default TopStats;



