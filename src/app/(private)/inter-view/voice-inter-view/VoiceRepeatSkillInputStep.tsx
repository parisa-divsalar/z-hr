import { ChangeEvent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { CircleContainer } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox, VoiceInputContainer, VoiceInputContent } from './styled';

interface VoiceRepeatSkillInputStepProps {
    initialAnswer?: string;
    onBack?: () => void;
    onNext?: (answer: string, voice?: { blob: Blob; duration: number }) => void;
}

const VoiceRepeatSkillInputStep = ({ initialAnswer = '', onBack, onNext }: VoiceRepeatSkillInputStepProps) => {
    const [answer, setAnswer] = useState(initialAnswer);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (!answer) return;
        onNext?.(answer);
    };

    return (
        <CenterGrayBox>
            <Typography variant='h5' color='text.primary' fontWeight='500'>
                You can rewrite your answer if you want
            </Typography>

            <VoiceInputContainer direction='row' active={answer !== ''}>
                <VoiceInputContent placeholder='Type your answer...' value={answer} onChange={handleChange} />

                {answer !== '' ? (
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
            </VoiceInputContainer>

            <Stack mt={10} mb={5} direction='row' spacing={4}>
                <MuiButton color='secondary' variant='outlined' startIcon={<ArrowBackIcon />} onClick={onBack}>
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

export default VoiceRepeatSkillInputStep;
