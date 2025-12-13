'use client';

import React, { FunctionComponent, useMemo } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import { AIStatus } from '@/components/Landing/type';
import { getFileCategory } from '@/components/Landing/Wizard/Step1/attachmentRules';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';

import { ResultContainer, ResultIconWrapper, ResultLabel, ResultRow, ResultStatus, ResultTile } from './styled';

interface ResumeBuilderStep1VoiceResultProps {
  onSubmit: () => void;
  setAiStatus: (status: AIStatus) => void;
}

const ResumeBuilderStep1VoiceResult: FunctionComponent<ResumeBuilderStep1VoiceResultProps> = ({
  onSubmit,
  setAiStatus,
}) => {
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
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography color='text.primary' variant='h6' fontWeight='400'>
        Uploaded
      </Typography>
      <Typography color='text.primary' variant='h5' fontWeight='600' textAlign='center' mt={0.5}>
        You can add more items for the best results before you start thinking.
      </Typography>

      <ResultContainer>
        <ResultRow>
          <Stack direction='row' spacing={1} alignItems='center'>
            <ResultTile>
              <ResultIconWrapper>
                <MicIcon />
              </ResultIconWrapper>
            </ResultTile>
            <ResultLabel>{`Voice (${mediaCounts.voiceCount})`}</ResultLabel>
          </Stack>
          <ResultStatus>Done</ResultStatus>
        </ResultRow>

        <ResultRow>
          <Stack direction='row' spacing={1} alignItems='center'>
            <ResultTile>
              <ResultIconWrapper>
                <ImageIcon />
              </ResultIconWrapper>
            </ResultTile>
            <ResultLabel>{`Photo (${mediaCounts.photoCount})`}</ResultLabel>
          </Stack>
          <ResultStatus>Done</ResultStatus>
        </ResultRow>

        <ResultRow>
          <Stack direction='row' spacing={1} alignItems='center'>
            <ResultTile>
              <ResultIconWrapper>
                <VideoIcon />
              </ResultIconWrapper>
            </ResultTile>
            <ResultLabel>{`Video (${mediaCounts.videoCount})`}</ResultLabel>
          </Stack>
          <ResultStatus>Done</ResultStatus>
        </ResultRow>

        <Stack mt={6} direction='row' gap={3} width='22rem'>
          <MuiButton
            color='secondary'
            variant='outlined'
            size='large'
            fullWidth
            onClick={() => setAiStatus('START')}
            startIcon={<AddIcon />}
          >
            Add more
          </MuiButton>
          <MuiButton color='secondary' onClick={onSubmit} size='large' fullWidth endIcon={<ArrowRightIcon />}>
            Submit
          </MuiButton>
        </Stack>
      </ResultContainer>
    </Stack>
  );
};

export default ResumeBuilderStep1VoiceResult;
