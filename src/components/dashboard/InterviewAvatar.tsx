import { AvatarGlow, AvatarGlowWrapper, AvatarInnerWrapper, DASHBOARD_COLORS } from '@/components/dashboard/styled';
import MuiAvatar from '@/components/UI/MuiAvatar';

const InterviewAvatar = () => {
  return (
    <AvatarGlowWrapper>
      <AvatarGlow />
      <AvatarInnerWrapper>
        <MuiAvatar size='large' color='primary' sx={{ border: `2px solid ${DASHBOARD_COLORS.cardBackground}` }}>
          AI
        </MuiAvatar>
      </AvatarInnerWrapper>
    </AvatarGlowWrapper>
  );
};
export default InterviewAvatar;
