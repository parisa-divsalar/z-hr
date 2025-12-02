'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { AllSkill as SelectSkillAllSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/data';
import { TSkill as SelectSkillTSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

import { SelectSkillSkillContainer } from './styled';

interface ResumeBuilderStep1SelectSkillProps {
  setStage: (stage: 'RESULT' | 'SELECT_SKILL' | 'SKILL_INPUT' | 'QUESTIONS') => void;
}

const ResumeBuilderStep1SelectSkill: FunctionComponent<ResumeBuilderStep1SelectSkillProps> = ({ setStage }) => {
  const [skills, setSkills] = useState<SelectSkillTSkill[]>(SelectSkillAllSkill);

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: SelectSkillTSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  const hasSelectedSkill = skills.some((skill: SelectSkillTSkill) => skill.selected);

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='600' mt={3}>
        What is your main skill?
      </Typography>

      <SelectSkillSkillContainer direction='row' mt={3}>
        {skills.map((skill: SelectSkillTSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SelectSkillSkillContainer>

      <Stack mt={4} mb={8} direction='row' spacing={2}>
        <MuiButton
          color='secondary'
          size='large'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('RESULT')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          size='large'
          endIcon={<ArrowRightIcon />}
          onClick={() => setStage('SKILL_INPUT')}
          disabled={!hasSelectedSkill}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default ResumeBuilderStep1SelectSkill;
