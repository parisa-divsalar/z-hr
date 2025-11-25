import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Shared constants for the dashboard page
export const DASHBOARD_COLORS = {
  background: '#F7F7F7',
  cardBackground: '#FFFFFF',
  orangeTag: '#FFAB6F',
  blueAccent: '#4DA3FF',
  greenSuccess: '#2ECC71',
  lightText: '#A1A1A1',
  darkText: '#1C1C1C',
};

export const DashboardRoot = styled(Stack)(() => ({
  width: '100%',
  minHeight: '100vh',
  boxSizing: 'border-box',
  backgroundColor: DASHBOARD_COLORS.background,
  padding: 24,
  gap: 24,
}));

export const SectionHeader = styled(Stack)(() => ({
  direction: 'ltr',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
}));

export const SectionTitle = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: 600,
  color: DASHBOARD_COLORS.darkText,
}));

export const CardBase = styled(Box)(() => ({
  borderRadius: 18,
  backgroundColor: DASHBOARD_COLORS.cardBackground,
  boxShadow: '0 12px 30px #00000010',
  padding: 20,
  boxSizing: 'border-box',
}));

export const SmallCardBase = styled(CardBase)(() => ({
  borderRadius: 16,
  padding: 16,
}));

export const StatTitle = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 500,
  color: DASHBOARD_COLORS.lightText,
  marginBottom: 8,
}));

export const StatValueRow = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
}));

export const StatValue = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: 600,
  color: DASHBOARD_COLORS.darkText,
}));

export const OrangeBadge = styled(Box)(() => ({
  borderRadius: 999,
  padding: '4px 10px',
  backgroundColor: DASHBOARD_COLORS.orangeTag,
  color: '#FFFFFF',
  fontSize: 11,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const TagPill = styled(Box)(() => ({
  borderRadius: 999,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF2E5',
  color: '#B35A19',
}));

export const MetaText = styled(Typography)(() => ({
  fontSize: 12,
  color: DASHBOARD_COLORS.lightText,
}));

export const JobTitle = styled(Typography)(() => ({
  fontSize: 18,
  fontWeight: 600,
  color: DASHBOARD_COLORS.darkText,
  marginTop: 6,
  marginBottom: 8,
}));

export const BodyText = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: 1.5,
  color: DASHBOARD_COLORS.darkText,
}));

export const SubText = styled(Typography)(() => ({
  fontSize: 12,
  color: DASHBOARD_COLORS.lightText,
}));

export const GreenDot = styled(Box)(() => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: DASHBOARD_COLORS.greenSuccess,
}));

export const AvatarGlowWrapper = styled(Box)(() => ({
  position: 'relative',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const AvatarGlow = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  background: `radial-gradient(circle at center, ${DASHBOARD_COLORS.blueAccent}55, transparent 70%)`,
  opacity: 0.9,
}));

export const AvatarInnerWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
}));
