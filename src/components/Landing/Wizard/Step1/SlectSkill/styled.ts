import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FilesStack as BaseFilesStack } from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';
import { RemoveFileButton as BaseRemoveFileButton } from '@/components/Landing/Wizard/Step1/AI/Text/styled';
import MuiButton from '@/components/UI/MuiButton';

const FIELD_MAX_WIDTH = 588;
const ATTACHMENT_MAX_WIDTH = 650;

export const MainContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

export const SkillContainer = styled(Stack)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: theme.spacing(2),
    marginInline: 'auto',
    flexWrap: 'wrap',
    // Prevent the whole page from growing when many skills exist; scroll inside this box instead.
    width: '100%',
    maxWidth: FIELD_MAX_WIDTH,
    maxHeight: '35vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    // Keep layout stable when the scrollbar appears (supported in modern browsers).
    scrollbarGutter: 'stable',
    [theme.breakpoints.down('sm')]: {
        maxHeight: '40vh',
    },
}));

export const ContainerSkill = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    backgroundColor: 'white',
    width: '100%',
    maxWidth: FIELD_MAX_WIDTH,
    borderRadius: '1rem',
    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.grey[100]}`,
    padding: theme.spacing(0, 2),
    height: 'auto',
    minHeight: '52px',
    marginTop: theme.spacing(2),
    marginInline: 'auto',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: '0.25rem',
    // Keep the auto-growing textarea visually contained within rounded corners.
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 1.5),
    },
}));
export const ContainerSkillAttach = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
    backgroundColor: 'white',
    width: '100%',
    maxWidth: ATTACHMENT_MAX_WIDTH,
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(0.5, 2),
    height: 'auto',
    marginTop: theme.spacing(1),
    marginInline: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
}));
export const ContainerSkillAttachItem = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(() => ({
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '550px',
    paddingTop: '5px',
    height: 'auto',
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
    boxSizing: 'border-box',
}));

export const ContainerSkillAttachVoice = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
    backgroundColor: 'white',
    width: '100%',
    maxWidth: ATTACHMENT_MAX_WIDTH,
    height: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2),
    marginInline: 'auto',
}));

export const VoiceItem = styled(Stack)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    padding: '1px 8px',
    display: 'flex',
}));

export const ActionRow = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: FIELD_MAX_WIDTH,
    marginTop: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
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

export const SummaryTextContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: '498px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(0, 1.5),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 1),
    },
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
    maxWidth: FIELD_MAX_WIDTH,
    marginTop: theme.spacing(2),
    marginInline: 'auto',
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
    width: '100%',
    maxWidth: '550px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderColor: theme.palette.grey[100],
}));

export const EntriesListContainer = styled(Stack)(() => ({
    width: '100%',
    maxWidth: '550px',
    gap: '0.75rem',
}));

export const EntryItemContainer = styled(ContainerSkillAttachItem)(() => ({
    alignItems: 'stretch',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
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

export const AddEntryButton = styled(MuiButton, {
    shouldForwardProp: (prop) => prop !== 'highlighted',
})<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
    flexShrink: 0,
    borderWidth: highlighted ? '1px' : undefined,
    borderColor: highlighted ? theme.palette.primary.main : undefined,
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
