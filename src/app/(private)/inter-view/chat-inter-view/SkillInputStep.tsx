import { useState, ChangeEvent } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox, ChatInputContainer, ChatInputContent } from './styled';

interface SkillInputStepProps {
    onBack?: () => void;
    onNext?: (answer: string) => void;
}

const SkillInputStep = ({ onBack, onNext }: SkillInputStepProps) => {
    const [answer, setAnswer] = useState('');

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (!answer) return;
        onNext?.(answer);
    };

    return (
        <CenterGrayBox>
            <Typography variant='h5' color='text.primary' fontWeight='584'>
                1{' '}
            </Typography>
            <Typography variant='h5' color='text.primary' mt={1} mb={5} fontWeight='584'>
                Tell me about yourself and your experience?
            </Typography>

            <ChatInputContainer direction='row' active={answer !== ''}>
                <ChatInputContent placeholder='Type your answer...' value={answer} onChange={handleChange} />
            </ChatInputContainer>

            <Stack mt={10} mb={5} direction='row' spacing={4}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
                    onClick={onBack}
                >
                    Back
                </MuiButton>

                <MuiButton
                    color='secondary'
                    endIcon={<ArrowRightIcon />}
                    onClick={handleSubmit}
                    disabled={answer === ''}
                >
                    Next
                </MuiButton>
            </Stack>
        </CenterGrayBox>
    );
};

export default SkillInputStep;
