import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { CircleContainer, InputContent } from '@/components/Landing/AI/Text/styled';
import { DividerLine, OrDivider } from '@/components/Landing/AI/VoiceBox/styled';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

import { AllSkill } from './data';
import { ContainerSkill, SkillContainer } from './styled';
import { TSkill } from './type';

interface SelectSkillProps {
  setStage: (stage: StageWizard) => void;
}

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setStage } = props;
  const [skills, setSkills] = useState<TSkill[]>(AllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={5}>
        What is your main skill?
      </Typography>

      <SkillContainer direction='row'>
        {skills.map((skill: TSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SkillContainer>

      <OrDivider>
        <DividerLine />
        <Typography variant='body2' color='text.primary' px={2}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>

      <ContainerSkill direction='row' active={!!customSkill}>
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
      </ContainerSkill>

      <Stack mt={4} mb={6} direction='row' gap={3}>
        <MuiButton
          color='secondary'
          variant='outlined'
          size='large'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('RESULT')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          size='large'
          onClick={() => setStage('SKILL_INPUT')}
          disabled={customSkill === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default SelectSkill;
