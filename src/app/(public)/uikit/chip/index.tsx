'use client';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Stack, Typography } from '@mui/material';

import MuiChip from '@/components/UI/MuiChip';

const AllChip = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Different chip states:
      </Typography>

      <Stack direction='row' gap={1} mt={2}>
        <MuiChip size='small' label='Chip' />
        <MuiChip size='small' label='Chip' color='secondary' />
        <MuiChip size='small' label='Chip' color='success' />
        <MuiChip size='small' label='Chip' color='error' />
        <MuiChip size='small' label='Chip' color='info' />
        <MuiChip size='small' label='Chip' variant='outlined' />
        <MuiChip size='small' label='Chip' color='secondary' variant='outlined' />
        <MuiChip size='small' label='Chip' color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <MuiChip label='Chip' clickable icon={<AccessTimeRoundedIcon fontSize='small' />} />
        <MuiChip label='Chip' clickable color='secondary' onDelete={() => console.log('delete')} />
        <MuiChip label='Chip' clickable color='success' />
        <MuiChip label='Chip' clickable color='error' />
        <MuiChip label='Chip' clickable variant='outlined' />
        <MuiChip label='Chip' color='primary' variant='outlined' onDelete={() => console.log('delete')} />
        <MuiChip label='Chip' clickable color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <MuiChip disabled label='Chip' />
        <MuiChip disabled label='Chip' color='secondary' />
        <MuiChip disabled label='Chip' color='success' />
        <MuiChip disabled label='Chip' color='error' />
        <MuiChip disabled label='Chip' color='info' />
        <MuiChip disabled label='Chip' variant='outlined' />
        <MuiChip disabled label='Chip' color='secondary' variant='outlined' />
        <MuiChip disabled label='Chip' color='error' variant='outlined' />
      </Stack>
    </>
  );
};

export default AllChip;
