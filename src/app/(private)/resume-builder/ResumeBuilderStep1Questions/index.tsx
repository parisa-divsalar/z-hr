'use client';

import React, { FunctionComponent } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

import {
  QuestionsBottomSection,
  QuestionsContainer,
  QuestionsMiddleSection,
  QuestionsMediaIconBox,
  QuestionsMediaItem,
  QuestionsMediaRow,
  QuestionsQuestionBadge,
  QuestionsQuestionCard,
  QuestionsQuestionList,
  QuestionsQuestionTexts,
  QuestionsTopSection,
} from './styled';

interface ResumeBuilderStep1QuestionsProps {
  onNext: () => void;
  setAiStatus: (status: AIStatus) => void;
}

const ResumeBuilderStep1Questions: FunctionComponent<ResumeBuilderStep1QuestionsProps> = ({ onNext, setAiStatus }) => {
  const mediaItems = [
    { id: 'voice', label: 'Voice (1)', Icon: MicIcon },
    { id: 'photo', label: 'Photo (2)', Icon: ImageIcon },
    { id: 'video', label: 'Video (1)', Icon: VideoIcon },
  ];

  const questionNumbers = [1, 2, 3, 4, 5];

  return (
    <QuestionsContainer>
      <QuestionsMiddleSection>
        <QuestionsTopSection>
          <Typography variant='subtitle1' fontWeight={400} color='text.primary' textAlign='center'>
            File uploaded
          </Typography>

          <QuestionsMediaRow>
            {mediaItems.map(({ id, label, Icon }) => (
              <QuestionsMediaItem key={id}>
                <QuestionsMediaIconBox>
                  <Icon />
                </QuestionsMediaIconBox>

                <Stack direction='row' spacing={1.25} alignItems='center'>
                  <Typography variant='body2' fontWeight={500} color='text.primary'>
                    {label}
                  </Typography>
                  <Typography variant='caption' fontWeight={600} color='success.main'>
                    Done
                  </Typography>
                </Stack>
              </QuestionsMediaItem>
            ))}
          </QuestionsMediaRow>
        </QuestionsTopSection>

        <QuestionsQuestionList>
          {questionNumbers.map((num, index) => (
            <React.Fragment key={num}>
              <QuestionsQuestionCard>
                <QuestionsQuestionTexts>
                  <Stack direction='row' alignItems='center'>
                    <QuestionsQuestionBadge>{num}</QuestionsQuestionBadge>

                    <Typography variant='subtitle2' fontWeight={400} color='text.primary' ml={2}>
                      Questions
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={0.5} mt={1}>
                    <Typography variant='subtitle2' fontWeight={400} color='text.primary'>
                      Answer
                    </Typography>
                    <Typography variant='subtitle2' fontWeight={400} color='text.primary'>
                      Access common position-specific interview questions to prepare effectively interview questions to
                      prepare .
                    </Typography>
                  </Stack>
                </QuestionsQuestionTexts>
              </QuestionsQuestionCard>

              {index !== questionNumbers.length - 1 && (
                <Divider
                  sx={{
                    borderColor: 'grey.100',
                    width: '100%',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </QuestionsQuestionList>
      </QuestionsMiddleSection>

      <QuestionsBottomSection>
        <Stack direction='row' spacing={2} justifyContent='center' m={4}>
          <MuiButton
            color='secondary'
            size='large'
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => setAiStatus('START')}
          >
            Add more
          </MuiButton>

          <MuiButton color='secondary' size='large' onClick={onNext} endIcon={<ArrowRightIcon />}>
            Submit
          </MuiButton>
        </Stack>
      </QuestionsBottomSection>
    </QuestionsContainer>
  );
};

export default ResumeBuilderStep1Questions;
