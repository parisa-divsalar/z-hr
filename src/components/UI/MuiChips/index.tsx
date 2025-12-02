import { FunctionComponent } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { ChipContainer } from '@/components/Card/Chip/styled';
import { TSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/type';

export interface MuiChipsProps {
  skill?: TSkill;
  label?: string;
  color?: string;
  onUpdateSkill?: (id: string, selected: boolean) => void;
  sx?: SxProps<Theme>;
}

const MuiChips: FunctionComponent<MuiChipsProps> = (props) => {
  const { skill, label: labelProp, color = 'text.primary', onUpdateSkill, sx } = props;
  const { id, label = '', selected = false } = skill || {};
  const chipLabel = labelProp ?? label;

  const handleSelect = () => {
    if (!onUpdateSkill || !id) return;
    if (!selected) onUpdateSkill(id, true);
  };

  const handleUnselect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!onUpdateSkill || !id) return;
    onUpdateSkill(id, false);
  };

  return (
    <ChipContainer
      direction='row'
      bgcolor={selected ? 'primary.light' : 'transparent'}
      border={selected ? `2px solid #4d49fc` : '1px solid #07656814'}
      onClick={handleSelect}
      sx={sx}
    >
      {selected && onUpdateSkill && (
        <IconButton sx={{ padding: '0' }} onClick={handleUnselect}>
          <CloseRoundedIcon color='primary' />
        </IconButton>
      )}
      <Typography variant='subtitle2' color={color} fontWeight={400} noWrap>
        {chipLabel}
      </Typography>
    </ChipContainer>
  );
};

export default MuiChips;
