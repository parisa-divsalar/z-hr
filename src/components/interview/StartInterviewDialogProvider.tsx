'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dialog, Divider, IconButton, SelectProps, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';

import {
    START_INTERVIEW_DIALOG_ACTIONS_SX,
    START_INTERVIEW_DIALOG_CONTENT_SX,
    START_INTERVIEW_DIALOG_HEADER_SX,
    START_INTERVIEW_DIALOG_MENU_PAPER_SX,
    START_INTERVIEW_DIALOG_PAPER_SX,
    START_INTERVIEW_DIALOG_SELECT_SX,
} from './styled';

export type InterviewTypeValue = 'chat' | 'voice' | 'video' | '';

const selectMenuProps: SelectProps['MenuProps'] = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: {
        sx: {
            ...START_INTERVIEW_DIALOG_MENU_PAPER_SX,
        },
    },
};

const resumeOptions: SelectOption[] = [
    { label: 'Resume 1', value: 'resume-1' },
    { label: 'Resume 2', value: 'resume-2' },
];

type InterviewDialogContextValue = {
    openStartDialog: (type: InterviewTypeValue) => void;
    closeStartDialog: () => void;
    startDialogOpen: boolean;
    selectedResume: string;
    setSelectedResume: (value: string) => void;
    selectedInterviewType: InterviewTypeValue;
    setSelectedInterviewType: (type: InterviewTypeValue) => void;
};

const InterviewDialogContext = createContext<InterviewDialogContextValue | undefined>(undefined);

const StartInterviewDialogProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<string>('');
    const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewTypeValue>('');
    const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
    const [lockedFeatureLabel, setLockedFeatureLabel] = useState<string>('this feature');

    const enabled = useMemo(() => new Set((access?.enabledKeys ?? []).filter(Boolean)), [access?.enabledKeys]);
    const isChatLocked = !isAccessLoading && !(enabled.has('question_interview') || enabled.has('text_interview'));
    const isVoiceLocked = !isAccessLoading && !enabled.has('voice_interview');

    const interviewTypeOptions: SelectOption[] = useMemo(() => {
        return [
            { label: 'Chat interview', value: 'chat', disabled: isAccessLoading || isChatLocked },
            { label: 'Voice interview', value: 'voice', disabled: isAccessLoading || isVoiceLocked },
            // Not implemented yet
            { label: 'Video interview', value: 'video', disabled: true },
        ];
    }, [isAccessLoading, isChatLocked, isVoiceLocked]);

    const openLockedDialog = (label: string) => {
        setLockedFeatureLabel(label);
        setLockedDialogOpen(true);
    };

    const openStartDialog = (type: InterviewTypeValue) => {
        if (type === 'chat' && (isAccessLoading || isChatLocked)) {
            openLockedDialog('Chat Interview');
            return;
        }
        if (type === 'voice' && (isAccessLoading || isVoiceLocked)) {
            openLockedDialog('Voice Interview');
            return;
        }
        if (type === 'video') {
            openLockedDialog('Video Interview');
            return;
        }
        setSelectedInterviewType(type);
        setStartDialogOpen(true);
    };

    const closeStartDialog = () => {
        setStartDialogOpen(false);
    };

    const canStart = Boolean(selectedResume) && Boolean(selectedInterviewType);

    const handleStart = () => {
        if (isAccessLoading) return;
        if (selectedInterviewType === 'chat' && isChatLocked) {
            openLockedDialog('Chat Interview');
            return;
        }
        if (selectedInterviewType === 'voice' && isVoiceLocked) {
            openLockedDialog('Voice Interview');
            return;
        }
        if (selectedInterviewType === 'video') {
            openLockedDialog('Video Interview');
            return;
        }
        closeStartDialog();
        if (selectedInterviewType === 'chat') {
            router.push(PrivateRoutes.chatInterView);
        } else if (selectedInterviewType === 'voice') {
            router.push(PrivateRoutes.voiceInterView);
        }
    };

    return (
        <InterviewDialogContext.Provider
            value={{
                openStartDialog,
                closeStartDialog,
                startDialogOpen,
                selectedResume,
                setSelectedResume,
                selectedInterviewType,
                setSelectedInterviewType,
            }}
        >
            {children}
            <PlanRequiredDialog
                open={lockedDialogOpen}
                onClose={() => setLockedDialogOpen(false)}
                title='Feature locked'
                headline={`"${lockedFeatureLabel}" is disabled for your account.`}
                bodyText='Buy coins/upgrade your plan, then enable it in More Features (Step 3).'
                primaryLabel='Buy plan / coins'
                primaryHref={PublicRoutes.pricing}
            />
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
                <Stack>
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
                        <MuiButton fullWidth variant='contained' color='secondary' disabled={!canStart} onClick={handleStart}>
                            Start
                        </MuiButton>
                    </Stack>
                </Stack>
            </Dialog>
        </InterviewDialogContext.Provider>
    );
};

const useInterviewDialog = () => {
    const context = useContext(InterviewDialogContext);
    if (!context) {
        throw new Error('useInterviewDialog must be used within StartInterviewDialogProvider');
    }
    return context;
};

export { StartInterviewDialogProvider as InterviewDialogProvider, useInterviewDialog };

