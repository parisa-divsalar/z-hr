import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { VoiceScoreSards } from './styled';
import VoiceQuestionsList from './VoiceQuestionsList';

interface VoiceInterviewReadyStepProps {
    answer: string;
    voiceUrl?: string | null;
    voiceBlob?: Blob | null;
    voiceDuration?: number;
    onClearVoice?: () => void;
    onBack?: () => void;
    onStart?: () => void;
    onRepeat?: () => void;
}

const VoiceInterviewReadyStep = (_props: VoiceInterviewReadyStepProps) => {
    return (
        <Stack width='100%' sx={{ alignSelf: 'stretch' }}>
            <Grid container width='100%'>
                <Grid size={{ xs: 12 }}>
                    <VoiceScoreSards className='scoreSards' mt={2} mb={2}>
                        <Stack
                            sx={{
                                width: 61,
                                height: 61,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant='h4' color='primary.light' fontWeight='500' textAlign='center'>
                                34%
                            </Typography>
                        </Stack>

                        <Typography variant='body2' color='text.secondary' fontWeight='492' ml={3}>
                            Number of questions{' '}
                        </Typography>
                        <Typography variant='body1' color='text.primary' fontWeight='584'>
                            10 Questions{' '}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' fontWeight='492' ml={3}>
                            Time duration{' '}
                        </Typography>
                        <Typography variant='body1' color='text.primary' fontWeight='584'>
                            09:57{' '}
                        </Typography>
                    </VoiceScoreSards>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <VoiceQuestionsList />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default VoiceInterviewReadyStep;
