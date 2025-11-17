import { Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';

const AllAlert = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Alert
      </Typography>

      <MuiAlert message='message' severity='success' />

      <MuiAlert message='message' severity='info' />
    </>
  );
};

export default AllAlert;
