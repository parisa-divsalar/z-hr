import React, { createElement, forwardRef, useEffect, useMemo, useRef } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
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
    // Let JS auto-resize control the actual height; keep a sane default via minHeight.
    height: 'auto',
    textAlign: 'left',
    '&[dir="rtl"]': {
        textAlign: 'right',
    },
    fontFamily: theme.typography.fontFamily,
    border: 'none',
    fontSize: '1rem',
    lineHeight: '1.25',
    outline: 'none',
    fontWeight: '492',
    backgroundColor: 'transparent',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    overflowAnchor: 'none',
    // Vertically center single-line text inside the initial 52px height
    padding: 'calc((52px - 1.25em) / 2) 0',
    margin: 0,
    boxSizing: 'border-box',
    minWidth: 0,
    color: theme.palette.text.primary,
    resize: 'none',
    overflow: 'hidden',
    display: 'block',
    scrollbarGutter: 'stable',

    '&::placeholder': {
        color: theme.palette.grey[400],
        letterSpacing: '0',
    },
    '&:focus': {
        outline: 'none',
    },
}));

type InputContentProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const findScrollableAncestor = (el: HTMLElement | null): HTMLElement | null => {
    if (!el) return null;
    let node: HTMLElement | null = el.parentElement;

    while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        if (isScrollable) {
            return node;
        }
        node = node.parentElement;
    }

    return (
        (document.getElementById('resume-builder-scroll') as HTMLElement | null) ??
        (document.scrollingElement as HTMLElement | null)
    );
};

const resizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    const scrollParent = findScrollableAncestor(el);
    const prevScrollTop = scrollParent?.scrollTop ?? null;
    const minHeight = 52;

    // When the field is empty, some browsers can report a larger scrollHeight because the
    // placeholder is long and wraps (textarea uses pre-wrap). Keep the collapsed input height
    // consistent with our other inputs on the page.
    if (el.value === '') {
        el.style.overflowY = 'hidden';
        el.style.height = `${minHeight}px`;
        return;
    }
    // Use the most compatible approach for measuring scrollHeight across browsers.
    // Setting height to 'auto' avoids issues where padding/box-sizing makes '0px' unreliable.
    el.style.height = 'auto';
    const computed = window.getComputedStyle(el);
    const maxHeightRaw = computed.maxHeight;
    const maxHeight =
        maxHeightRaw && maxHeightRaw !== 'none' ? Number.parseFloat(maxHeightRaw) : Number.POSITIVE_INFINITY;

    const nextHeight = Math.max(el.scrollHeight, minHeight);

    if (Number.isFinite(maxHeight) && nextHeight > maxHeight) {
        el.style.overflowY = 'auto';
        el.style.height = `${maxHeight}px`;
    } else {
        el.style.overflowY = 'hidden';
        el.style.height = `${nextHeight}px`;
    }

    // Some browsers may adjust the parent scroll position when the textarea height is reset to 'auto'
    // during measurement. Prevent "jumping up" while still allowing natural downward scrolling.
    if (scrollParent && prevScrollTop !== null && scrollParent.scrollTop < prevScrollTop) {
        scrollParent.scrollTop = prevScrollTop;
    }
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

    return createElement(InputContentRoot, {
        ...rest,
        value,
        rows: rows ?? 1,
        ref: setRef,
        onInput: (e: React.InputEvent<HTMLTextAreaElement>) => {
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
