import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, SelectProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import MuiSelectOptions, { SelectOption, SelectOptionValue } from '@/components/UI/MuiSelectOptions';

import { AllSkill } from '../Wizard/Step1/SlectSkill/data';
import {
  ActionContainer,
  DialogContainer,
  HeaderContainer,
  StackContainer,
  StackContent,
} from '../Wizard/Step1/SlectSkill/EditSkillDialog/styled';

interface IntroDialogProps {
  open: boolean;
  onClose: () => void;
}

const skillOptions: SelectOption[] = AllSkill.map((skill) => ({
  value: skill.id,
  label: skill.label,
}));

const selectMenuProps: SelectProps['MenuProps'] = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  transformOrigin: { vertical: 'top', horizontal: 'left' },
  PaperProps: {
    sx: {
      maxHeight: '180px',
      overflowY: 'auto',
      // کمی فاصله از لبه‌های لیست
      py: 1,
      '& .MuiMenu-list': {
        py: 0.5,
      },
      // هاور با رنگ سبز تم (primary.light)
      '& .MuiMenuItem-root:hover': {
        bgcolor: 'primary.light',
      },
    },
  },
};

const IntroDialog: FunctionComponent<IntroDialogProps> = (props) => {
  const { open, onClose } = props;

  const [fullName, setFullName] = useState<string>('');
  const [mainSkillId, setMainSkillId] = useState<SelectOptionValue>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  const isSaveDisabled = useMemo(() => {
    return !fullName.trim() || !mainSkillId || !dateOfBirth.trim();
  }, [fullName, mainSkillId, dateOfBirth]);

  useEffect(() => {
    if (!open) {
      setFullName('');
      setMainSkillId('');
      setDateOfBirth('');
    }
  }, [open]);

  const handleConfirm = () => {
    // TODO: connect with state / API when needed
    onClose();
  };

  const handleDateChange = (value: string) => {
    // اجازه فقط عدد و / و حداکثر 10 کاراکتر (فرمت DD/MM/YYYY)
    const cleaned = value.replace(/[^\d/]/g, '').slice(0, 10);
    setDateOfBirth(cleaned);
  };

  return (
    <DialogContainer onClose={onClose} open={open} maxWidth='xs'>
      <StackContainer>
        <HeaderContainer direction='row'>
          <Typography color='text.primary' variant='body1' fontWeight={500}>
            Primary information{' '}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </HeaderContainer>

        <StackContent gap={1.5}>
          <MuiInput
            label='Full name'
            value={fullName}
            onChange={(value) => setFullName(String(value ?? ''))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '8px',
              },
            }}
          />

          <MuiSelectOptions
            label='Your main skill'
            placeholder='Select one of your skills'
            value={mainSkillId}
            options={skillOptions}
            onChange={(value) => setMainSkillId(value)}
            fullWidth
            menuProps={selectMenuProps}
            selectProps={{
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '8px',
                },
              },
            }}
          />

          <MuiInput
            label='Your date of birth'
            placeholder='DD/MM/Year'
            value={dateOfBirth}
            onChange={(value) => handleDateChange(String(value ?? ''))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '8px',
              },
            }}
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
