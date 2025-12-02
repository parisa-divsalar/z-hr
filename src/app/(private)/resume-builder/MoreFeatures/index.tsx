import React, { FunctionComponent } from 'react';

import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { MoreFeaturesTemplateCard, MoreFeaturesTemplatesWrapper } from '@/app/(private)/resume-builder/styled';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import MuiButton from '@/components/UI/MuiButton';

const TemplateCard: FunctionComponent<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <MoreFeaturesTemplateCard>
      <FormControlLabel
        control={<Checkbox />}
        label={
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            {title || 'Sample checkbox label'}
          </Typography>
        }
      />
      <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
        {description}
      </Typography>
    </MoreFeaturesTemplateCard>
  );
};

export const ResumeTemplates: FunctionComponent = () => {
  return (
    <Stack spacing={1.5}>
      <TemplateCard title='Modern' description='Clean layout with bold headings and clear sections.' />
      <TemplateCard title='Professional' description='Classic structure ideal for corporate roles.' />
      <TemplateCard title='Creative' description='Visual style for design and creative positions.' />
    </Stack>
  );
};

interface MoreFeaturesProps {
  onBack: () => void;
  onSubmit: () => void;
}

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = ({ onBack, onSubmit }) => {
  return (
    <Stack width='100%'>
      <Stack textAlign='center' mt={2}>
        <Typography variant='h5' color='text.primary' fontWeight='600' mt={0.5}>
          More Features
        </Typography>
        <Typography variant='h6' color='text.primary' fontWeight='400' mt={1} mb={3}>
          Choose your preferred resume template
        </Typography>
      </Stack>

      <MoreFeaturesTemplatesWrapper>
        <ResumeTemplates />
      </MoreFeaturesTemplatesWrapper>

      <Stack direction='row' spacing={2} justifyContent='center' p={4}>
        <MuiButton
          text='Back'
          variant='outlined'
          size='large'
          color='secondary'
          startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
          onClick={onBack}
        />
        <MuiButton size='large' text='Submit' variant='contained' color='secondary' onClick={onSubmit} />
      </Stack>
    </Stack>
  );
};

export default MoreFeatures;
