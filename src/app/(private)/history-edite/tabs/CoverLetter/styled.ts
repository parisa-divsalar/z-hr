import React, { createElement, forwardRef, useEffect, useMemo, useRef } from 'react';

import { Dialog, DialogProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiDialog-container': {
        padding: theme.spacing(2),
    },
    '& .MuiPaper-root': {
        borderRadius: '1rem',
        overflow: 'hidden',
        margin: 0,
        width: '100%',
        maxWidth: '760px',
        maxHeight: '70vh',
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
    },
}));

export const StackContainer = styled(Stack)(() => ({
    width: '100%',
    display: 'flex',
    flex: 1,
    minHeight: 0,
    alignItems: 'stretch',
}));

export const StackContent = styled(Stack)(({ theme }) => ({
    flex: 1,
    minHeight: 0,
    width: '100%',
    alignItems: 'stretch',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign: 'left',
    overflowY: 'auto',
    position: 'relative',
}));

export const HeaderContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ActionContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ContainerSkill = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    backgroundColor: 'white',
    width: '100%',
    borderRadius: '8px',
    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.grey[100]}`,
    padding: '0 16px',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: '0.25rem',
    overflow: 'hidden',
    boxSizing: 'border-box',
    minWidth: 0,
    alignSelf: 'stretch',
}));

const InputContentRoot = styled('textarea')(({ theme }) => ({
    width: '100%',
    minHeight: '52px',
    height: 'auto',
    textAlign: 'left',
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
