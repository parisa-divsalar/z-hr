'use client';
import { useState } from 'react';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Typography } from '@mui/material';

import TomanIcon from '@/assets/images/design/add-box.svg';
import WalletIcon from '@/assets/images/icons/wallet.svg';
import MuiInput from '@/components/UI/MuiInput';

const AllInput = () => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Input:
      </Typography>

      <MuiInput
        value={inputValue}
        onChange={setInputValue}
        label='label'
        placeholder='placeholder'
        inputMode='decimal'
        startIcon={<WalletIcon />}
        endIcon={<TomanIcon />}
      />

      <MuiInput
        value={inputValue}
        onChange={setInputValue}
        label='label'
        startIcon={<AccessTimeRoundedIcon fontSize='small' />}
      />

      <MuiInput
        value={inputValue}
        onChange={setInputValue}
        label='label'
        endIcon={<AccessTimeRoundedIcon fontSize='small' />}
      />

      <MuiInput value={inputValue} disabled onChange={setInputValue} label='label' />

      <MuiInput value={inputValue} error helperText='helperText' onChange={setInputValue} label='label' />
    </>
  );
};

export default AllInput;
