'use client';

import { useMemo, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dialog, Divider, IconButton, SelectProps, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

import InterviewIcon from '@/assets/images/dashboard/imag/interview.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { PrivateRoutes } from '@/config/routes';

import {
    SmallCardBase,
    START_INTERVIEW_DIALOG_ACTIONS_SX,
    START_INTERVIEW_DIALOG_CONTENT_SX,
    START_INTERVIEW_DIALOG_HEADER_SX,
    START_INTERVIEW_DIALOG_MENU_PAPER_SX,
    START_INTERVIEW_DIALOG_PAPER_SX,
    START_INTERVIEW_DIALOG_SELECT_SX,
    StatValueRow,
} from './styled';

type InterviewTypeValue = 'chat' | 'voice' | 'video' | '';

const selectMenuProps: SelectProps['MenuProps'] = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: {
        sx: {
            ...START_INTERVIEW_DIALOG_MENU_PAPER_SX,
        },
    },
};

const InterviewStats = () => {
    const router = useRouter();
    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<string>('');
    const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewTypeValue>('');

    const resumeOptions: SelectOption[] = useMemo(
        () => [
            { label: 'Resume 1', value: 'resume-1' },
            { label: 'Resume 2', value: 'resume-2' },
        ],
        [],
    );

    const interviewTypeOptions: SelectOption[] = useMemo(
        () => [
            { label: 'Chat interview', value: 'chat' },
            { label: 'Voice interview', value: 'voice' },
            { label: 'Video interview', value: 'video' },
        ],
        [],
    );

    const openStartDialog = (type: InterviewTypeValue) => {
        setSelectedInterviewType(type);
        setStartDialogOpen(true);
    };

    const closeStartDialog = () => {
        setStartDialogOpen(false);
    };

    const canStart = Boolean(selectedResume) && Boolean(selectedInterviewType);

    return (
        <>
            <Grid container spacing={2} width='100%'>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SmallCardBase>
                        <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Stack sx={{ width: 100, height: 100 }}>
                                    <InterviewIcon />
                                </Stack>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                                        Chat Interview
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                                        2/3 free credits used
                                    </Typography>
                                    <Typography mt={1} variant='subtitle2' fontWeight='400' color='text.primary'>
                                        2 Credit
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack mt={5}>
                                {' '}
                                <MuiButton variant='outlined' color='secondary' onClick={() => openStartDialog('chat')}>
                                    Start{' '}
                                </MuiButton>
                            </Stack>
                        </StatValueRow>
                    </SmallCardBase>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <SmallCardBase>
                        <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Stack sx={{ width: 100, height: 100 }}>
                                    <InterviewIcon />
                                </Stack>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                                        Voice Interview{' '}
                                    </Typography>
                                    <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                                        2/3 free credits used
                                    </Typography>
                                    <Typography mt={1} variant='subtitle2' fontWeight='400' color='text.primary'>
                                        2 Credit
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack mt={5}>
                                {' '}
                                <MuiButton
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => openStartDialog('voice')}
                                >
                                    Start{' '}
                                </MuiButton>
                            </Stack>
                        </StatValueRow>
                    </SmallCardBase>
                </Grid>
            </Grid>

            <Dialog
                open={startDialogOpen}
                onClose={closeStartDialog}
                maxWidth='xs'
                fullWidth
                PaperProps={{
                    sx: {
                        ...START_INTERVIEW_DIALOG_PAPER_SX,
                    },
                }}
            >
                <Stack mx={3}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                        sx={START_INTERVIEW_DIALOG_HEADER_SX}
                    >
                        <Typography color='text.primary' variant='subtitle1' fontWeight={500}>
                            Interview{' '}
                        </Typography>
                        <IconButton onClick={closeStartDialog}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    <Divider />

                    <Stack gap={2} sx={START_INTERVIEW_DIALOG_CONTENT_SX}>
                        <MuiSelectOptions
                            placeholder='Select a resume'
                            value={selectedResume}
                            options={resumeOptions}
                            onChange={(value) => setSelectedResume(String(value))}
                            fullWidth
                            menuProps={selectMenuProps}
                            selectProps={{
                                sx: START_INTERVIEW_DIALOG_SELECT_SX,
                            }}
                        />

                        <MuiSelectOptions
                            placeholder='Select interview type'
                            value={selectedInterviewType}
                            options={interviewTypeOptions}
                            onChange={(value) => setSelectedInterviewType(value as InterviewTypeValue)}
                            fullWidth
                            menuProps={selectMenuProps}
                            selectProps={{
                                sx: START_INTERVIEW_DIALOG_SELECT_SX,
                            }}
                        />
                    </Stack>

                    <Divider />

                    <Stack direction='row' gap={1} sx={START_INTERVIEW_DIALOG_ACTIONS_SX}>
                        <MuiButton
                            fullWidth
                            variant='contained'
                            color='secondary'
                            disabled={!canStart}
                            onClick={() => {
                                closeStartDialog();
                                if (selectedInterviewType === 'chat') {
                                    router.push(PrivateRoutes.chatInterView);
                                }
                            }}
                        >
                            Start
                        </MuiButton>
                    </Stack>
                </Stack>
            </Dialog>
        </>
    );
};

export default InterviewStats;
