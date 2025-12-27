import { FunctionComponent, ReactNode } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

const RowContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(4),
    padding: theme.spacing(1),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${theme.palette.grey[200]}`,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    width: '100%',
    height: '171px',

    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(3),
        padding: theme.spacing(2),
        width: '100%',
        height: 'auto',
    },
}));

const RowLeft = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    flex: 1,
    paddingTop: '18px',
    height: '100%',
    minHeight: 0,
    [theme.breakpoints.down('md')]: {
        flex: 'none',
        paddingTop: 0,
        height: 'auto',
    },
}));

const TitleSection = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    minHeight: 0,
}));

const RowRight = styled(Box)(() => ({
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',

    position: 'relative',
}));

interface FeatureRowProps {
    title: string;
    description: string;
    coinText?: string;
    right: ReactNode;
    onMoreClick?: () => void;
    /**
     * Optional fixed width for the right preview area (to match design precisely).
     * Use number for px, or any CSS width string (e.g. '320px').
     */
    rightWidth?: number | string;
}

const FeatureRow: FunctionComponent<FeatureRowProps> = ({
    title,
    description,
    coinText,
    right,
    onMoreClick,
    rightWidth,
}) => {
    return (
        <RowContainer>
            <RowLeft>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                    <TitleSection>
                        <MuiCheckbox
                            label={
                                <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                                    {title}
                                </Typography>
                            }
                        />
                        <Typography
                            variant='subtitle2'
                            color='text.secondary'
                            fontWeight='400'
                            ml={1}
                            mt={1}
                            sx={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {description}
                        </Typography>
                    </TitleSection>

                    <Box
                        ml={1}
                        mt={1}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            width: '100%',
                        }}
                    >
                        {coinText ? (
                            <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
                                {coinText}
                            </Typography>
                        ) : (
                            <Box />
                        )}

                        <MuiButton
                            text='More'
                            sx={{ backgroundColor: '#F0F0F2', color: 'secondary.main' }}
                            variant='contained'
                            color='secondary'
                            onClick={onMoreClick}
                        />
                    </Box>
                </Box>
            </RowLeft>

            <RowRight sx={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        width: rightWidth ?? 'auto',
                        maxWidth: '100%',
                    }}
                >
                    {right}
                </Box>
            </RowRight>
        </RowContainer>
    );
};

export default FeatureRow;
