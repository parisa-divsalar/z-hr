'use client';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { List, ListItemText, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

import { ItemButton, SidebarContainer, ItemIcon } from '@/components/Layout/SideBar/styled';
import { VisibilitySideBar } from '@/config/routes';

const SideBar = () => {
  const pathname = usePathname();

  if (!VisibilitySideBar.includes(pathname)) return null;

  return (
    <SidebarContainer>
      <Stack>
        <Typography color='grey.300' variant='caption' px={3} pt={3}>
          Menu
        </Typography>
        <List>
          <ItemButton active>
            <ItemIcon>
              <DashboardRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Dashboard' />

            <KeyboardArrowRightRoundedIcon />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <ArticleRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Resume Builder' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <HistoryRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='History' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <CreditCardRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Payment' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <SchoolRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Learning Hub' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <MicRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Interview' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <SettingsRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Setting' />
          </ItemButton>

          <ItemButton>
            <ItemIcon>
              <HeadphonesRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Support' />
          </ItemButton>
        </List>
      </Stack>

      <Stack p={3}>
        <Typography color='grey.300' variant='caption'>
          Version 1.3.23
        </Typography>
      </Stack>
    </SidebarContainer>
  );
};

export default SideBar;
