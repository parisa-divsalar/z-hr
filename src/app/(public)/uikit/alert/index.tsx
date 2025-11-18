import { Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';

const AllAlert = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Toast
      </Typography>

      <MuiAlert message='Information' severity='info' />

      <MuiAlert message='Success' severity='success' />

      <MuiAlert message='Warning' severity='warning' />

      <MuiAlert message='Error' severity='error' />
    </>
  );
};

export default AllAlert;
