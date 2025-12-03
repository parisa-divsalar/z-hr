'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import MuiInput from '@/components/UI/MuiInput';

const AllInput = () => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Input
      </Typography>

      <Stack direction='row' gap={2} alignItems='end' mb={2}>
        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='large'
          helperText='Hint'
          startIcon={<AddIcon width={20} height={20} color='#66666E' />}
          endIcon={<AddIcon width={20} height={20} color='#66666E' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='medium'
          helperText='Hint'
          startIcon={<AddIcon width={16} height={16} color='#66666E' />}
          endIcon={<AddIcon width={16} height={16} color='#66666E' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          size='small'
          helperText='Hint'
          placeholder='Text field'
          startIcon={<AddIcon width={14} height={14} color='#66666E' />}
          endIcon={<AddIcon width={14} height={14} color='#66666E' />}
        />
      </Stack>

      <Stack direction='row' gap={2} alignItems='end' mb={2}>
        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='large'
          helperText='Hint'
          error
          startIcon={<AddIcon width={20} height={20} color='#EC2C27' />}
          endIcon={<AddIcon width={20} height={20} color='#EC2C27' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='medium'
          helperText='Hint'
          error
          startIcon={<AddIcon width={16} height={16} color='#EC2C27' />}
          endIcon={<AddIcon width={16} height={16} color='#EC2C27' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          size='small'
          error
          helperText='Hint'
          placeholder='Text field'
          startIcon={<AddIcon width={14} height={14} color='#EC2C27' />}
          endIcon={<AddIcon width={14} height={14} color='#EC2C27' />}
        />
      </Stack>

      <Stack direction='row' gap={2} alignItems='end' mb={2}>
        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='large'
          helperText='Hint'
          disabled
          startIcon={<AddIcon width={20} height={20} color='#D8D8DA' />}
          endIcon={<AddIcon width={20} height={20} color='#D8D8DA' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          placeholder='Text field'
          size='medium'
          helperText='Hint'
          disabled
          startIcon={<AddIcon width={16} height={16} color='#D8D8DA' />}
          endIcon={<AddIcon width={16} height={16} color='#D8D8DA' />}
        />

        <MuiInput
          value={inputValue}
          onChange={setInputValue}
          label='Label'
          size='small'
          disabled
          helperText='Hint'
          placeholder='Text field'
          startIcon={<AddIcon width={14} height={14} color='#D8D8DA' />}
          endIcon={<AddIcon width={14} height={14} color='#D8D8DA' />}
        />
      </Stack>
    </>
  );
};

export default AllInput;
