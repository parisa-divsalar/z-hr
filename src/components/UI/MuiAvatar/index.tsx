import { FunctionComponent } from 'react';

import { Avatar, AvatarProps } from '@mui/material';

export type MuiAvatarProps = Omit<AvatarProps, ''> & {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'light';
};

const MuiAvatar: FunctionComponent<MuiAvatarProps> = (props) => {
  const { size = 'medium', color, sx } = props;

  return (
    <Avatar
      sx={{
        backgroundColor: color === 'primary' ? 'primary.main' : color === 'light' ? '#EAEAFE' : '',
        width: size === 'large' ? 56 : size === 'medium' ? 44 : 32,
        height: size === 'large' ? 56 : size === 'medium' ? 44 : 32,
        ...sx,
      }}
      {...props}
    />
  );
};

export default MuiAvatar;
