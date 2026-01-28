import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ThinkingIcon from '@/assets/images/icons/thinking.svg';
import MuiButton from '@/components/UI/MuiButton';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';
import { buildWizardZipBlob, useWizardStore } from '@/store/wizard';
import { saveWizardTextOnlySession } from '@/utils/wizardTextOnlySession';

interface ThinkingProps {
    onCancel: () => void;
    setActiveStep: (activeStep: number) => void;
}

const SEND_FILE_TIMEOUT_MS = 7 * 60 * 1000; // 7 minutes

const Thinking: FunctionComponent<ThinkingProps> = ({ onCancel, setActiveStep }) => {
    const { data: wizardData } = useWizardStore();
    const setRequestId = useWizardStore((state) => state.setRequestId);
    const accessToken = useAuthStore((state) => state.accessToken);

    const hasSubmitted = useRef(false);

    const [isSubmitting, setIsSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [subRequests] = useState<Array<Record<string, unknown>>>([]);

    const stopPolling = () => {
        // Polling is handled in Step3 (ResumeEditor) via pollCvAnalysisAndCreateCv.
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

            /**
             * Persist a **serializable** version of the wizard payload into sessionStorage.
             * This enables Step3 (ResumeEditor) to seed sections immediately (same as text-only flow),
             * even when we have files/voices and will also fetch CV from the backend.
             */
            saveWizardTextOnlySession(bodyOfResume as any);

            const cvDataJson = JSON.stringify(bodyOfResume);
            const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const res = await apiClientClient.post('cv/analyze', {
                cvText: cvDataJson,
                userId: accessToken ?? undefined,
                requestId: requestId,
            }, {
                timeout: SEND_FILE_TIMEOUT_MS,
            });
            
            const finalRequestId: string = res.data.requestId || requestId;
            setRequestId(finalRequestId);

            setActiveStep(3);
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

            console.error('cv/analyze failed:', errorObj?.response?.status, errorObj?.response?.data, errorObj);
        }
    };

    useEffect(() => {
        if (!hasSubmitted.current) {
            const hasAnyFilesOrVoices = (wizardData.allFiles?.length ?? 0) > 0;

            if (!hasAnyFilesOrVoices) {
                saveWizardTextOnlySession(wizardData);
                const existingRequestId = useWizardStore.getState().requestId;
                if (!existingRequestId) setRequestId(null);
                setActiveStep(3);
                hasSubmitted.current = true;
                return stopPolling;
            }

            handleSubmit();
            hasSubmitted.current = true;
            return stopPolling;
        }
    }, []);

    const subRequestFileNames = subRequests
        .map((sr) => {
            const name = (sr as any)?.file_name ?? (sr as any)?.fileName ?? (sr as any)?.filename ?? (sr as any)?.name;
            return typeof name === 'string' ? name.trim() : '';
        })
        .filter(Boolean);

    const normalizeStatus = (value: unknown) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return value.trim().toLowerCase();
        return null;
    };

    const getSubRequestStatus = (sr: Record<string, unknown>) =>
        (sr as any)?.sub_request_status ?? (sr as any)?.request_status ?? (sr as any)?.status;

    const isDoneStatus = (s: unknown) => {
        const v = normalizeStatus(s);
        return v === 2 || v === 3 || v === 'done' || v === 'completed' || v === 'success' || v === 'succeeded';
    };

    const currentSubRequest = subRequests.find((sr) => !isDoneStatus(getSubRequestStatus(sr)));
    const currentFileName = currentSubRequest
        ? (() => {
              const name =
                  (currentSubRequest as any)?.file_name ??
                  (currentSubRequest as any)?.fileName ??
                  (currentSubRequest as any)?.filename ??
                  (currentSubRequest as any)?.name;
              return typeof name === 'string' ? name.trim() : '';
          })()
        : '';

    return isSubmitting ? (
        <Stack
            alignItems='center'
            justifyContent='center'
            sx={{
                width: '100%',
                px: { xs: 3, sm: 0 },
                py: { xs: 3, sm: 0 },
                textAlign: 'center',
            }}
        >
            <ThinkingIcon />

            <Typography variant='h6' mt={4}>
                Thinking...
            </Typography>

            <Typography variant='h5' fontWeight='600'>
                {subRequestFileNames.length
                    ? `Updating & analyzing “${currentFileName || subRequestFileNames[0]}” via the resume analysis service...`
                    : 'Updating & analyzing your information via the resume analysis service...'}
            </Typography>

            <br />

            <Typography variant='h5' fontWeight='600' color='error'>
                It might take a few minutes!
            </Typography>

            <Stack
                mt={10}
                sx={{
                    width: { xs: '100%', sm: '10rem' },
                    maxWidth: 260,
                }}
            >
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
