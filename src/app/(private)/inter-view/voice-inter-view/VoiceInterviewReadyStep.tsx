import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { VoiceScoreSards } from './styled';
import VoiceQuestionsList, { InterviewQuestionItem } from './VoiceQuestionsList';

interface VoiceInterviewReadyStepProps {
    answer: string;
    voiceUrl?: string | null;
    voiceBlob?: Blob | null;
    voiceDuration?: number;
    onClearVoice?: () => void;
    onBack?: () => void;
    onStart?: () => void;
    onRepeat?: () => void;
    items?: InterviewQuestionItem[];
    isLoading?: boolean;
    error?: string | null;
}

const VoiceInterviewReadyStep = ({ items, isLoading, error }: VoiceInterviewReadyStepProps) => {
    const hasItems = Boolean(items && items.length > 0);

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
                    {isLoading && (
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                            Generating interview questions...
                        </Typography>
                    )}
                    {error && (
                        <Typography variant='body2' color='error.main' sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {!isLoading && !error && hasItems && <VoiceQuestionsList items={items} />}
                    {!isLoading && !error && !hasItems && (
                        <Typography variant='body2' color='text.secondary'>
                            No interview questions available yet.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Stack>
    );
};

export default VoiceInterviewReadyStep;
