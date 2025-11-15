import { CircularProgress, Stack } from '@mui/material';

const Loading = () => {
  return (
    <main>
      <Stack height='100vh' alignItems='center' justifyContent='center'>
        <CircularProgress size={26} color='primary' />
      </Stack>
    </main>
  );
};

export default Loading;
