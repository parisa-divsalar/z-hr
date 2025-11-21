import { Stack, Typography } from '@mui/material';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import React, { FunctionComponent, useState } from 'react';
import MuiButton from '@/components/UI/MuiButton';
import { AllSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/data';
import ChipSkill from '@/components/Card/Chip';
import { TSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';
import { SkillContainer } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';

interface SelectSkillProps {
  setShowSelectSkill: (showSelectSkill: boolean) => void;
}

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setShowSelectSkill } = props;
  const [skills, setSkills] = useState<TSkill[]>(AllSkill);

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

      <Stack mt={4}>
        <MuiButton color='secondary' endIcon={<ArrowRightIcon />} onClick={() => setShowSelectSkill(false)}>
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default SelectSkill;
