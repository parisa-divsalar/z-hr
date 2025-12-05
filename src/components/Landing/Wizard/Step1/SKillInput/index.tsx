import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import DeleteOutlineIcon from '@/assets/images/icons/clearButton.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import PropertyIcon from '@/assets/images/icons/property.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';

import {
  AddSkillIconButton,
  BottomActionsStack,
  ContactIconButton,
  ContactListContainer,
  ContactMethodText,
  ContactRow,
  InputContainer,
  InputContent,
  MainContainer,
  SkillIconButton,
  SkillListContainer,
  SkillRow,
  SkillText,
} from './styled';

interface SKillInputProps {
  setStage: (stage: StageWizard) => void;
}

const languageOptions: SelectOption[] = [
  { value: 'arabic', label: 'arabic' },
  { value: 'persian', label: 'persian' },
  { value: 'english', label: 'english' },
];

const levelOptions: SelectOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
  { value: 'd', label: 'D' },
];

interface SkillEntry {
  language: string;
  level: string;
}

const SKillInput: FunctionComponent<SKillInputProps> = ({ setStage }) => {
  const [visaStatus, setVisaStatus] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [skillEntries, setSkillEntries] = useState<SkillEntry[]>([]);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);

  const canProceed = visaStatus.trim() !== '' && contactMethods.length > 0 && skillEntries.length > 0;
  const hasLanguageSelection = selectedLanguage.trim() !== '' && selectedLevel.trim() !== '';
  const isAddDisabled = contactInput.trim() === '' || (contactMethods.length >= 2 && editingIndex === null);
  const isAddSkillDisabled = !hasLanguageSelection;

  const handleAddContact = () => {
    const trimmedValue = contactInput.trim();
    if (!trimmedValue) {
      return;
    }

    if (editingIndex === null && contactMethods.length >= 2) {
      return;
    }

    setContactMethods((previousMethods) =>
      editingIndex !== null
        ? previousMethods.map((method, index) => (index === editingIndex ? trimmedValue : method))
        : [...previousMethods, trimmedValue],
    );
    setContactInput('');
    setEditingIndex(null);
  };

  const handleEditContact = (index: number) => {
    setContactInput(contactMethods[index]);
    setEditingIndex(index);
  };

  const handleDeleteContact = (index: number) => {
    setContactMethods((previousMethods) => previousMethods.filter((_, idx) => idx !== index));
    if (editingIndex !== null) {
      setEditingIndex(null);
      setContactInput('');
    }
  };

  const handleAddSkill = () => {
    if (!hasLanguageSelection) {
      return;
    }

    const newEntry: SkillEntry = {
      language: selectedLanguage,
      level: selectedLevel,
    };

    setSkillEntries((previousEntries) =>
      editingSkillIndex !== null
        ? previousEntries.map((entry, index) => (index === editingSkillIndex ? newEntry : entry))
        : [...previousEntries, newEntry],
    );
    setSelectedLanguage('');
    setSelectedLevel('');
    setEditingSkillIndex(null);
  };

  const handleEditSkill = (index: number) => {
    const entry = skillEntries[index];
    if (!entry) {
      return;
    }

    setSelectedLanguage(entry.language);
    setSelectedLevel(entry.level);
    setEditingSkillIndex(index);
  };

  const handleDeleteSkill = (index: number) => {
    setSkillEntries((previousEntries) => previousEntries.filter((_, idx) => idx !== index));
    if (editingSkillIndex !== null) {
      setEditingSkillIndex(null);
      setSelectedLanguage('');
      setSelectedLevel('');
    }
  };

  return (
    <MainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='584'>
        Very good Ayla 😊{' '}
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='584'>
        You should answer a few questions about your resume.
      </Typography>

      <Typography variant='h5' color='text.primary' fontWeight='584' mt={6}>
        <span style={{ fontWeight: 'normal' }}> 1. </span>
        Your visa status?
      </Typography>

      <InputContainer direction='row' highlight={visaStatus !== ''}>
        <InputContent
          placeholder='Type your answer...'
          value={visaStatus}
          onChange={(event: any) => setVisaStatus(event.target.value)}
        />
      </InputContainer>

      <Typography variant='h5' color='text.primary' fontWeight='584' mt={6}>
        <span style={{ fontWeight: 'normal' }}> 1. </span>
        Best way for employers to contact you?
      </Typography>

      <Stack mt={1} direction='row' alignItems='center' gap={1} width='100%' maxWidth='458px'>
        <InputContainer direction='row' highlight={contactInput.trim() !== ''} grow noMarginTop>
          <InputContent
            placeholder='Type your answer...'
            value={contactInput}
            onChange={(event: any) => setContactInput(event.target.value)}
          />
        </InputContainer>

        <IconButton
          aria-label={editingIndex !== null ? 'Save contact method' : 'Add contact method'}
          onClick={handleAddContact}
          disabled={isAddDisabled}
        >
          <PropertyIcon />
        </IconButton>
      </Stack>

      {contactMethods.length > 0 && (
        <ContactListContainer pt={2} style={{ maxWidth: '458px' }}>
          {contactMethods.map((method, index) => (
            <ContactRow key={`${method}-${index}`} maxWidth='458px'>
              <ContactMethodText variant='body2' color='text.primary'>
                {method}
              </ContactMethodText>

              <Stack direction='row' spacing={2}>
                <ContactIconButton
                  aria-label='Edit contact method'
                  onClick={() => handleEditContact(index)}
                  size='small'
                >
                  <EditIcon fontSize='small' />
                </ContactIconButton>
                <ContactIconButton
                  aria-label='Delete contact method'
                  onClick={() => handleDeleteContact(index)}
                  size='small'
                >
                  <DeleteOutlineIcon fontSize='small' />
                </ContactIconButton>
              </Stack>
            </ContactRow>
          ))}
        </ContactListContainer>
      )}
      <Typography variant='h5' color='text.primary' fontWeight='584' mt={6}>
        <span style={{ fontWeight: 'normal' }}> 3. </span>
        Your language skills?
      </Typography>

      <BottomActionsStack
        mt={1}
        direction='row'
        alignItems='stretch'
        gap={1}
        width='100%'
        style={{ maxWidth: '458px' }}
      >
        <MuiSelectOptions
          placeholder='Language'
          value={selectedLanguage}
          options={languageOptions}
          onChange={(value) => setSelectedLanguage(value as string)}
          fullWidth
        />
        <MuiSelectOptions
          placeholder='Level'
          value={selectedLevel}
          options={levelOptions}
          onChange={(value) => setSelectedLevel(value as string)}
        />
        <AddSkillIconButton
          style={{ margin: 0 }}
          aria-label={editingSkillIndex !== null ? 'Save skill entry' : 'Add skill entry'}
          onClick={handleAddSkill}
          disabled={isAddSkillDisabled}
        >
          <PropertyIcon />
        </AddSkillIconButton>
      </BottomActionsStack>
      {skillEntries.length > 0 && (
        <SkillListContainer>
          {skillEntries.map((entry, index) => (
            <SkillRow key={`${entry.language}-${entry.level}-${index}`}>
              <SkillText variant='body2' color='text.primary'>
                {entry.language} - {entry.level}
              </SkillText>
              <Stack direction='row' spacing={1}>
                <SkillIconButton aria-label='Edit skill entry' onClick={() => handleEditSkill(index)} size='small'>
                  <EditIcon fontSize='small' />
                </SkillIconButton>
                <SkillIconButton aria-label='Delete skill entry' onClick={() => handleDeleteSkill(index)} size='small'>
                  <DeleteOutlineIcon fontSize='small' />
                </SkillIconButton>
              </Stack>
            </SkillRow>
          ))}
        </SkillListContainer>
      )}
      <Stack mt={4} mb={6} direction='row' gap={3}>
        <MuiButton
          color='secondary'
          variant='outlined'
          size='large'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SELECT_SKILL')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          size='large'
          onClick={() => setStage('QUESTIONS')}
          disabled={!canProceed}
        >
          Next
        </MuiButton>
      </Stack>
    </MainContainer>
  );
};

export default SKillInput;
