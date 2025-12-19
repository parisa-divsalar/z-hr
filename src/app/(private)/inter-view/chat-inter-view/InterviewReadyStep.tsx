import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import QuestionsList from './QuestionsList';
import { ScoreSards } from './styled';

interface InterviewReadyStepProps {
    answer: string;
    onBack?: () => void;
    onStart?: () => void;
    onRepeat?: () => void;
}

const InterviewReadyStep = (_props: InterviewReadyStepProps) => {
    return (
        <Stack width='100%' sx={{ alignSelf: 'stretch' }}>
            <Typography variant='h5' color='text.primary' fontWeight='492' mt={2}>
                You chat interview score{' '}
            </Typography>
            <Grid container width='100%'>
                <Grid size={{ xs: 12 }}>
                    <ScoreSards className='scoreSards'>
                        <Stack
                            sx={{
                                width: 61,
                                height: 61,
                                borderRadius: '50%',
                                bgcolor: 'success.light',
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
                    </ScoreSards>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <QuestionsList />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default InterviewReadyStep;
