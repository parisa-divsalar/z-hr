import { FunctionComponent } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, Typography } from '@mui/material';

import { ChipContainer } from '@/components/Card/Chip/styled';
import { TSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';

interface ChipSkillProps {
  skill: TSkill;
  onUpdateSkill: (id: string, selected: boolean) => void;
}
const ChipSkill: FunctionComponent<ChipSkillProps> = (props) => {
  const { skill, onUpdateSkill } = props;
  const { id, label = '', selected = false } = skill || {};

  return (
    <ChipContainer
      direction='row'
      bgcolor={selected ? 'primary.light' : 'transparent'}
      border={selected ? `2px solid #4d49fc` : '1px solid #07656814'}
      onClick={() => !selected && onUpdateSkill(id, true)}
    >
      {selected && (
        <IconButton sx={{ padding: '0' }} onClick={() => onUpdateSkill(id, false)}>
          <CloseRoundedIcon color='primary' />
        </IconButton>
      )}
      <Typography variant='subtitle1' color='text.primary' fontWeight={500} noWrap>
        {label}
      </Typography>
    </ChipContainer>
  );
};

export default ChipSkill;
