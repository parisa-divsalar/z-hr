import MuiButton from '@/components/UI/MuiButton';
import ThinkingIcon from '@/assets/images/icons/thinking.svg';
import { apiClientClient } from '@/services/api-client';
import { Stack, Typography } from '@mui/material';
import { buildWizardZipBlob, useWizardStore } from '@/store/wizard';
import { FunctionComponent, useEffect, useState } from 'react';

interface ThinkingProps {
    onCancel: () => void;
    setActiveStep: (activeStep: number) => void;
}

const Thinking: FunctionComponent<ThinkingProps> = (props) => {
    const { onCancel, setActiveStep } = props;

    const [isSubmitting, setIsSubmitting] = useState<boolean>(true);

    const { data: wizardData } = useWizardStore();

    const handleSubmit = async () => {
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
            console.log('res wizard upload', res);
            setActiveStep(3);
        } catch (error) {
            console.log('error wizard upload', error);

            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        handleSubmit();
    }, []);

    return isSubmitting ? (
        <Stack alignItems='center' justifyContent='center' height='100%'>
            <ThinkingIcon />

            <Typography color='text.primary' variant='h6' mt={4}>
                Thinking...
            </Typography>
            <Typography color='text.primary' variant='h5' fontWeight='600'>
                A thought-provoking statement about contemplation.
            </Typography>

            <Stack mt={10} width='10rem'>
                <MuiButton variant='outlined' fullWidth onClick={onCancel}>
                    Cancel
                </MuiButton>
            </Stack>
        </Stack>
    ) : (
        <div>ERROR to send file</div>
    );
};
export default Thinking;
