import { FunctionComponent, useState } from 'react';

import { IconButton, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';

import { CircleContainer, InputContainer, InputContent, MainContainer } from './styled';

interface StepInputBoxProps {
  onSubmit?: (text: string) => void;
}

const StepInputBox: FunctionComponent<StepInputBoxProps> = (props) => {
  const { onSubmit } = props;

  const [search, setSearch] = useState('');

  const handleSubmit = () => {
    if (search.trim() && onSubmit) {
      onSubmit(search.trim());
    }
  };

  return (
    <MainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={12}>
        What is your main skill?
      </Typography>
      <InputContainer direction='row' sx={{ borderColor: search === '' ? 'grey.100' : 'primary.main' }}>
        <IconButton>
          <AddIcon />
        </IconButton>

        <InputContent
          placeholder='Type your prompt for step 1...'
          value={search}
          onChange={(event: any) => setSearch(event.target.value)}
        />

        {search !== '' ? (
          <IconButton onClick={handleSubmit}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </InputContainer>
    </MainContainer>
  );
};

export default StepInputBox;
