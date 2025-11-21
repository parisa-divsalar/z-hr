import { Stack, Typography } from '@mui/material';
import MuiButton from '@/components/UI/MuiButton';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  TopBox,
  BarFill,
  Fill,
  BarContainer,
  Container,
  PercentText,
} from '@/components/Landing/Wizard/Step2/Uploading/styled';
import { Mic } from '@mui/icons-material';

interface VoiceUploadingProps {
  setUploading: (uploading: boolean) => void;
  onComplete: () => void;
}

const VoiceUploading: FunctionComponent<VoiceUploadingProps> = (props) => {
  const { setUploading, onComplete } = props;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start > 100) {
        clearInterval(interval);
      } else {
        setPercent(start);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percent === 100) onComplete();
  }, [percent]);

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography color='text.primary' variant='h5'>
        Uploading...
      </Typography>

      <Container>
        <TopBox>
          <Fill style={{ height: `${percent}%` }} />
          <Mic color='primary' fontSize='large' />
        </TopBox>

        <PercentText>{percent}%</PercentText>

        <BarContainer>
          <BarFill style={{ width: `${percent}%` }} />
        </BarContainer>
      </Container>

      <Stack mt={2} width='10rem'>
        <MuiButton variant='outlined' fullWidth onClick={() => setUploading(false)}>
          Cancel
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default VoiceUploading;
