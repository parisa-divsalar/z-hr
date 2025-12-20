'use client';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import { CardBaseiNTER, SectionHeader } from '@/components/dashboard/styled';
import { useInterviewDialog } from '@/components/interview/StartInterviewDialogProvider';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

const UpcomingInterview = () => {
    const { openStartDialog } = useInterviewDialog();

    return (
        <CardBaseiNTER>
            <SectionHeader>
                <Typography color='text.primary' variant='subtitle1' fontWeight='500'>
                    Interview
                </Typography>
                <MuiButton
                    text='Continue'
                    color='secondary'
                    variant='contained'
                    endIcon={<ArrowRightIcon />}
                    onClick={() => openStartDialog('chat')}
                />
            </SectionHeader>

            <Stack>
                <Stack gap={1}>
                    <Stack direction='row' gap={1.5} alignItems='center'>
                        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                            Chat Interview
                        </Typography>
                        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                            09/09/2025
                        </Typography>
                        <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
                            9/2
                        </Typography>

                        <Stack mb={1}>
                            <MuiChips
                                label='7 Steps'
                                color='white'
                                sx={{
                                    bgcolor: 'warning.main',
                                    Radius: '8px',
                                    height: '26px',
                                    width: '85px',
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </CardBaseiNTER>
    );
};

export default UpcomingInterview;
