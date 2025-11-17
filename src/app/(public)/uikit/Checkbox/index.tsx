import { Stack, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';

const AllCheckbox = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Checkbox
      </Typography>

      <Stack direction='row' gap={1}>
        <MuiCheckbox size='large' />
        <MuiCheckbox size='medium' />
        <MuiCheckbox size='small' />
      </Stack>

      <Stack direction='row' gap={1}>
        <MuiCheckbox size='large' checked />
        <MuiCheckbox size='medium' checked />
        <MuiCheckbox size='small' checked />
      </Stack>

      <Stack direction='row' gap={1}>
        <MuiCheckbox size='large' checked disabled />
        <MuiCheckbox size='medium' checked disabled />
        <MuiCheckbox size='small' checked disabled />
      </Stack>
    </>
  );
};

export default AllCheckbox;
