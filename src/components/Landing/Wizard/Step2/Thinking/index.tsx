import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ThinkingIcon from '@/assets/images/icons/thinking.svg';
import MuiButton from '@/components/UI/MuiButton';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';
import { buildWizardZipBlob, useWizardStore } from '@/store/wizard';

interface ThinkingProps {
    onCancel: () => void;
    setActiveStep: (activeStep: number) => void;
}

const POLL_INTERVAL = 3000;

const Thinking: FunctionComponent<ThinkingProps> = ({ onCancel, setActiveStep }) => {
    const { data: wizardData } = useWizardStore();
    const accessToken = useAuthStore((state) => state.accessToken);

    const hasSubmitted = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(true);

    let pollTimer: NodeJS.Timeout | null = null;

    const stopPolling = () => {
        if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
        }
    };

    const addCV = async (requestId: string, bodyOfResume: any) => {
        try {
            const res = await apiClientClient.post('cv/add-cv', {
                userId: accessToken,
                requestId,
                bodyOfResume,
            });
            console.log('res 349587398573', res);

            if (res.status === 200) {
                try {
                    await apiClientClient.get('cv/get-cv', {
                        params: {
                            requestId,
                            userId: accessToken,
                        },
                    });
                } catch (getErr) {
                    console.log('get cv error', getErr);
                }
            }

            setActiveStep(3);
        } catch (err) {
            setIsSubmitting(false);
            console.log('err 3-507349', err);
        }
    };

    const pollStatus = async (requestId: string, bodyOfResume: any) => {
        try {
            const res = await apiClientClient.get(`cv/cv-analysis-detailed?requestId=${requestId}`);
            const status = res.data.main_request_status;
            console.log('status', status);

            if (status === 2) {
                await addCV(requestId, bodyOfResume);
                return;
            }

            if (status === 3) {
                setIsSubmitting(false);
                return;
            }

            pollTimer = setTimeout(() => pollStatus(requestId, bodyOfResume), POLL_INTERVAL);
        } catch (err) {
            console.log('poll error', err);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const { zipBlob, serializable: bodyOfResume } = await buildWizardZipBlob(wizardData);

            const formData = new FormData();
            formData.append('inputFile', new File([zipBlob], 'info.zip'));

            const res = await apiClientClient.post('Apps/SendFile', formData);
            const requestId: string = res.data.result as string;

            await pollStatus(requestId, bodyOfResume);
        } catch (err) {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!hasSubmitted.current) {
            handleSubmit();
            hasSubmitted.current = true;
            return stopPolling;
        }
    }, []);

    return isSubmitting ? (
        <Stack alignItems='center' justifyContent='center' height='100%'>
            <ThinkingIcon />

            <Typography variant='h6' mt={4}>
                Thinking...
            </Typography>

            <Typography variant='h5' fontWeight='600'>
                A thought-provoking statement about contemplation.
            </Typography>

            <br />

            <Typography variant='h5' fontWeight='600' color='error'>
                It might take a few minutes!
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
