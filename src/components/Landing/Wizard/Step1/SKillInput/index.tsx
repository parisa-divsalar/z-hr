import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import DeleteOutlineIcon from '@/assets/images/icons/clearButton.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import PropertyIcon from '@/assets/images/icons/property.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { useWizardStore } from '@/store/wizard';

import {
    AddSkillIconButton,
    AutoGrowInputContainer,
    BottomActionsStack,
    ContactIconButton,
    ContactListContainer,
    ContactMethodText,
    ContactRow,
    InputContent,
    MainContainer,
    SkillIconButton,
    SkillListContainer,
    SkillRow,
    SkillText,
} from './styled';

const visaStatusOptions: SelectOption[] = [
    { value: 'citizen', label: 'Citizen' },
    { value: 'permanent_resident', label: 'Permanent resident' },
    { value: 'work_visa', label: 'Work visa' },
    { value: 'student_visa', label: 'Student visa' },
    { value: 'other', label: 'Other' },
];

const languageOptions: SelectOption[] = [
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Persian', label: 'Persian' },
    { value: 'English', label: 'English' },
];

const levelOptions: SelectOption[] = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
];

interface SKillInputProps {
    setStage: (stage: StageWizard) => void;
}

const SKillInput: FunctionComponent<SKillInputProps> = ({ setStage }) => {
    const { data, updateField } = useWizardStore();

    const [contactInput, setContactInput] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);

    const visaStatus = data.visaStatus;
    const contactMethods = data.contactWay;
    const skillEntries = data.languages;

    const visibleContactMethods = contactMethods
        .filter((value) => value.trim() !== '')
        .map((value, index) => ({ value, index }));

    const normalizedSelectedLanguage = selectedLanguage.trim();
    const normalizedSelectedLevel = selectedLevel.trim().toUpperCase();

    const hasContactInfo = visibleContactMethods.length > 0 || contactInput.trim() !== '';
    const hasLanguageSelection = normalizedSelectedLanguage !== '' && normalizedSelectedLevel !== '';
    const hasLanguageData = skillEntries.length > 0 || hasLanguageSelection;

    const canProceed = visaStatus.trim() !== '' && hasContactInfo && hasLanguageData;

    const isDuplicateSkillEntry = skillEntries.some(
        (entry, index) =>
            entry.name === normalizedSelectedLanguage &&
            entry.level === normalizedSelectedLevel &&
            index !== editingSkillIndex,
    );

    const isAddDisabled = contactInput.trim() === '' || (visibleContactMethods.length >= 2 && editingIndex === null);

    const isAddSkillDisabled = !hasLanguageSelection || isDuplicateSkillEntry;

    // ---------------- CONTACT METHODS ----------------

    const handleAddContact = () => {
        const trimmed = contactInput.trim();
        if (!trimmed) return;

        const nonEmptyContacts = contactMethods.filter((value) => value.trim() !== '');

        const updated =
            editingIndex !== null
                ? nonEmptyContacts.map((x, i) => (i === editingIndex ? trimmed : x))
                : [...nonEmptyContacts, trimmed];

        updateField('contactWay', updated);

        setContactInput('');
        setEditingIndex(null);
    };

    const handleEditContact = (index: number) => {
        const nonEmptyContacts = contactMethods.filter((value) => value.trim() !== '');
        setContactInput(nonEmptyContacts[index]);
        setEditingIndex(index);
    };

    const handleDeleteContact = (index: number) => {
        const nonEmptyContacts = contactMethods.filter((value) => value.trim() !== '');
        const updated = nonEmptyContacts.filter((_, i) => i !== index);
        updateField('contactWay', updated);
        setEditingIndex(null);
        setContactInput('');
    };

    const handleAddSkill = () => {
        if (!hasLanguageSelection || isDuplicateSkillEntry) return;

        const newSkill = {
            name: normalizedSelectedLanguage,
            level: normalizedSelectedLevel,
        };

        const updated =
            editingSkillIndex !== null
                ? skillEntries.map((x, i) => (i === editingSkillIndex ? newSkill : x))
                : [...skillEntries, newSkill];

        updateField('languages', updated);

        setSelectedLanguage('');
        setSelectedLevel('');
        setEditingSkillIndex(null);
    };

    const handleEditSkill = (index: number) => {
        const item = skillEntries[index];
        setSelectedLanguage(item.name);
        setSelectedLevel(item.level);
        setEditingSkillIndex(index);
    };

    const handleDeleteSkill = (index: number) => {
        const updated = skillEntries.filter((_, i) => i !== index);
        updateField('languages', updated);
        setEditingSkillIndex(null);
    };

    // ---------------- NEXT ----------------

    const handleNext = () => {
        if (contactInput.trim() !== '') handleAddContact();
        if (skillEntries.length === 0 && hasLanguageSelection) handleAddSkill();
        setStage('SELECT_SKILL');
    };

    return (
        <MainContainer>
            <Typography variant='h5' color='text.primary' fontWeight='584' mt={4}>
                Very good Ayla 😊
            </Typography>
            <Typography variant='h5' color='text.primary' fontWeight='584'>
                You should answer a few questions about your resume.
            </Typography>
            <Typography variant='h5' color='text.primary' fontWeight='584' mt={3}>
                <span style={{ fontWeight: 'normal' }}>1.</span> Your visa status?
            </Typography>

            <Stack mt={2} direction='row' style={{ width: '100%', maxWidth: '426px' }}>
                <MuiSelectOptions
                    placeholder='Select visa status'
                    value={visaStatus}
                    options={visaStatusOptions}
                    onChange={(v) => updateField('visaStatus', v as string)}
                    fullWidth
                />
            </Stack>

            <Typography variant='h5' color='text.primary' fontWeight='584' mt={6}>
                <span style={{ fontWeight: 'normal' }}>2.</span> Best way to contact you?
            </Typography>

            <Stack mt={2} direction='row' alignItems='center' gap={1} width='100%' maxWidth='426px'>
                <AutoGrowInputContainer direction='row' highlight={contactInput.trim() !== ''} grow noMarginTop>
                    <InputContent
                        placeholder='Type your answer...'
                        value={contactInput}
                        onChange={(e) => setContactInput(e.target.value)}
                    />
                </AutoGrowInputContainer>

                <IconButton onClick={handleAddContact} disabled={isAddDisabled}>
                    <PropertyIcon />
                </IconButton>
            </Stack>

            {visibleContactMethods.length > 0 && (
                <ContactListContainer pt={2} style={{ maxWidth: '426px' }}>
                    {visibleContactMethods.map(({ value, index }) => (
                        <ContactRow key={index}>
                            <ContactMethodText variant='body2' color='text.primary'>
                                {value}
                            </ContactMethodText>

                            <Stack direction='row' gap={1}>
                                <ContactIconButton onClick={() => handleEditContact(index)} size='small'>
                                    <EditIcon fontSize='small' />
                                </ContactIconButton>
                                <ContactIconButton onClick={() => handleDeleteContact(index)} size='small'>
                                    <DeleteOutlineIcon fontSize='small' />
                                </ContactIconButton>
                            </Stack>
                        </ContactRow>
                    ))}
                </ContactListContainer>
            )}

            {/* --- Languages section --- */}

            <Typography variant='h5' color='text.primary' fontWeight='584' mt={6}>
                <span style={{ fontWeight: 'normal' }}>3.</span> Your language skills?
            </Typography>

            <BottomActionsStack mt={2} direction='row' alignItems='center' gap={1} width='100%' maxWidth='426px'>
                <MuiSelectOptions
                    placeholder='Language'
                    value={selectedLanguage}
                    options={languageOptions}
                    onChange={(v) => setSelectedLanguage(v as string)}
                    fullWidth
                />

                <MuiSelectOptions
                    placeholder='Level'
                    value={selectedLevel}
                    options={levelOptions}
                    onChange={(v) => setSelectedLevel(v as string)}
                />

                <AddSkillIconButton onClick={handleAddSkill} disabled={isAddSkillDisabled}>
                    <PropertyIcon />
                </AddSkillIconButton>
            </BottomActionsStack>

            {skillEntries.length > 0 && (
                <SkillListContainer pt={2} style={{ maxWidth: '426px' }}>
                    {skillEntries.map((entry, idx) => (
                        <SkillRow key={idx}>
                            <SkillText color='text.primary'>
                                {entry.name} - {entry.level}
                            </SkillText>

                            <Stack direction='row' gap={1}>
                                <SkillIconButton onClick={() => handleEditSkill(idx)} size='small'>
                                    <EditIcon fontSize='small' />
                                </SkillIconButton>

                                <SkillIconButton onClick={() => handleDeleteSkill(idx)} size='small'>
                                    <DeleteOutlineIcon fontSize='small' />
                                </SkillIconButton>
                            </Stack>
                        </SkillRow>
                    ))}
                </SkillListContainer>
            )}

            <Stack mt={4} mb={6} direction='row' gap={3}>
                {/* <MuiButton
                    color='secondary'
                    variant='outlined'
                    size='large'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setStage('SELECT_SKILL')}
                >
                    Back
                </MuiButton> */}

                <MuiButton
                    color='secondary'
                    size='large'
                    endIcon={<ArrowRightIcon />}
                    onClick={handleNext}
                    disabled={!canProceed}
                >
                    Next
                </MuiButton>
            </Stack>
        </MainContainer>
    );
};

export default SKillInput;
