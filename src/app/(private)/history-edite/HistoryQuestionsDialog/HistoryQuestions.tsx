import React, { useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import RectangleIcon from '@/assets/images/dashboard/imag/rectangle.svg?url';
import { SectionHeader } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

import QuestionCard from '../Components/QuestionCard';
import { HorizontalItem, HorizontalScrollContainer, QuestionList, QuestionsRoot } from '../styled';
import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';

interface ConfirmationDialogProps {
  open: boolean;
  closeDialog: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, closeDialog, onConfirm }) => {
  return (
    <DialogContainer onClose={closeDialog} open={open} maxWidth='xs'>
      <StackContainer>
        <HeaderContainer direction='row'>
          <Typography color='text.primary' variant='subtitle1' fontWeight={500}>
            Edit Resume
          </Typography>
          <IconButton onClick={closeDialog}>
            <CloseRoundedIcon />
          </IconButton>
        </HeaderContainer>

        <StackContent>
          <Typography color='text.primary' variant='subtitle2' fontWeight='400'>
            Are you sure you want to edit that resume?{' '}
          </Typography>
        </StackContent>

        <Divider />

        <ActionContainer direction='row'>
          <MuiButton fullWidth color='secondary' variant='outlined' onClick={closeDialog}>
            No
          </MuiButton>
          <MuiButton fullWidth color='secondary' onClick={onConfirm}>
            Yes
          </MuiButton>
        </ActionContainer>
      </StackContainer>
    </DialogContainer>
  );
};

const HistoryQuestions = () => {
  const router = useRouter();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const questionNumbers = [1, 2, 3, 4, 5];

  const handleEditClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirm = () => {
    setOpenConfirmDialog(false);
    router.push('/?step=1');
  };

  const mockItems = [
    {
      id: 1,
      image: RectangleIcon,
      title: ' Image',
    },
    {
      id: 2,
      image: RectangleIcon,
      title: 'Video',
    },
    {
      id: 3,
      image: RectangleIcon,
      title: 'Item 3',
    },
  ];

  return (
    <QuestionsRoot>
      <SectionHeader>
        <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
          Asset
        </Typography>
        <MuiButton text='Edit' color='secondary' variant='outlined' onClick={handleEditClick} />
      </SectionHeader>
      <Typography variant='subtitle1' fontWeight='500' color='text.primary' mb={2}>
        Our questions
      </Typography>
      <QuestionList>
        {questionNumbers.map((num) => (
          <QuestionCard
            key={num}
            number={num}
            question='Question'
            answer='This is a sample answer provided for the interview question. You can edit and add your own text here.'
          />
        ))}
      </QuestionList>
      <Typography variant='subtitle1' color='text.primary' fontWeight='500' mt={3}>
        Other
      </Typography>
      <HorizontalScrollContainer direction='row' gap={3} mt={3}>
        {mockItems.map((item) => (
          <HorizontalItem key={item.id}>
            <Image src={item.image} alt={item.title} width={85} height={85} style={{ margin: '0 auto' }} />
            <Typography variant='subtitle2' fontWeight={400} color='text.primary' pt={1}>
              {item.title}
            </Typography>
          </HorizontalItem>
        ))}
      </HorizontalScrollContainer>

      <ConfirmationDialog
        open={openConfirmDialog}
        closeDialog={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirm}
      />
    </QuestionsRoot>
  );
};

export default HistoryQuestions;
