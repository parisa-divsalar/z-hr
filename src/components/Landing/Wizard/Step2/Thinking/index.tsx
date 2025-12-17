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
    const setRequestId = useWizardStore((state) => state.setRequestId);
    const accessToken = useAuthStore((state) => state.accessToken);

    const hasSubmitted = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

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

            if (status === 2 || status === 3) {
                await addCV(requestId, bodyOfResume);
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
            /**
             * Send both:
             * - `inputFile` zip (actual file/voice bytes, named by id inside the zip)
             * - `cvData` JSON (metadata / references by id)
             *
             * Backend contract varies between environments; sending both covers both cases.
             */
            const { zipBlob, serializable: bodyOfResume } = await buildWizardZipBlob(wizardData);

            const formData = new FormData();
            const zipFile = new File([zipBlob], 'info.zip', { type: 'application/zip' });
            // common backend field names
            formData.append('inputFile', zipFile);
            formData.append('file', zipFile);

            const cvDataJson = JSON.stringify(bodyOfResume);
            formData.append('cvData', cvDataJson);
            formData.append('bodyOfResume', cvDataJson);

            const res = await apiClientClient.post('Apps/SendFile', formData);
            const requestId: string = res.data.result as string;
            setRequestId(requestId);

            await pollStatus(requestId, bodyOfResume);
        } catch (err) {
            setIsSubmitting(false);
            const errorObj = err as any;
            const messageRaw =
                errorObj?.response?.data?.error ||
                errorObj?.response?.data?.message ||
                errorObj?.message ||
                'ERROR to send file';

            const message =
                typeof messageRaw === 'string'
                    ? messageRaw
                    : (() => {
                          try {
                              return JSON.stringify(messageRaw);
                          } catch {
                              return String(messageRaw);
                          }
                      })();

            setSubmitError(message);
            // Helps diagnose 400s from the API server
            // eslint-disable-next-line no-console
            console.error('Apps/SendFile failed:', errorObj?.response?.status, errorObj?.response?.data, errorObj);
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
        <div>{submitError || 'ERROR to send file'}</div>
    );
};

export default Thinking;
