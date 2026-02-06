'use client';

import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import { IconButton, Typography } from '@mui/material';

import BoxIcon from '@/assets/images/dashboard/boxIcon.svg';
import ArrowForwardIcon from '@/assets/images/dashboard/IconTp.svg';
import RectangleImage from '@/assets/images/dashboard/imag/rectangle2.svg';
import MuiButton from '@/components/UI/MuiButton';
import { usePlanGate } from '@/hooks/usePlanGate';

import {
  SkillGapCard as CardWrapper,
  CardImageWrapper,
  CardImage,
  CardContent,
  CardHeader,
  CardTitleSection,
  CardFooter,
  PriceSection,
  Price,
  FreeChip,
  StyledArrowIcon,
  StyledRectangleImage,
} from '../styled';

interface SkillGapCardProps {
  title?: string;
  level?: string;
  price?: string;
  isFree?: boolean;
  image?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (next: boolean) => void;
  onMoreClick?: () => void;
}

const SkillGapCard = ({
  title = 'Front-end',
  level = 'Mid-senior',
  price = '$20',
  isFree = true,
  image,
  isBookmarked = false,
  onToggleBookmark,
  onMoreClick,
}: SkillGapCardProps) => {
  const { guardAction, planDialog } = usePlanGate();

  const handleMoreClick = () => {
    if (isFree) {
      onMoreClick?.();
    } else {
      guardAction(() => onMoreClick?.(), 'skill_gap');
    }
  };

  return (
    <>
      {planDialog}
      <CardWrapper>
        <CardImageWrapper>
          {image ? <CardImage src={image} alt={title} /> : <StyledRectangleImage as={RectangleImage} />}
          {onToggleBookmark && (
            <IconButton
              size='small'
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(!isBookmarked);
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                bgcolor: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid rgba(0,0,0,0.06)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
              }}
            >
              {isBookmarked ? <BookmarkRoundedIcon fontSize='small' /> : <BookmarkBorderRoundedIcon fontSize='small' />}
            </IconButton>
          )}
        </CardImageWrapper>

        <CardContent>
          <CardHeader>
            <CardTitleSection>
              <Typography variant='h6' fontWeight='500' color='text.primary'>
                {title}
              </Typography>
              <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                {level}
              </Typography>
              <PriceSection>{isFree ? <FreeChip>Free</FreeChip> : <Price>{price}</Price>}</PriceSection>
            </CardTitleSection>
          </CardHeader>

          <CardFooter>
            <BoxIcon />
            <MuiButton
              text='More'
              variant='contained'
              size='small'
              color='secondary'
              onClick={handleMoreClick}
              endIcon={
                <StyledArrowIcon>
                  <ArrowForwardIcon />
                </StyledArrowIcon>
              }
            />
          </CardFooter>
        </CardContent>
      </CardWrapper>
    </>
  );
};

export default SkillGapCard;
