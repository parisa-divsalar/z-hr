import { FunctionComponent, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';

import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';
import { AllSkill } from '../data';

const skillOptions: SelectOption[] = AllSkill.map((skill) => ({
  value: skill.id,
  label: skill.label,
}));

interface EditSkillDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EditSkillDialog: FunctionComponent<EditSkillDialogProps> = (props) => {
  const { open, onClose, onConfirm } = props;
  const [selectedSkillId, setSelectedSkillId] = useState<string | number>(skillOptions[0]?.value ?? '');

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
          />
        </StackContent>

        <Divider />

        <ActionContainer direction='row'>
          <MuiButton fullWidth variant='contained' color='secondary' onClick={onConfirm}>
            Save
          </MuiButton>
        </ActionContainer>
      </StackContainer>
    </DialogContainer>
  );
};

export default EditSkillDialog;
