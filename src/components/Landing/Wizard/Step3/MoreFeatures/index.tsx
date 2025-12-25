import { FunctionComponent } from 'react';

import { Typography, Grid, Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import ResumeMoreTemplates from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesLeft';
import ResumeTemplatesRight from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';

interface MoreFeaturesProps {
  setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES') => void;
}

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = (props) => {
  const { setStage } = props;
  const router = useRouter();
  const requestId = useWizardStore((state) => state.requestId);

  return (
    <>
      <Stack textAlign='center' mt={2} mb={2}>
        <Typography variant='h5' color='text.primary' fontWeight='500' mt={0.5}>
          More Features
        </Typography>
        <Typography variant='h6' color='text.primary' mt={2} fontWeight='400'>
          You can utilize these features with your resume
        </Typography>
      </Stack>
      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 6 }}>
          {Array.from({ length: 3 }).map((_, index) =>
            index === 0 ? (
              <ResumeMoreTemplates key={index} />
            ) : (
              <Box key={index} mt={2.5}>
                <ResumeMoreTemplates />
              </Box>
            ),
          )}
        </Grid>
        <Grid size={{ xs: 6 }}>
          <ResumeTemplatesRight />
        </Grid>
      </Grid>

      <Stack direction='row' gap={3} justifyContent='center' p={5}>
        <MuiButton
          text='Back'
          variant='outlined'
          color='secondary'
          size='large'
          startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
          onClick={() => setStage('RESUME_EDITOR')}
        />
        <MuiButton
          text='Submit'
          variant='contained'
          color='secondary'
          size='large'
          onClick={() => {
            const qs = new URLSearchParams();
            if (requestId) qs.set('requestId', requestId);
            router.push(`/resume-generator${qs.toString() ? `?${qs.toString()}` : ''}`);
          }}
        />
      </Stack>
    </>
  );
};

export default MoreFeatures;
