import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

import { AllSkill } from './data';
import { ContainerSkill, SkillContainer } from './styled';
import { TSkill } from './type';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';

interface SelectSkillProps {
  setStage: (stage: StageWizard) => void;
}

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setStage } = props;
  const theme = useTheme();
  const [skills, setSkills] = useState<TSkill[]>(AllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h6' color='text.primary' fontWeight='500' mt={5}></Typography>
      <Typography variant='h5' color='text.primary' fontWeight='584'>
        4. Briefly tell us about your background{' '}
      </Typography>
      <Stack direction='row' alignItems='center' gap={1} mt={2}>
        <MuiChips
          color='warning.main'
          sx={{
            border: `1px solid ${theme.palette.warning.main}`,

            bgcolor: 'warning.light',
            Radius: '8px',
            height: '26px',
          }}
          label='ATS Friendly'
        />
      </Stack>

      <ContainerSkill direction='row' active={!!customSkill}>
        <InputContent
          placeholder='Type your answer...'
          value={customSkill}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSkill(event.target.value)}
        />
      </ContainerSkill>

      <SkillContainer direction='row'>
        {skills.map((skill: TSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SkillContainer>

      <Stack mt={4} mb={6} direction='row' gap={3}>
        <MuiButton
          color='secondary'
          variant='outlined'
          size='large'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SKILL_INPUT')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          size='large'
          onClick={() => setStage('QUESTIONS')}
          disabled={customSkill === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default SelectSkill;
