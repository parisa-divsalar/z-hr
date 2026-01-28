import { FunctionComponent, useEffect, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, SelectProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption, SelectOptionValue } from '@/components/UI/MuiSelectOptions';
import { apiClientClient } from '@/services/api-client';

import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';

const selectMenuProps: SelectProps['MenuProps'] = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: {
        sx: {
            maxHeight: '180px',
            overflowY: 'auto',
        },
    },
};

interface EditSkillDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (option: SelectOption) => void;
    initialSkillId?: SelectOptionValue;
}

const EditSkillDialog: FunctionComponent<EditSkillDialogProps> = (props) => {
    const { open, onClose, onConfirm, initialSkillId } = props;
    const [skillOptions, setSkillOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedSkillId, setSelectedSkillId] = useState<SelectOptionValue>('');

    useEffect(() => {
        if (!open) return;

        const fetchSkills = async () => {
            try {
                setLoading(true);
                const { data } = await apiClientClient.get('skills/categories');

                const list: string[] = data?.data ?? [];
                const options: SelectOption[] = list.map((skill) => ({
                    value: skill,
                    label: skill,
                }));

                setSkillOptions(options);

                if (options.length === 0) {
                    setSelectedSkillId('');
                    return;
                }

                if (initialSkillId !== undefined && initialSkillId !== null) {
                    const hasExactMatch = options.some((opt) => opt.value === initialSkillId);
                    if (hasExactMatch) {
                        setSelectedSkillId(initialSkillId);
                        return;
                    }

                    // اگر initialSkillId ایندکس عددی قدیمی باشد
                    const numericIndex = Number(initialSkillId);
                    if (!Number.isNaN(numericIndex) && options[numericIndex]) {
                        setSelectedSkillId(options[numericIndex].value);
                        return;
                    }
                }

                setSelectedSkillId(options[0].value);
            } catch {
                setSkillOptions([]);
                setSelectedSkillId('');
            } finally {
                setLoading(false);
            }
        };

        void fetchSkills();
    }, [open, initialSkillId]);

    return (
        <DialogContainer onClose={onClose} open={open} maxWidth='xs'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        Edit your main skill{' '}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </HeaderContainer>

                <StackContent>
                    <MuiSelectOptions
                        label='Your main skill'
                        placeholder={loading ? 'Loading...' : 'Select one of your skills'}
                        value={selectedSkillId}
                        options={skillOptions}
                        onChange={(value) => setSelectedSkillId(value)}
                        menuProps={selectMenuProps}
                        fullWidth={false}
                        sx={{ width: '258px' }}
                        disabled={loading || skillOptions.length === 0}
                    />
                </StackContent>

                <Divider />

                <ActionContainer>
                    <MuiButton
                        fullWidth
                        variant='contained'
                        color='secondary'
                        sx={{ width: '258px' }}
                        onClick={() => {
                            const selectedOption =
                                skillOptions.find((option) => option.value === selectedSkillId) ?? skillOptions[0];
                            if (selectedOption) {
                                onConfirm(selectedOption);
                            }
                        }}
                    >
                        Save
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default EditSkillDialog;
