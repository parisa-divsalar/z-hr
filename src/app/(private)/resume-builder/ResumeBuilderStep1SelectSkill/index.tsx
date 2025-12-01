'use client';

import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { AllSkill as SelectSkillAllSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/data';
import { TSkill as SelectSkillTSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

import {
  CircleContainer,
  DividerLine,
  OrDivider,
  SelectSkillContainerSkill,
  SelectSkillInputContent,
  SelectSkillSkillContainer,
} from './styled';

interface ResumeBuilderStep1SelectSkillProps {
  setStage: (stage: 'RESULT' | 'SELECT_SKILL' | 'SKILL_INPUT' | 'QUESTIONS') => void;
}

const ResumeBuilderStep1SelectSkill: FunctionComponent<ResumeBuilderStep1SelectSkillProps> = ({ setStage }) => {
  const [skills, setSkills] = useState<SelectSkillTSkill[]>(SelectSkillAllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: SelectSkillTSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='600' mt={3}>
        What is your main skill?
      </Typography>

      <SelectSkillSkillContainer direction='row'>
        {skills.map((skill: SelectSkillTSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SelectSkillSkillContainer>

      <OrDivider>
        <DividerLine />
        <Typography variant='body2' color='text.primary' px={1}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>

      <SelectSkillContainerSkill direction='row' active={!!customSkill}>
        <SelectSkillInputContent
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

export default ResumeBuilderStep1SelectSkill;
