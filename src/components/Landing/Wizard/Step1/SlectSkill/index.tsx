import React, { FunctionComponent, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import AttachIcon from '@/assets/images/icons/attach.svg';
import EdiIcon from '@/assets/images/icons/Frame42731.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import RecordIcon from '@/assets/images/icons/recordV.svg';
import TooltipIcon from '@/assets/images/icons/tooltip.svg';
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

const TooltipContent = styled(Stack)(() => ({
  width: '100%',
}));

const AtsFriendlyChip = styled(MuiChips)(({ theme }) => ({
  border: `1px solid ${theme.palette.warning.main}`,
  backgroundColor: theme.palette.warning.light,
  borderRadius: '8px',
  height: '26px',
}));

const SelectSkill: FunctionComponent<SelectSkillProps> = (props) => {
  const { setStage } = props;
  const theme = useTheme();
  const tooltipLines = [
    'Start with your job title or the role you are applying for.',
    'Mention your years of experience.',
    'Highlight your strongest skills and what makes you valuable.',
    'Add 1–2 examples of what you have achieved in past companies.',
    'Keep it short, clear, and professional (3–4 lines).',
  ];
  const tooltipSnippet =
    'Example: "UX/UI Designer with 3+ years of experience in creating user-friendly digital products. Skilled in wireframing, prototyping, and user research. Successfully improved user engagement for multiple ed-tech and gaming platforms."';
  const tooltipBackground = theme.palette.grey[800] ?? '#1C1C1C';
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
      <Stack direction='row' alignItems='center' gap={1}>
        <Typography variant='h5' color='text.primary' fontWeight='584'>
          4. Briefly tell us about your background{' '}
        </Typography>
        <Tooltip
          arrow
          placement='right'
          title={
            <TooltipContent spacing={1}>
              {tooltipLines.map((line) => (
                <Typography key={line} variant='body2' color='inherit'>
                  {line}
                </Typography>
              ))}
              <Stack>
                <Typography variant='body2' fontStyle='italic' color='inherit'>
                  {tooltipSnippet}
                </Typography>
              </Stack>
            </TooltipContent>
          }
          slotProps={{
            tooltip: {
              style: {
                width: 234,
                height: 'auto',
                backgroundColor: theme.palette.grey[600],
                color: theme.palette.primary.contrastText,
                borderRadius: 12,
                padding: 10,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'flex-start',
                whiteSpace: 'normal',
                fontWeight: 400,
              },
            },
            arrow: {
              style: {
                color: tooltipBackground,
              },
            },
          }}
        >
          <span>
            <TooltipIcon />
          </span>
        </Tooltip>
      </Stack>
      <Stack direction='row' alignItems='center' gap={1} mt={2}>
        <AtsFriendlyChip color='warning.main' label='ATS Friendly' />
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
          <EdiIcon />
        </Stack>
      </Stack>
      <SkillContainer direction='row'>
        {skills.map((skill: TSkill) => (
          <MuiChips key={skill.id} skill={skill} onUpdateSkill={onUpdateSkill} />
        ))}
      </SkillContainer>

      <ContainerSkill direction='row' active={!!customSkill}>
        <InputContent
          placeholder='Your another skills: Designer, Motion...'
          value={customSkill}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSkill(event.target.value)}
          ref={customSkillRef}
        />
      </ContainerSkill>
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
