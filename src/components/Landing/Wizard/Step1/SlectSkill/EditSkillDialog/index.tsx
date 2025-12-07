import { FunctionComponent, useEffect, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, SelectProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption, SelectOptionValue } from '@/components/UI/MuiSelectOptions';

import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';
import { AllSkill } from '../data';

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
  const initialValue = initialSkillId ?? skillOptions[0]?.value ?? '';
  const [selectedSkillId, setSelectedSkillId] = useState<SelectOptionValue>(initialValue);

  useEffect(() => {
    setSelectedSkillId(initialSkillId ?? skillOptions[0]?.value ?? '');
  }, [initialSkillId, open]);

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
            placeholder='Select one of your skills'
            value={selectedSkillId}
            options={skillOptions}
            onChange={(value) => setSelectedSkillId(value)}
            menuProps={selectMenuProps}
            fullWidth={false}
            sx={{ width: '258px' }}
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
