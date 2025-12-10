'use client';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Divider, SelectProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { apiClientClient } from '@/services/api-client';
import { useWizardStore } from '@/store/wizard';

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
            '& .MuiMenu-list': { py: 0.5 },
            '& .MuiMenuItem-root:hover': { bgcolor: 'primary.light' },
        },
    },
};

const IntroDialog: FunctionComponent<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { data, updateField, validate, resetWizard } = useWizardStore();

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

    const isSaveDisabled = useMemo(() => {
        const hasFullName = data.fullName.trim().length > 0;
        const hasMainSkill = data.mainSkill.trim().length > 0;

        const dobParts = data.dateOfBirth.trim().split('/');
        const isDobComplete =
            dobParts.length === 3 &&
            dobParts[0].length >= 1 &&
            dobParts[0].length <= 2 &&
            dobParts[1].length >= 1 &&
            dobParts[1].length <= 2 &&
            dobParts[2].length === 4;

        return !(hasFullName && hasMainSkill && isDobComplete);
    }, [data.fullName, data.mainSkill, data.dateOfBirth]);

    const handleConfirm = () => {
        const isValid = validate();
        if (!isValid) {
            onClose();
            return;
        }
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

                    <MuiInput
                        label='Your date of birth'
                        placeholder='DD/MM/YYYY'
                        value={data.dateOfBirth}
                        onChange={(value) => updateField('dateOfBirth', value.replace(/[^\d/]/g, '').slice(0, 10))}
                    />
                </StackContent>

                <Divider />

                <ActionContainer>
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
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default IntroDialog;
