import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import MuiButton from '@/components/UI/MuiButton';

import { FooterContainer } from '../styled';

type Props = {
    isPreview: boolean;
    isDownloading: boolean;
    downloadProgress: number;
    cvError: string | null;
    onDownloadPdf: () => void;
    onSubmit: () => void;
};

export default function ResumeFooter({ isPreview, isDownloading, downloadProgress, cvError, onDownloadPdf, onSubmit }: Props) {
    if (isPreview) return null;

    return (
        <FooterContainer>
            <MuiButton
                color='secondary'
                size='large'
                variant='outlined'
                text={isDownloading ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%` : 'Download PDF'}
                loading={isDownloading}
                disabled={Boolean(cvError)}
                startIcon={<DownloadRoundedIcon />}
                type='button'
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDownloadPdf();
                }}
                sx={{
                    minWidth: 0,
                    flex: { xs: '1 1 220px', sm: '0 1 auto' },
                    width: { xs: '100%', sm: 'auto' },
                }}
            />

            <MuiButton
                color='secondary'
                size='large'
                variant='contained'
                text='Submit'
                onClick={onSubmit}
                sx={{
                    minWidth: 0,
                    flex: { xs: '1 1 220px', sm: '0 1 auto' },
                    width: { xs: '100%', sm: 'auto' },
                }}
            />
        </FooterContainer>
    );
}





