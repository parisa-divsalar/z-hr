import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}));

interface InputContainerProps {
  highlight?: boolean;
  grow?: boolean;
  noMarginTop?: boolean;
}

const shouldForwardInputContainerProp = (prop: PropertyKey) =>
  !['highlight', 'grow', 'noMarginTop'].includes(prop.toString());

export const InputContainer = styled(Stack, {
  shouldForwardProp: shouldForwardInputContainerProp,
})<InputContainerProps>(({ theme, highlight, grow, noMarginTop }) => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid ${highlight ? theme.palette.primary.main : theme.palette.grey[100]}`,
  padding: '1rem',
  width: '100%',
  maxWidth: '426px',
  height: 'auto',
  marginTop: noMarginTop ? 0 : '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  gap: '0.25rem',
  flex: grow ? 1 : undefined,
}));

export const AutoGrowInputContainer = styled(InputContainer)(() => ({
  minHeight: '52px',
  padding: '0 16px',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
}));

const InputContentRoot = styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: '52px',
  height: '52px',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  fontSize: '1rem',
  lineHeight: '1.25',
  outline: 'none',
  fontWeight: '492',
  backgroundColor: 'transparent',
  // Vertically center single-line text inside the initial 52px height
  padding: 'calc((52px - 1.25em) / 2) 0',
  margin: 0,
  boxSizing: 'border-box',
  minWidth: 0,
  color: theme.palette.text.primary,
  resize: 'none',
  overflow: 'hidden',
  display: 'block',

  '&::placeholder': {
    color: theme.palette.grey[400],
    letterSpacing: '0',
  },
  '&:focus': {
    outline: 'none',
  },
}));

type InputContentProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const resizeTextarea = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  const minHeight = 52;
  el.style.height = '0px';
  el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
};

export const InputContent = forwardRef<HTMLTextAreaElement, InputContentProps>(function InputContent(
  { onChange, onInput, rows, value, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const setRef = useMemo(() => {
    return (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };
  }, [forwardedRef]);

  useEffect(() => {
    resizeTextarea(innerRef.current);
  }, [value]);

  return React.createElement(InputContentRoot, {
    ...rest,
    value,
    rows: rows ?? 1,
    ref: setRef,
    onInput: (e: React.FormEvent<HTMLTextAreaElement>) => {
      onInput?.(e);
      resizeTextarea(e.currentTarget);
    },
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      resizeTextarea(e.currentTarget);
    },
  });
});

const getListContainerStyles = (theme: Theme) => ({
  width: '100%',
  maxWidth: '588px',
  marginTop: '10px',
  marginBottom: '10px',
  gap: '0.75rem',
  borderTop: `1px solid ${theme.palette.grey[100]}`,
});

export const ContactListContainer = styled(Stack)(({ theme }) => getListContainerStyles(theme));

export const ContactRow = styled(Stack)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

export const ContactMethodText = styled(Typography)`
  flex: 1;
  word-break: break-word;
`;

export const ContactIconButton = styled(IconButton)`
  padding: 0.5px;
`;

export const AddSkillIconButton = styled(IconButton)(() => ({
  minWidth: 0,
}));

export const SkillListContainer = styled(Stack)(({ theme }) => getListContainerStyles(theme));

export const SkillRow = styled(Stack)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const SkillText = styled(Typography)`
  flex: 1;
  word-break: break-word;
`;

export const SkillIconButton = styled(IconButton)`
  padding: 0.5px;
`;

export const BottomActionsStack = styled(Stack)(() => ({
  // Make the select boxes expand while keeping the add button at its natural width
  '& > :not(:last-child)': {
    flex: 1,
    minWidth: 0,
  },
}));
