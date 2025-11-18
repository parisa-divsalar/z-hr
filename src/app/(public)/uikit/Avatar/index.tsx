import { Stack, Typography } from '@mui/material';

import AvatarSrc from '@/assets/images/bg/avatar.png';
import UserIcon from '@/assets/images/icons/user.svg';
import MuiAvatar from '@/components/UI/MuiAvatar';

const AllAvatar = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Profile
      </Typography>

      <Stack direction='row' mt={2} gap={2}>
        <MuiAvatar size='large' color='primary' />
        <MuiAvatar size='medium' color='primary' />
        <MuiAvatar size='small' color='primary' />
      </Stack>

      <Stack direction='row' mt={2} gap={2}>
        <MuiAvatar size='large' color='light'>
          <UserIcon width={24} />
        </MuiAvatar>
        <MuiAvatar size='medium' color='light'>
          <UserIcon width={20} />
        </MuiAvatar>
        <MuiAvatar size='small' color='light'>
          <UserIcon width={16} />
        </MuiAvatar>
      </Stack>

      <Stack direction='row' mt={2} gap={2}>
        <MuiAvatar size='large' color='primary'>
          <Typography variant='subtitle2' fontWeight='bold'>
            MM
          </Typography>
        </MuiAvatar>
        <MuiAvatar size='medium' color='primary'>
          <Typography variant='subtitle2' fontWeight='bold'>
            MM
          </Typography>
        </MuiAvatar>
        <MuiAvatar size='small' color='primary'>
          <Typography variant='caption' fontWeight='bold'>
            MM
          </Typography>
        </MuiAvatar>
      </Stack>

      <Stack direction='row' mt={2} gap={2}>
        <MuiAvatar size='large' color='light'>
          <Typography variant='subtitle2' fontWeight='bold' color='primary.main'>
            MM
          </Typography>
        </MuiAvatar>
        <MuiAvatar size='medium' color='light'>
          <Typography variant='subtitle2' fontWeight='bold' color='primary.main'>
            MM
          </Typography>
        </MuiAvatar>
        <MuiAvatar size='small' color='light'>
          <Typography variant='caption' fontWeight='bold' color='primary.main'>
            MM
          </Typography>
        </MuiAvatar>
      </Stack>

      <Stack direction='row' mt={2} gap={2}>
        <MuiAvatar size='large' color='light' src={AvatarSrc.src} />

        <MuiAvatar size='medium' color='light' src={AvatarSrc.src} />

        <MuiAvatar size='small' color='light' src={AvatarSrc.src} />
      </Stack>
    </>
  );
};

export default AllAvatar;
