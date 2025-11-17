'use client';

import { useState } from 'react';

import { Tabs, Tab, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: 44,
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1e1e1e',
  borderRadius: 24,
  border: `1px solid ${theme.palette.divider}`,
  padding: 4,
  display: 'inline-flex',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 36,
  maxHeight: 38,
  minWidth: 150,
  textTransform: 'none',
  borderRadius: 20,
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  transition: 'all 0.2s ease',
}));

export default function MuiTabs() {
  const [tab, setTab] = useState('current');

  return (
    <Stack direction='row' justifyContent='center' my={1}>
      <StyledTabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <StyledTab label='Tab 1' value='current' />
        <StyledTab label='Tab 2' value='past' />
      </StyledTabs>
    </Stack>
  );
}
