'use client';

import { Typography } from '@mui/material';

import BoxIcon from '@/assets/images/dashboard/boxIcon.svg';
import ArrowForwardIcon from '@/assets/images/dashboard/IconTp.svg';
import RectangleImage from '@/assets/images/dashboard/imag/rectangle2.svg';
import MuiButton from '@/components/UI/MuiButton';

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
}

const SkillGapCard = ({
  title = 'Front-end',
  level = 'Mid-senior',
  price = '$20',
  isFree = true,
  image,
}: SkillGapCardProps) => {
  return (
    <CardWrapper>
      <CardImageWrapper>
        {image ? <CardImage src={image} alt={title} /> : <StyledRectangleImage as={RectangleImage} />}
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
            endIcon={
              <StyledArrowIcon>
                <ArrowForwardIcon />
              </StyledArrowIcon>
            }
          />
        </CardFooter>
      </CardContent>
    </CardWrapper>
  );
};

export default SkillGapCard;
