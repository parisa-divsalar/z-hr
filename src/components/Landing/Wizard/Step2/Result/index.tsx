import { FunctionComponent, useMemo } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import { getFileCategory } from '@/components/Landing/Wizard/Step1/attachmentRules';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';

import { Container, Tile, Label, IconWrapper, Row, Status } from './styled';

interface VoiceResultProps {
  onSubmit: () => void;
}

const VoiceResult: FunctionComponent<VoiceResultProps> = ({ onSubmit }) => {
  const { data: wizardData } = useWizardStore();

  const mediaCounts = useMemo(() => {
    const safeArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v.filter(Boolean) as T[]) : []);

    let voiceCount = 0;
    let photoCount = 0;
    let videoCount = 0;

    const countSection = (section: any) => {
      const voices = safeArray<unknown>(section?.voices);
      const files = safeArray<unknown>(section?.files);

      voiceCount += voices.length;

      files.forEach((f) => {
        const file = f instanceof File ? f : null;
        if (!file) return;
        const category = getFileCategory(file);
        if (category === 'image') photoCount += 1;
        if (category === 'video') videoCount += 1;
      });
    };

    countSection((wizardData as any)?.background);
    safeArray<any>((wizardData as any)?.experiences).forEach((entry) => countSection(entry));
    safeArray<any>((wizardData as any)?.certificates).forEach((entry) => countSection(entry));
    countSection((wizardData as any)?.jobDescription);
    countSection((wizardData as any)?.additionalInfo);

    return { voiceCount, photoCount, videoCount };
  }, [
    wizardData.additionalInfo,
    wizardData.background,
    wizardData.certificates,
    wizardData.experiences,
    wizardData.jobDescription,
  ]);

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
            <Label>{`Voice (${mediaCounts.voiceCount})`}</Label>
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
            <Label>{`Photo (${mediaCounts.photoCount})`}</Label>
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
            <Label>{`Video (${mediaCounts.videoCount})`}</Label>
          </Stack>
          <Status>Done</Status>
        </Row>
      </Container>

      <Stack mt={4} direction='row' spacing={2} justifyContent='center'>
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
    </Stack>
  );
};

export default VoiceResult;
