import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import DeleteOutlineIcon from '@/assets/images/icons/clearButton.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import PropertyIcon from '@/assets/images/icons/property.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions from '@/components/UI/MuiSelectOptions';

import { ContactListContainer, ContactRow, InputContainer, InputContent, MainContainer } from './styled';

interface SKillInputProps {
  setStage: (stage: StageWizard) => void;
}

const SKillInput: FunctionComponent<SKillInputProps> = ({ setStage }) => {
  const [visaStatus, setVisaStatus] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [preferredContactMethod, setPreferredContactMethod] = useState<string>('');

  const canProceed = visaStatus.trim() !== '' && contactMethods.length > 0 && preferredContactMethod.trim() !== '';
  const isAddDisabled = contactInput.trim() === '' || (contactMethods.length >= 2 && editingIndex === null);

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

  useEffect(() => {
    if (preferredContactMethod && !contactMethods.includes(preferredContactMethod)) {
      setPreferredContactMethod('');
    }
  }, [contactMethods, preferredContactMethod]);

  const contactMethodOptions = useMemo(
    () => contactMethods.map((method) => ({ value: method, label: method })),
    [contactMethods],
  );

  return (
    <MainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='600'>
        Very good Ayla 😊{' '}
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='600'>
        You should answer a few questions about your resume.
      </Typography>

      <Typography variant='h5' color='text.primary' fontWeight='600' mt={6}>
        1. Your visa status?{' '}
      </Typography>

      <InputContainer direction='row' sx={{ borderColor: visaStatus === '' ? 'grey.100' : 'primary.main' }}>
        <InputContent
          placeholder='Type your answer...'
          value={visaStatus}
          onChange={(event: any) => setVisaStatus(event.target.value)}
        />
      </InputContainer>

      <Typography variant='h5' color='text.primary' fontWeight='600' mt={6}>
        2. Best way for employers to contact you?{' '}
      </Typography>

      <Stack mt={1} direction='row' alignItems='center' gap={2} width='100%' maxWidth='588px'>
        <InputContainer
          direction='row'
          sx={{
            borderColor: contactInput.trim() === '' ? 'grey.100' : 'primary.main',
            flex: 1,
            mt: 0,
          }}
        >
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
        <ContactListContainer>
          {contactMethods.map((method, index) => (
            <ContactRow key={`${method}-${index}`}>
              <Typography variant='body2' color='text.primary' sx={{ flex: 1, wordBreak: 'break-word' }}>
                {method}
              </Typography>

              <Stack direction='row' spacing={1}>
                <IconButton
                  aria-label='Edit contact method'
                  onClick={() => handleEditContact(index)}
                  size='small'
                  sx={{ padding: 0.5 }}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
                <IconButton
                  aria-label='Delete contact method'
                  onClick={() => handleDeleteContact(index)}
                  size='small'
                  sx={{ padding: 0.5 }}
                >
                  <DeleteOutlineIcon fontSize='small' />
                </IconButton>
              </Stack>
            </ContactRow>
          ))}
        </ContactListContainer>
      )}

      <MuiSelectOptions
        label='Preferred method'
        placeholder='Select an option'
        value={preferredContactMethod}
        options={contactMethodOptions}
        onChange={(value) => setPreferredContactMethod(value as string)}
        sx={{ width: '100%' }}
      />
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
