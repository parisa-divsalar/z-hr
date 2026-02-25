import { FunctionComponent, ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';

import {
    DescriptionText,
    FooterRow,
    LeftContent,
    MoreButton,
    RightPreview,
    RowContainer,
    RowLeft,
    RowRight,
    TitleSection,
} from './FeatureRow.styled';

interface FeatureRowProps {
    title: string;
    description: string;
    coinText?: string;
    /** Translated label for the "More" button (e.g. "More" / "بیشتر") */
    moreLabel?: string;
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
    moreLabel = 'More',
    right,
    onMoreClick,
    rightWidth,
}) => {
    return (
        <RowContainer>
            <RowLeft>
                <LeftContent>
                    <TitleSection>
                        <MuiCheckbox
                            label={
                                <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                                    {title}
                                </Typography>
                            }
                        />
                        <DescriptionText
                            variant='subtitle2'
                            color='text.primary'
                            fontWeight='400'
                        >
                            {description}
                        </DescriptionText>
                    </TitleSection>

                    <FooterRow>
                        {coinText ? (
                            <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
                                {coinText}
                            </Typography>
                        ) : (
                            <Box />
                        )}

                        <MoreButton
                            text={moreLabel}
                            variant='contained'
                            color='secondary'
                            onClick={onMoreClick}
                        />
                    </FooterRow>
                </LeftContent>
            </RowLeft>

            <RowRight>
                <RightPreview rightWidth={rightWidth}>
                    {right}
                </RightPreview>
            </RowRight>
        </RowContainer>
    );
};

export default FeatureRow;
