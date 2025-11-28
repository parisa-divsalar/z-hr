import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Chip, Stack, Typography } from '@mui/material';

const AllChip = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Chip
      </Typography>

      <Stack direction='row' gap={1} mt={2}>
        <Chip size='small' label='label' />
        <Chip size='small' label='label' color='secondary' />
        <Chip size='small' label='label' color='success' />
        <Chip size='small' label='label' color='error' />
        <Chip size='small' label='label' color='info' />
        <Chip size='small' label='label' variant='outlined' />
        <Chip size='small' label='label' color='secondary' variant='outlined' />
        <Chip size='small' label='label' color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <Chip label='label' clickable icon={<AccessTimeRoundedIcon fontSize='small' />} />
        <Chip label='label' clickable color='secondary' onDelete={() => console.log('delete')} />
        <Chip label='label' clickable color='success' />
        <Chip label='label' clickable color='error' />
        <Chip label='label' clickable variant='outlined' />
        <Chip label='label' color='primary' variant='outlined' onDelete={() => console.log('delete')} />
        <Chip label='label' clickable color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <Chip disabled label='label' />
        <Chip disabled label='label' color='secondary' />
        <Chip disabled label='label' color='success' />
        <Chip disabled label='label' color='error' />
        <Chip disabled label='label' color='info' />
        <Chip disabled label='label' variant='outlined' />
        <Chip disabled label='label' color='secondary' variant='outlined' />
        <Chip disabled label='label' color='error' variant='outlined' />
      </Stack>
    </>
  );
};

export default AllChip;
