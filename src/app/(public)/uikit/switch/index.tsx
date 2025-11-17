import { Stack, Typography } from '@mui/material';

import IOSSwitch from '@/components/UI/IosSwitch';

const AllSwitch = () => {
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center' mt={2}>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Switch
      </Typography>

      <Stack direction='row' gap={1}>
        <IOSSwitch />
        <IOSSwitch checked />
        <IOSSwitch disabled />
      </Stack>
    </Stack>
  );
};

export default AllSwitch;
