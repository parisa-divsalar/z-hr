import { Stack, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';

const AllCheckbox = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Checkbox
      </Typography>

      <Stack direction='row' gap={1}>
        <MuiCheckbox size='small' />

        <MuiCheckbox checked size='small' />

        <MuiCheckbox checked color='secondary' size='small' />

        <MuiCheckbox checked color='success' size='small' />

        <MuiCheckbox checked color='info' size='small' />

        <MuiCheckbox checked color='error' size='small' />

        <MuiCheckbox checked color='warning' size='small' />

        <MuiCheckbox checked disabled size='small' />

        <MuiCheckbox label='Title' size='small' />
      </Stack>

      <Stack direction='row' gap={1}>
        <MuiCheckbox />

        <MuiCheckbox checked />

        <MuiCheckbox checked color='secondary' />

        <MuiCheckbox checked color='success' />

        <MuiCheckbox checked color='info' />

        <MuiCheckbox checked color='error' />

        <MuiCheckbox checked color='warning' />

        <MuiCheckbox checked disabled />

        <MuiCheckbox label='Title' />
      </Stack>
    </>
  );
};

export default AllCheckbox;
