import { Stack, Typography } from '@mui/material';

import HeadIcon from '@/assets/images/dashboard/head.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { CardBase, MetaText, SectionHeader, BodyText, DASHBOARD_COLORS } from './styled';

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
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Skill Gap Analysis{' '}
          </Typography>
        </Stack>
        <MuiButton text='more' color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
      </SectionHeader>

      <Stack gap={2}>
        <SkillCard skill='React.js' level='Intermediate' suggestion='Needs improvement' actionLabel='Add' />
        <SkillCard skill='TypeScript' level='Intermediate' suggestion='On track' actionLabel='View' />
      </Stack>
    </Stack>
  );
};

export default SkillGapAnalysis;
