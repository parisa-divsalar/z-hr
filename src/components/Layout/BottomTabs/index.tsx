'use client';
import { CardActionArea, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import HeartIcon from '@/assets/images/icons/tabs/heart.svg';
import HomeFillIcon from '@/assets/images/icons/tabs/home-fill.svg';
import ProfileIcon from '@/assets/images/icons/tabs/profile.svg';
import ReserveIcon from '@/assets/images/icons/tabs/reserve.svg';
import SearchIcon from '@/assets/images/icons/tabs/search.svg';

const StackContainer = styled(Stack)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99,
  maxWidth: '34rem',
  padding: '0 1rem 1rem 1rem',
}));

const TabContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  border: '1px solid rgba(100, 100, 111, 0.1)',
  borderRadius: '1.25rem',
}));

const TabItemContainer = styled(CardActionArea)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.5rem 0',
  justifyContent: 'center',
}));

const BottomTabs = () => {
  return (
    <StackContainer>
      <TabContainer direction='row'>
        <TabItemContainer sx={{ borderRadius: '1.25rem 0 0 1.25rem' }}>
          <HomeFillIcon />
          <Typography color='action.focus' variant='subtitle2' fontWeight='600'>
            Home
          </Typography>
        </TabItemContainer>

        <TabItemContainer sx={{ borderRadius: '0' }}>
          <ReserveIcon />
          <Typography color='text.secondary' variant='subtitle2' fontWeight='600'>
            Reservations
          </Typography>
        </TabItemContainer>

        <TabItemContainer sx={{ borderRadius: '0' }}>
          <SearchIcon />
          <Typography color='text.secondary' variant='subtitle2' fontWeight='600'>
            Search
          </Typography>
        </TabItemContainer>

        <TabItemContainer sx={{ borderRadius: '0' }}>
          <HeartIcon />
          <Typography color='text.secondary' variant='subtitle2' fontWeight='600'>
            Favorites
          </Typography>
        </TabItemContainer>

        <TabItemContainer sx={{ borderRadius: '0 1.25rem 1.25rem 0' }}>
          <ProfileIcon />
          <Typography color='text.secondary' variant='subtitle2' fontWeight='600'>
            Profile
          </Typography>
        </TabItemContainer>
      </TabContainer>
    </StackContainer>
  );
};

export default BottomTabs;
