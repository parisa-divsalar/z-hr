'use client';
import { useState } from 'react';

import { IconButton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import { EnterIcon, SearchIcon } from '@/components/Icons';
import { PublicRoutes } from '@/config/routes';

import {
  GlassContainer,
  InputContainer,
} from '../styled';
import VoiceRecording from '../voice/voice';


const PromptBox = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  return (
    <GlassContainer mt={6}>
      <Stack className='contentChatBox'>
        <Stack className='chatBoxContainer'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <IconButton onClick={() => router.push(PublicRoutes.landing)}>
              <SearchIcon />
            </IconButton>

            <InputContainer
              className='InputContainer'
              placeholder='Type your prompt...'
              value={search}
              onChange={(event: any) => setSearch(event.target.value)}
            />

            <VoiceRecording />

            <IconButton onClick={() => router.push(PublicRoutes.landing)}>
              <EnterIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </GlassContainer>
  );
};

export default PromptBox;
