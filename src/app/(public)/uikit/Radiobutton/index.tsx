import { Stack, Typography } from '@mui/material';

import MuiRadioButton from '@/components/UI/MuiRadioButton';

const AllRadiobutton = () => {
  return (
    <Stack py={2} width='100%'>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Radio Button
      </Typography>

      <Stack direction='row' alignItems='start' gap={1} mt={2} spacing={1}>
        <MuiRadioButton size='large' />
        <MuiRadioButton size='medium' />
        <MuiRadioButton size='small' />
      </Stack>

      <Stack direction='row' alignItems='start' gap={1} mt={2} spacing={1}>
        <MuiRadioButton size='large' checked />
        <MuiRadioButton size='medium' checked />
        <MuiRadioButton size='small' checked />
      </Stack>

      <Stack direction='row' alignItems='start' gap={1} mt={2} spacing={1}>
        <MuiRadioButton size='large' checked disabled />
        <MuiRadioButton size='medium' checked disabled />
        <MuiRadioButton size='small' checked disabled />
      </Stack>
    </Stack>
  );
};
export default AllRadiobutton;
