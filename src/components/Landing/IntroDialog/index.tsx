'use client';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Divider, SelectProps, Stack, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { apiClientClient } from '@/services/api-client';
import { useWizardStore } from '@/store/wizard';
import { isValidDateOfBirthDDMMYYYY, normalizeDateOfBirthInput } from '@/utils/validation';

import {
    StackContent,
    StackContainer,
    ActionContainer,
    DialogContainer,
    HeaderContainer,
} from '../Wizard/Step1/SlectSkill/EditSkillDialog/styled';

const selectMenuProps: SelectProps['MenuProps'] = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: {
        sx: {
            maxHeight: '180px',
            overflowY: 'auto',
            py: 1,
            bgcolor: 'grey.50',
            '& .MuiMenu-list': { py: 0.5 },
            '& .MuiMenuItem-root:hover': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-selected:hover': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-focusVisible': { bgcolor: 'grey.100' },
        },
    },
};

type IntroDialogProps = {
    open: boolean;
    onClose: () => void;

    showBackToDashboard?: boolean;
    backToDashboardHref?: string;
};

const IntroDialog: FunctionComponent<IntroDialogProps> = ({
    open,
    onClose,
    showBackToDashboard = false,
    backToDashboardHref = '/dashboard',
}) => {
    const { data, updateField } = useWizardStore();

    const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
    const [skillOptions, setSkillOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoadingSkills(true);
                const { data } = await apiClientClient.get('slills-categories');

                const options = data.data.map((skill: string) => ({ value: skill, label: skill }));
                setSkillOptions(options);
            } catch {
                console.error('Failed to fetch skills');
            } finally {
                setLoadingSkills(false);
            }
        };

        fetchSkills();
    }, []);

    const dobHasFullYear = useMemo(() => {
        const parts = String(data.dateOfBirth ?? '')
            .trim()
            .split('/');
        return parts.length === 3 && (parts[2]?.length ?? 0) === 4;
    }, [data.dateOfBirth]);

    const dobErrorText = useMemo(() => {
        if (!dobHasFullYear) return '';
        return isValidDateOfBirthDDMMYYYY(data.dateOfBirth) ? '' : 'Enter a valid past date (DD/MM/YYYY)';
    }, [data.dateOfBirth, dobHasFullYear]);

    const isSaveDisabled = useMemo(() => {
        const hasFullName = data.fullName.trim().length > 0;
        const hasMainSkill = data.mainSkill.trim().length > 0;
        const hasValidDob = isValidDateOfBirthDDMMYYYY(data.dateOfBirth);

        return !(hasFullName && hasMainSkill && hasValidDob);
    }, [data.fullName, data.mainSkill, data.dateOfBirth]);

    const handleConfirm = () => {
        const hasFullName = data.fullName.trim().length > 0;
        const hasMainSkill = data.mainSkill.trim().length > 0;
        const hasValidDob = isValidDateOfBirthDDMMYYYY(data.dateOfBirth);
        if (!(hasFullName && hasMainSkill && hasValidDob)) return;
        onClose();
    };

    return (
        <DialogContainer open={open} maxWidth='xs' PaperProps={{ sx: { height: '413px' } }}>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        Primary information
                    </Typography>
                </HeaderContainer>

                <StackContent gap={1.5}>
                    <MuiInput
                        label='Full name'
                        value={data.fullName}
                        onChange={(value) => updateField('fullName', String(value ?? ''))}
                    />
                    <MuiInput
                        label='Your date of birth'
                        placeholder='DD/MM/YYYY'
                        value={data.dateOfBirth}
                        error={!!dobErrorText}
                        helperText={dobErrorText}
                        onChange={(value) => updateField('dateOfBirth', normalizeDateOfBirthInput(String(value ?? '')))}
                    />
                    <MuiSelectOptions
                        label='Your main skill'
                        placeholder={loadingSkills ? 'Loading...' : 'Select one of your skills'}
                        value={data.mainSkill}
                        options={skillOptions}
                        onChange={(value) => updateField('mainSkill', String(value))}
                        fullWidth
                        disabled={loadingSkills}
                        menuProps={selectMenuProps}
                        selectProps={{
                            sx: {
                                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' },
                            },
                        }}
                    />
                </StackContent>

                <Divider />

                <ActionContainer>
                    {showBackToDashboard ? (
                        <Stack direction='row' gap={1} sx={{ width: '258px' }}>
                            <MuiButton
                                fullWidth
                                variant='outlined'
                                color='secondary'
                                sx={{ flex: 1, minWidth: 0 }}
                                href={backToDashboardHref}
                            >
                                Back
                            </MuiButton>
                            <MuiButton
                                fullWidth
                                variant='contained'
                                color='secondary'
                                sx={{ flex: 1, minWidth: 0 }}
                                onClick={handleConfirm}
                                disabled={isSaveDisabled}
                            >
                                Save
                            </MuiButton>
                        </Stack>
                    ) : (
                        <MuiButton
                            fullWidth
                            variant='contained'
                            color='secondary'
                            sx={{ width: '258px' }}
                            onClick={handleConfirm}
                            disabled={isSaveDisabled}
                        >
                            Save
                        </MuiButton>
                    )}
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default IntroDialog;
