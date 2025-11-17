import { Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';

const AllAlert = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Toast
      </Typography>

      <MuiAlert message='Information' severity='info' />

      <MuiAlert message='Information' severity='success' />

      <MuiAlert message='Information' severity='warning' />

      <MuiAlert message='message' severity='error' />
    </>
  );
};

export default AllAlert;
