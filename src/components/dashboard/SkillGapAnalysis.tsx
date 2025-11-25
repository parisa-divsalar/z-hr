import { Stack } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

import {
  CardBase,
  MetaText,
  SectionHeader,
  SectionTitle,
  BodyText,
  DASHBOARD_COLORS,
} from './styled';

const SkillCard = ({
  skill,
  level,
  suggestion,
  actionLabel,
}: {
  skill: string;
  level: string;
  suggestion: string;
  actionLabel: string;
}) => {
  return (
    <CardBase
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Stack gap={0.5}>
        <BodyText sx={{ fontWeight: 600 }}>{skill}</BodyText>
        <MetaText>Level: {level}</MetaText>
        <MetaText sx={{ color: DASHBOARD_COLORS.orangeTag }}>{suggestion}</MetaText>
      </Stack>

      <MuiButton
        size='small'
        variant='outlined'
        sx={{
          borderRadius: 999,
          textTransform: 'none',
        }}
      >
        {actionLabel}
      </MuiButton>
    </CardBase>
  );
};

const SkillGapAnalysis = () => {
  return (
    <Stack gap={2}>
      <SectionHeader>
        <SectionTitle>Skill Gap Analysis</SectionTitle>
      </SectionHeader>

      <Stack gap={2}>
        <SkillCard
          skill='React.js'
          level='Intermediate'
          suggestion='Needs improvement'
          actionLabel='Add'
        />
        <SkillCard
          skill='TypeScript'
          level='Intermediate'
          suggestion='On track'
          actionLabel='View'
        />
      </Stack>
    </Stack>
  );
};

export default SkillGapAnalysis;


