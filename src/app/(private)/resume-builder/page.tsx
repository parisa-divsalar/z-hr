'use client';

import React, { FunctionComponent, useState } from 'react';

import { Divider, IconButton, Stack, Typography } from '@mui/material';

import MoreFeatures from '@/app/(private)/resume-builder/more';
import ResumeGenerator from '@/app/(private)/resume-builder/ResumeGenerator';
import {
  CircleContainer,
  DividerLine,
  InputContainer,
  InputContent,
  MainContainer,
  OrDivider,
  QuestionsBottomSection,
  QuestionsContainer,
  QuestionsMediaIconBox,
  QuestionsMediaItem,
  QuestionsMediaRow,
  QuestionsMiddleSection,
  QuestionsQuestionBadge,
  QuestionsQuestionCard,
  QuestionsQuestionList,
  QuestionsQuestionTexts,
  QuestionsTopSection,
  ResultContainer,
  ResultIconWrapper,
  ResultLabel,
  ResultRow,
  ResultStatus,
  ResultTile,
  ResumeBuilderRoot,
  SelectSkillContainerSkill,
  SelectSkillSkillContainer,
  SkillInputContainer,
  SkillInputContent,
  SkillInputMainContainer,
} from '@/app/(private)/resume-builder/styled';
import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import AddAttachFile from '@/components/Landing/AI/Attach';
import AttachView from '@/components/Landing/AI/Attach/View';
import VoiceRecord from '@/components/Landing/Common/VoiceRecord';
import { AIStatus, StageWizard } from '@/components/Landing/type';
import { AllSkill as SelectSkillAllSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/data';
import { TSkill as SelectSkillTSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';
import Thinking from '@/components/Landing/Wizard/Step2/Thinking';
import Step3 from '@/components/Landing/Wizard/Step3';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

interface ResumeAIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const ResumeAIInputPrompt: FunctionComponent<ResumeAIInputPromptProps> = (props) => {
  const { setAiStatus, search, setSearch, uploadedFiles, setUploadedFiles } = props;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <InputContainer direction='row' active={!!search}>
      <AddAttachFile uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

      <InputContent
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onInput={handleInput}
        placeholder='Type your prompt...'
      />

      {search !== '' ? (
        <IconButton onClick={() => setAiStatus('WIZARD')}>
          <CircleContainer>
            <ArrowTopIcon color='white' />
          </CircleContainer>
        </IconButton>
      ) : (
        <IconButton>
          <ArrowTopIcon color='#8A8A91' />
        </IconButton>
      )}
    </InputContainer>
  );
};

interface ResumeAIInputProps {
  setAiStatus: (status: AIStatus) => void;
}

const ResumeAIInput: FunctionComponent<ResumeAIInputProps> = ({ setAiStatus }) => {
  const [search, setSearch] = useState('');
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [showRecordingControls, setShowRecordingControls] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleVoiceRecordingComplete = (url: string, blob: Blob) => {
    setVoiceUrl(url);
    setVoiceBlob(blob);
    setShowRecordingControls(false);
  };

  const handleClearVoiceRecording = () => {
    setVoiceUrl(null);
    setVoiceBlob(null);
    setShowRecordingControls(true);
  };

  return (
    <MainContainer>
      {!voiceUrl && uploadedFiles.length === 0 && (
        <Typography variant='h6' color='text.primary'>
          Create your resume with
        </Typography>
      )}

      {!voiceUrl && uploadedFiles.length === 0 && (
        <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
          Voice, Video, Photo and Text
        </Typography>
      )}

      <AttachView uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

      {voiceUrl && (
        <VoiceRecord
          initialAudioUrl={voiceUrl}
          initialAudioBlob={voiceBlob}
          showRecordingControls={showRecordingControls}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      {!voiceUrl && (
        <VoiceRecord onRecordingComplete={handleVoiceRecordingComplete} showRecordingControls={showRecordingControls} />
      )}

      <ResumeAIInputPrompt
        setAiStatus={setAiStatus}
        search={search}
        setSearch={setSearch}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {(search !== '' || voiceUrl) && (
        <Stack width='10rem' mt={6}>
          <MuiButton fullWidth color='secondary' onClick={() => setAiStatus('WIZARD')}>
            submit
          </MuiButton>
        </Stack>
      )}
    </MainContainer>
  );
};

interface ResumeBuilderStep1VoiceResultProps {
  onSubmit: () => void;
  setAiStatus: (status: AIStatus) => void;
}

const ResumeBuilderStep1VoiceResult: FunctionComponent<ResumeBuilderStep1VoiceResultProps> = (props) => {
  const { setAiStatus, onSubmit } = props;

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography color='text.primary' variant='h6'>
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
            <ResultLabel>Voice (1)</ResultLabel>
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
            <ResultLabel>Photo (2)</ResultLabel>
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
            <ResultLabel>Video (1)</ResultLabel>
          </Stack>
          <ResultStatus>Done</ResultStatus>
        </ResultRow>

        <Stack mt={6} direction='row' gap={2} width='22rem'>
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

interface ResumeBuilderStep1SelectSkillProps {
  setStage: (stage: StageWizard) => void;
}

const ResumeBuilderStep1SelectSkill: FunctionComponent<ResumeBuilderStep1SelectSkillProps> = (props) => {
  const { setStage } = props;
  const [skills, setSkills] = useState<SelectSkillTSkill[]>(SelectSkillAllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: SelectSkillTSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={5}>
        What is your main skill?
      </Typography>

      <SelectSkillSkillContainer direction='row'>
        {skills.map((skill: SelectSkillTSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SelectSkillSkillContainer>

      <OrDivider>
        <DividerLine />
        <Typography variant='body2' color='text.primary' px={2}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>

      <SelectSkillContainerSkill direction='row' active={!!customSkill}>
        <InputContent
          placeholder='Type your answer...'
          value={customSkill}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSkill(event.target.value)}
        />

        {customSkill !== '' ? (
          <IconButton onClick={() => setStage('SKILL_INPUT')}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </SelectSkillContainerSkill>

      <Stack mt={4} mb={6} direction='row' spacing={2}>
        <MuiButton
          color='secondary'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('RESULT')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          onClick={() => setStage('SKILL_INPUT')}
          disabled={customSkill === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

interface ResumeBuilderStep1SkillInputProps {
  setStage: (stage: StageWizard) => void;
}

const ResumeBuilderStep1SkillInput: FunctionComponent<ResumeBuilderStep1SkillInputProps> = ({ setStage }) => {
  const [answer, setAnswer] = useState('');

  return (
    <SkillInputMainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='700'>
        What is your main skill?
      </Typography>
      <SkillInputContainer direction='row' sx={{ borderColor: answer === '' ? 'grey.100' : 'primary.main' }}>
        <SkillInputContent
          placeholder='Type your answer...'
          value={answer}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(event.target.value)}
        />
        {answer !== '' ? (
          <IconButton onClick={() => setStage('QUESTIONS')}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </SkillInputContainer>

      <Stack mt={4} mb={6} direction='row' spacing={2}>
        <MuiButton
          color='secondary'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SELECT_SKILL')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          onClick={() => setStage('QUESTIONS')}
          disabled={answer === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </SkillInputMainContainer>
  );
};

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
          <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center'>
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

        <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center' mt={3}>
          Questions
        </Typography>

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
          <MuiButton color='secondary' variant='outlined' startIcon={<AddIcon />} onClick={() => setAiStatus('START')}>
            Add more
          </MuiButton>

          <MuiButton color='secondary' onClick={onNext} endIcon={<ArrowRightIcon />}>
            Submit
          </MuiButton>
        </Stack>
      </QuestionsBottomSection>
    </QuestionsContainer>
  );
};

interface ResumeBuilderStep1Props {
  setAiStatus: (status: AIStatus) => void;
  setActiveStep: (activeStep: number) => void;
}

const ResumeBuilderStep1: FunctionComponent<ResumeBuilderStep1Props> = ({ setAiStatus }) => {
  const [stage, setStage] = useState<StageWizard>('RESULT');
  const [showMoreFeatures, setShowMoreFeatures] = useState<boolean>(false);
  const [showResumeGenerator, setShowResumeGenerator] = useState<boolean>(false);

  if (showResumeGenerator) {
    return <ResumeGenerator />;
  }

  if (showMoreFeatures) {
    return (
      <MoreFeatures
        onBack={() => setShowMoreFeatures(false)}
        onSubmit={() => {
          setShowResumeGenerator(true);
        }}
      />
    );
  }

  if (stage === 'RESULT') {
    return <ResumeBuilderStep1VoiceResult onSubmit={() => setStage('SELECT_SKILL')} setAiStatus={setAiStatus} />;
  }

  if (stage === 'SELECT_SKILL') {
    return <ResumeBuilderStep1SelectSkill setStage={setStage} />;
  }

  if (stage === 'SKILL_INPUT') {
    return <ResumeBuilderStep1SkillInput setStage={setStage} />;
  }

  return (
    <ResumeBuilderStep1Questions
      onNext={() => {
        setShowMoreFeatures(true);
      }}
      setAiStatus={setAiStatus}
    />
  );
};

const ResumeBuilder: FunctionComponent = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <ResumeBuilderRoot>
      {aiStatus === 'START' ? (
        <ResumeAIInput setAiStatus={setAiStatus} />
      ) : aiStatus === 'WIZARD' ? (
        activeStep === 1 ? (
          <ResumeBuilderStep1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />
        ) : activeStep === 2 ? (
          <Thinking
            onCancel={() => {
              setAiStatus('START');
              setActiveStep(1);
            }}
            setActiveStep={setActiveStep}
          />
        ) : activeStep === 3 ? (
          <Step3 setActiveStep={setActiveStep} />
        ) : (
          <Stack />
        )
      ) : (
        <Stack />
      )}
    </ResumeBuilderRoot>
  );
};

export default ResumeBuilder;
