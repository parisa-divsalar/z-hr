import { FunctionComponent } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import MuiButton from '@/components/UI/MuiButton';

import { Container, Tile, Label, IconWrapper, Row, Status } from './styled';

interface VoiceResultProps {
  onSubmit: () => void;
}

const VoiceResult: FunctionComponent<VoiceResultProps> = ({ onSubmit }) => {
  return (
    <Stack alignItems='center' justifyContent='center' height='100%' spacing={3}>
      <Typography color='text.primary' variant='h6'>
        Uploaded
      </Typography>
      <Typography color='text.primary' variant='h5' fontWeight='600' textAlign='center'>
        You can add more items for the best results before you start thinking.
      </Typography>

      <Container>
        <Row>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Tile>
              <IconWrapper>
                <MicIcon />
              </IconWrapper>
            </Tile>
            <Label>Voice (1)</Label>
          </Stack>
          <Status>Done</Status>
        </Row>

        <Row>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Tile>
              <IconWrapper>
                <ImageIcon />
              </IconWrapper>
            </Tile>
            <Label>Photo (2)</Label>
          </Stack>
          <Status>Done</Status>
        </Row>

        <Row>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Tile>
              <IconWrapper>
                <VideoIcon />
              </IconWrapper>
            </Tile>
            <Label>Video (1)</Label>
          </Stack>
          <Status>Done</Status>
        </Row>
        <Stack mt={4} direction='row' spacing={4} justifyContent='center' alignItems='center'>
          <MuiButton
            color='secondary'
            variant='outlined'
            onClick={onSubmit}
            startIcon={<AddIcon />}
            sx={{ width: 150, height: 58 }}
          >
            Add more
          </MuiButton>
          <MuiButton color='secondary' onClick={onSubmit} sx={{ width: 150, height: 58 }} endIcon={<ArrowRightIcon />}>
            Submit
          </MuiButton>
        </Stack>
      </Container>
    </Stack>
  );
};

export default VoiceResult;
