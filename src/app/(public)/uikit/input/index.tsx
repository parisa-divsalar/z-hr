'use client';
import { useState } from 'react';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Typography } from '@mui/material';

import MuiInput from '@/components/UI/MuiInput';

const AllInput = () => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Different input states:
      </Typography>

      <MuiInput
        value={inputValue}
        onChange={setInputValue}
        label='Title'
        startIcon={<AccessTimeRoundedIcon fontSize='small' />}
      />

      <MuiInput
        value={inputValue}
        onChange={setInputValue}
        label='Title'
        endIcon={<AccessTimeRoundedIcon fontSize='small' />}
      />

      <MuiInput value={inputValue} disabled onChange={setInputValue} label='Title' />

      <MuiInput value={inputValue} error helperText='Required' onChange={setInputValue} label='Title' />
    </>
  );
};

export default AllInput;
