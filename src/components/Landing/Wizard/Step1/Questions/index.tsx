import React, { FunctionComponent, useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MicIcon from '@/assets/images/icons/download1.svg';
import ImageIcon from '@/assets/images/icons/download2.svg';
import VideoIcon from '@/assets/images/icons/download3.svg';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import { apiClientClient } from '@/services/api-client';
import { buildWizardZipBlob, useWizardStore } from '@/store/wizard';

import {
    TopSection,
    MediaRow,
    MediaItem,
    MediaIconBox,
    MiddleSection,
    QuestionList,
    QuestionCard,
    QuestionBadge,
    QuestionTexts,
    BottomSection,
    Container,
} from './styled';

interface QuestionsProps {
    onNext: () => void;
    setAiStatus: (status: AIStatus) => void;
}

const Questions: FunctionComponent<QuestionsProps> = ({ onNext, setAiStatus }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data: wizardData } = useWizardStore();

    const mediaItems = [
        { id: 'voice', label: 'Voice (1)', Icon: MicIcon },
        { id: 'photo', label: 'Photo (2)', Icon: ImageIcon },
        { id: 'video', label: 'Video (1)', Icon: VideoIcon },
    ];

    const questionNumbers = [1, 2, 3, 4, 5];

    const handleSubmit = async () => {
        setIsSubmitting(true);

        console.log('wizardData', wizardData);

        const zipBlob = await buildWizardZipBlob(wizardData, {
            rootFolderName: wizardData.fullName || 'nv',
            zipFileName: 'info.zip',
        });

        const zipFile = new File([zipBlob], 'info.zip');

        const formData = new FormData();
        formData.append('inputFile', zipFile);

        try {
            const res = await apiClientClient.post('send-file', formData);
            console.log('res wizrd uploadd', res);
            onNext();
        } catch (error) {
            console.log('rerr wizrd uploadd', error);

            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <MiddleSection>
                <TopSection>
                    <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center'>
                        File uploaded
                    </Typography>

                    <MediaRow>
                        {mediaItems.map(({ id, label, Icon }) => (
                            <MediaItem key={id}>
                                <MediaIconBox>
                                    <Icon />
                                </MediaIconBox>

                                <Stack direction='row' spacing={1.25} alignItems='center'>
                                    <Typography variant='body2' fontWeight={600} color='text.primary'>
                                        {label}
                                    </Typography>
                                    <Typography variant='caption' fontWeight={600} color='success.light'>
                                        Done
                                    </Typography>
                                </Stack>
                            </MediaItem>
                        ))}
                    </MediaRow>
                </TopSection>
                <Typography variant='h6' fontWeight={400} color='text.primary' textAlign='center' mt={3}>
                    Questions
                </Typography>
                <QuestionList>
                    {questionNumbers.map((num, index) => (
                        <React.Fragment key={num}>
                            <QuestionCard>
                                <QuestionTexts>
                                    <Stack direction='row' alignItems='center'>
                                        <QuestionBadge>{num}</QuestionBadge>

                                        <Typography variant='subtitle2' fontWeight={400} color='text.primary' ml={2}>
                                            Questions
                                        </Typography>
                                    </Stack>
                                    <Stack direction='row' gap={1} mt={1}>
                                        <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
                                            Answer
                                        </Typography>
                                        <Typography variant='subtitle2' fontWeight={400} color='text.primary'>
                                            Access common position-specific interview questions to prepare effectively
                                            interview questions to prepare .
                                        </Typography>
                                    </Stack>
                                </QuestionTexts>
                            </QuestionCard>

                            {index !== questionNumbers.length - 1 && (
                                <Divider
                                    sx={{
                                        borderColor: 'grey.100',
                                        width: '100%',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </QuestionList>
            </MiddleSection>

            <BottomSection>
                <Stack direction='row' gap={5} justifyContent='center' m={4}>
                    <MuiButton
                        color='secondary'
                        variant='outlined'
                        size='large'
                        startIcon={<AddIcon />}
                        onClick={() => setAiStatus('START')}
                    >
                        Add more
                    </MuiButton>

                    <MuiButton
                        color='secondary'
                        size='large'
                        onClick={handleSubmit}
                        endIcon={<ArrowRightIcon />}
                        loading={isSubmitting}
                    >
                        Submit
                    </MuiButton>
                </Stack>
            </BottomSection>
        </Container>
    );
};

export default Questions;
