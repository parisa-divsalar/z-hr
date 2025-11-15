import { Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';

const AllAlert = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Different alert states:
      </Typography>

      <MuiAlert message='This is test text' severity='success' />

      <MuiAlert message='This is test text' severity='info' />
    </>
  );
};

export default AllAlert;
