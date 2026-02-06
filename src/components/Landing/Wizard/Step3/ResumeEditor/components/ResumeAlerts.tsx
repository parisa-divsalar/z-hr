import { Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';

type Props = {
    isCvLoading: boolean;
    cvError: string | null;
    saveError: string | null;
    improveError: string | null;
    downloadError: string | null;
    onDismissSaveError: () => void;
    onDismissImproveError: () => void;
    onDismissDownloadError: () => void;
};

export default function ResumeAlerts({
    isCvLoading,
    cvError,
    saveError,
    improveError,
    downloadError,
    onDismissSaveError,
    onDismissImproveError,
    onDismissDownloadError,
}: Props) {
    return (
        <>
            {isCvLoading && (
                <Typography variant='caption' color='text.secondary' mt={1}>
                    Still fetching the latest CV preview…
                </Typography>
            )}
            {cvError && (
                <Typography variant='caption' color='error' mt={1}>
                    {cvError}
                </Typography>
            )}
            {saveError && <MuiAlert severity='error' message={saveError} onDismiss={onDismissSaveError} />}
            {improveError && <MuiAlert severity='error' message={improveError} onDismiss={onDismissImproveError} />}
            {downloadError && <MuiAlert severity='error' message={downloadError} onDismiss={onDismissDownloadError} />}
        </>
    );
}






























