import React, { FunctionComponent, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import EdiIcon from '@/assets/images/icons/ediIcon.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import { StageWizard } from '@/components/Landing/type';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import { AllSkill } from './data';
import { ActionIconButton, ActionRow, ContainerSkill, SkillContainer } from './styled';
import { TSkill } from './type';

interface SelectSkillProps {
  setStage: (stage: StageWizard) => void;
}

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setStage } = props;
  const theme = useTheme();
  const [skills, setSkills] = useState<TSkill[]>(AllSkill);
  const [customSkill, setCustomSkill] = useState<string>('');
  const customSkillRef = useRef<HTMLTextAreaElement>(null);

  const onUpdateSkill = (id: string, selected: boolean) =>
    setSkills(skills.map((skill: TSkill) => (skill.id === id ? { ...skill, selected } : skill)));

  const handleAddCustomSkill = () => {
    const trimmedValue = customSkill.trim();
    if (!trimmedValue) {
      return;
    }

    setSkills((previousSkills) => {
      const normalizedLabel = trimmedValue.toLowerCase();

      const existingIndex = previousSkills.findIndex((skill) => skill.label.toLowerCase() === normalizedLabel);

      if (existingIndex >= 0) {
        return previousSkills.map((skill, index) => (index === existingIndex ? { ...skill, selected: true } : skill));
      }

      return [
        ...previousSkills,
        {
          id: generateFakeUUIDv4(),
          label: trimmedValue,
          selected: true,
        },
      ];
    });

    setCustomSkill('');
    customSkillRef.current?.focus();
  };

  const handleEditCustomSkill = () => {
    customSkillRef.current?.focus();
  };

  const handleClearCustomSkill = () => {
    setCustomSkill('');
    customSkillRef.current?.focus();
  };

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
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
          ref={customSkillRef}
        />
      </ContainerSkill>

      <ActionRow>
        <Stack direction='row' gap={0.5}>
          <ActionIconButton aria-label='Attach draft action' onClick={handleClearCustomSkill}>
            <AttachIcon />
          </ActionIconButton>
          <ActionIconButton aria-label='Record draft action' onClick={handleEditCustomSkill}>
            <RecordIcon />
          </ActionIconButton>
        </Stack>

        <MuiButton
          color='secondary'
          size='medium'
          variant='outlined'
          startIcon={<AddIcon />}
          onClick={handleAddCustomSkill}
        >
          Add
        </MuiButton>
      </ActionRow>
      <Typography variant='h5' color='text.primary' fontWeight='584' mt={5}>
        5. Your skills?
      </Typography>
      <Stack direction='row' gap={2} mt={3}>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
            Main skill
          </Typography>
          <Typography variant='h5' color='text.primary' fontWeight='584'>
            Motion Designer{' '}
          </Typography>
        </Stack>

        <EdiIcon />
      </Stack>
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
