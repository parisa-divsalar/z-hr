import { FunctionComponent } from 'react';

import { Mic } from '@mui/icons-material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';

import { Container, Tile, Label, IconWrapper, CheckBadge } from './styled';

interface VoiceResultProps {
  onSubmit: () => void;
}

const VoiceResult: FunctionComponent<VoiceResultProps> = (props) => {
  const { onSubmit } = props;

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography color='text.primary' variant='h6'>
        Uploaded
      </Typography>
      <Typography color='text.primary' variant='h5' fontWeight='600'>
        You can add more items for the best results before you start thinking.
      </Typography>

      <Container>
        <Stack alignItems='center'>
          <Tile>
            <IconWrapper>
              <Mic sx={{ fontSize: 36, color: '#5E3FFF' }} />
            </IconWrapper>
            <CheckBadge title='Active'>
              <CheckRoundedIcon sx={{ color: 'white' }} fontSize='small' />
            </CheckBadge>
          </Tile>
          <Label>100%</Label>
        </Stack>

        <Stack alignItems='center'>
          <Tile aria-label='add' sx={{ borderColor: '#e0e0e0' }}>
            <IconWrapper>
              <AddIcon />
            </IconWrapper>
          </Tile>
          <Label sx={{ color: 'text.secondary' }} onClick={() => {}} role='button'>
            Add
          </Label>
        </Stack>
      </Container>

      <Stack mt={8} width='10rem'>
        <MuiButton color='secondary' fullWidth onClick={onSubmit}>
          Submit
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default VoiceResult;
