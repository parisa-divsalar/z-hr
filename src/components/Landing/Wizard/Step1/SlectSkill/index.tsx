import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ChipSkill from '@/components/Card/Chip';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/AI/Text/styled';
import { DividerLine, OrDivider } from '@/components/Landing/AI/VoiceBox/styled';
import { AllSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/data';
import { SkillContainer } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';
import { TSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';
import MuiButton from '@/components/UI/MuiButton';

interface SelectSkillProps {
  setShowSelectSkill: (showSelectSkill: boolean) => void;
}

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setShowSelectSkill } = props;
  const [skills, setSkills] = useState<TSkill[]>(AllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  return (
    <Stack alignItems='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={12}>
        What is your main skill?
      </Typography>

      <SkillContainer direction='row'>
        {skills.map((skill: TSkill) => (
          <ChipSkill key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SkillContainer>
      <OrDivider sx={{ pt: 3 }}>
        <DividerLine />
        <Typography variant='body2' color='text.primary' px={2}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>

      <InputContainer direction='row' active={!!customSkill} sx={{ width: 588, maxWidth: 588 }}>
        <InputContent
          placeholder='Type your answer...'
          value={customSkill}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSkill(event.target.value)}
        />

        {customSkill !== '' ? (
          <IconButton onClick={() => setShowSelectSkill(false)}>
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

      <Stack mt={4} mb={6} direction='row' spacing={2}>
        <MuiButton color='secondary' endIcon={<ArrowRightIcon />} onClick={() => setShowSelectSkill(false)}>
          Next
        </MuiButton>
        <MuiButton
          color='secondary'
          variant='outlined'
          endIcon={<ArrowRightIcon />}
          onClick={() => setShowSelectSkill(false)}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default SelectSkill;
