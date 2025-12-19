import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FilesStack as BaseFilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton as BaseRemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import MuiButton from '@/components/UI/MuiButton';

export const MainContainer = styled(Stack)(() => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    height: '100%',
    padding: '1rem',
    boxSizing: 'border-box',
    // If the wizard step is rendered inside a fixed-height container (dialog/sheet),
    // scroll within the step instead of scrolling the whole page.
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
}));

export const SkillContainer = styled(Stack)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    // Prevent the whole page from growing when many skills exist; scroll inside this box instead.
    width: '350px',
    maxWidth: '100%',
    maxHeight: '35vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    // Keep layout stable when the scrollbar appears (supported in modern browsers).
    scrollbarGutter: 'stable',
}));

export const ContainerSkill = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    backgroundColor: 'white',
    width: '350px',
    borderRadius: '1rem',
    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.grey[100]}`,
    padding: '0 16px',
    maxWidth: '588px',
    height: 'auto',
    minHeight: '52px',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: '0.25rem',
    // Keep the auto-growing textarea visually contained within rounded corners.
    overflow: 'hidden',
}));
export const ContainerSkillAttach = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
    backgroundColor: 'white',
    width: '350px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    padding: '1px 15px',
    maxWidth: '350px',
    height: 'auto',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
}));
export const ContainerSkillAttachItem = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(() => ({
    backgroundColor: 'white',
    width: '550px',
    maxWidth: '550px',
    paddingTop: '5px',
    height: 'auto',
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
}));

export const ContainerSkillAttachVoice = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
    backgroundColor: 'white',
    width: '350px',
    maxWidth: '350px',
    height: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2),
}));

export const VoiceItem = styled(Stack)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    padding: '1px 8px',
    display: 'flex',
}));

export const ActionRow = styled(Stack)(() => ({
    width: '100%',
    maxWidth: '350px',
    marginTop: '1.25rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

export const ActionIconButton = styled(IconButton)(() => ({
    padding: '0.25rem',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'transparent',
    },
    '&:focus-visible': {
        backgroundColor: 'transparent',
    },
}));

export const SummaryTextContainer = styled(Stack)(() => ({
    width: '498px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const ActionButtonsGroup = styled(Stack)(() => ({
    flexShrink: 0,
}));

interface RecordActionIconButtonProps {
    dimmed?: boolean;
}

export const RecordActionIconButton = styled(ActionIconButton, {
    shouldForwardProp: (prop) => prop !== 'dimmed',
})<RecordActionIconButtonProps>(({ dimmed }) => ({
    opacity: dimmed ? 0.4 : 1,
    cursor: dimmed ? 'not-allowed' : 'pointer',
}));

export const ToastContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: '350px',
    marginTop: theme.spacing(2),
}));

export const WrapRow = styled(Stack)(() => ({
    flexWrap: 'wrap',
}));

export const ContainerSkillAttachTop = styled(ContainerSkillAttach)(({ theme }) => ({
    marginTop: theme.spacing(2),
    alignItems: 'flex-start',
}));

export const FullWidthFilesStack = styled(BaseFilesStack)(() => ({
    width: '100%',
}));

export const TransparentRemoveFileButton = styled(BaseRemoveFileButton)(() => ({
    width: 24,
    height: 24,
    padding: 0,
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: 'transparent',
    },
}));

export const EntriesDivider = styled(Divider)(({ theme }) => ({
    width: '550px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderColor: theme.palette.grey[100],
}));

export const EntriesListContainer = styled(Stack)(() => ({
    maxWidth: '550px',
    width: '550px',
}));

export const EntryItemContainer = styled(ContainerSkillAttachItem)(() => ({
    alignItems: 'stretch',
    justifyContent: 'space-between',
}));

export const EntryBodyRow = styled(Stack)(() => ({
    flex: 1,
    alignItems: 'flex-start',
}));

export const EntryBodyStack = styled(Stack)(() => ({
    flex: 1,
}));

export const EntryText = styled(Typography)(() => ({
    maxWidth: 392,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
}));

export const EntryFilesStack = styled(BaseFilesStack)(() => ({
    width: '100%',
    border: 'none',
}));

export const EntryActionsGroup = styled(Stack)(() => ({
    flexShrink: 0,
}));

export const AddEntryButton = styled(MuiButton)(() => ({
    flexShrink: 0,
}));

export const BackgroundEntryIndex = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    width: '38px',
    alignSelf: 'stretch',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
}));
