'use client';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Divider, SelectProps, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import MuiSelectOptions, { SelectOption } from '@/components/UI/MuiSelectOptions';
import { PublicRoutes } from '@/config/routes';
import { getMainTranslations } from '@/locales/main';
import { apiClientClient } from '@/services/api-client';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';
import {
    formatDateOfBirthForDisplay,
    isValidDateOfBirthDDMMYYYY,
    normalizeDateOfBirthInput,
} from '@/utils/validation';

import {
    StackContent,
    StackContainer,
    ActionContainer,
    DialogContainer,
    HeaderContainer,
} from '../Wizard/Step1/SlectSkill/EditSkillDialog/styled';

const selectMenuProps: SelectProps['MenuProps'] = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    PaperProps: {
        sx: {
            maxHeight: '180px',
            overflowY: 'auto',
            py: 1,
            bgcolor: 'grey.50',
            '& .MuiMenu-list': { py: 0.5 },
            '& .MuiMenuItem-root:hover': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-selected:hover': { bgcolor: 'grey.100' },
            '& .MuiMenuItem-root.Mui-focusVisible': { bgcolor: 'grey.100' },
        },
    },
};

type IntroDialogProps = {
    open: boolean;
    onClose: () => void;

    showBackToDashboard?: boolean;
    backToDashboardHref?: string;

    /** When true, show "buy plan" message and block resume creation until user goes to pricing or dashboard */
    zeroCoinsMode?: boolean;
    pricingHref?: string;

    /** When true (e.g. on resume-builder), show loading until profile is loaded so we can decide zeroCoinsMode */
    profileLoading?: boolean;
};

const IntroDialog: FunctionComponent<IntroDialogProps> = ({
    open,
    onClose,
    showBackToDashboard = false,
    backToDashboardHref = '/dashboard',
    zeroCoinsMode = false,
    pricingHref = PublicRoutes.pricing,
    profileLoading = false,
}) => {
    const router = useRouter();
    const locale = useLocaleStore((s) => s.locale);
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const t = getMainTranslations(locale).landing.introDialog;
    const { data, updateField } = useWizardStore();

    const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
    const [skillOptions, setSkillOptions] = useState<SelectOption[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoadingSkills(true);
                const { data } = await apiClientClient.get('skills/categories');

                const categoryFa = getMainTranslations(locale).landing.skillCategoryFa ?? {};
                const options = data.data.map((skill: string) => ({
                    value: skill,
                    label: (categoryFa as Record<string, string>)[skill] ?? skill,
                }));
                setSkillOptions(options);
            } catch {
                console.error('Failed to fetch skills');
            } finally {
                setLoadingSkills(false);
            }
        };

        fetchSkills();
    }, [locale]);

    const dobHasFullYear = useMemo(() => {
        const parts = String(data.dateOfBirth ?? '')
            .trim()
            .split('/');
        return parts.length === 3 && (parts[2]?.length ?? 0) === 4;
    }, [data.dateOfBirth]);

    const dobErrorText = useMemo(() => {
        if (!dobHasFullYear) return '';
        return isValidDateOfBirthDDMMYYYY(data.dateOfBirth) ? '' : t.dateError;
    }, [data.dateOfBirth, dobHasFullYear, t.dateError]);

    const isSaveDisabled = useMemo(() => {
        const hasFullName = data.fullName.trim().length > 0;
        const hasMainSkill = data.mainSkill.trim().length > 0;
        const hasValidDob = isValidDateOfBirthDDMMYYYY(data.dateOfBirth);

        return !(hasFullName && hasMainSkill && hasValidDob);
    }, [data.fullName, data.mainSkill, data.dateOfBirth]);

    const handleConfirm = async () => {
        const hasFullName = data.fullName.trim().length > 0;
        const hasMainSkill = data.mainSkill.trim().length > 0;
        const hasValidDob = isValidDateOfBirthDDMMYYYY(data.dateOfBirth);
        if (!(hasFullName && hasMainSkill && hasValidDob)) return;

        // Persist to DB (best-effort). This enables feature pages (e.g. Learning Hub)
        // to filter content based on user's selected mainSkill after login.
        try {
            setSaving(true);
            await apiClientClient.patch('users/me', {
                fullName: data.fullName,
                mainSkill: data.mainSkill,
                dateOfBirth: data.dateOfBirth,
            });
        } catch {
            // Non-blocking: user can continue even if API fails in local dev.
        } finally {
            setSaving(false);
            onClose();
        }
    };

    const handleGoToPricing = () => {
        onClose();
        router.push(pricingHref);
    };

    const handleBackToDashboard = () => {
        onClose();
        router.push(backToDashboardHref);
    };

    if (showBackToDashboard && profileLoading) {
        return (
            <DialogContainer
                open={open}
                maxWidth='xs'
                PaperProps={{ sx: { height: 'auto', minHeight: '200px', direction: dir } }}
                onClose={() => {}}
                disableEscapeKeyDown
            >
                <StackContainer>
                    <HeaderContainer direction='row'>
                        <Typography color='text.primary' variant='body1' fontWeight={500}>
                            {t.primaryInfo}
                        </Typography>
                    </HeaderContainer>
                    <StackContent gap={1.5} sx={{ justifyContent: 'center', py: 3 }}>
                        <Typography variant='body2' color='text.secondary'>
                            {t.loading}
                        </Typography>
                    </StackContent>
                </StackContainer>
            </DialogContainer>
        );
    }

    if (zeroCoinsMode) {
        return (
            <DialogContainer
                open={open}
                maxWidth='xs'
                PaperProps={{ sx: { height: 'auto', minHeight: '280px', direction: dir } }}
                onClose={(_, reason) => {
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                    onClose();
                }}
                disableEscapeKeyDown
            >
                <StackContainer>
                    <HeaderContainer direction='row'>
                        <Typography color='text.primary' variant='body1' fontWeight={500}>
                            {t.notEnoughCoins}
                        </Typography>
                    </HeaderContainer>

                    <StackContent gap={1.5}>
                        <Typography variant='body2' color='text.secondary'>
                            {t.needPurchase}
                        </Typography>
                    </StackContent>

                    <Divider />

                    <ActionContainer>
                        <Stack direction='row' gap={1} sx={{ width: '258px' }}>

                            <MuiButton
                                fullWidth
                                variant='contained'
                                color='secondary'
                                sx={{ flex: 1, minWidth: 0 }}
                                onClick={handleGoToPricing}
                            >
                                {t.pricing}
                            </MuiButton>
                        </Stack>
                    </ActionContainer>
                </StackContainer>
            </DialogContainer>
        );
    }

    return (
        <DialogContainer open={open} maxWidth='xs' PaperProps={{ sx: { height: '413px', direction: dir } }}>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        {t.primaryInfo}
                    </Typography>
                </HeaderContainer>

                <StackContent gap={1.5}>
                    <MuiInput
                        label={t.fullName}
                        value={data.fullName}
                        onChange={(value) => updateField('fullName', String(value ?? ''))}
                    />
                    <MuiInput
                        label={t.dateOfBirth}
                        placeholder={t.datePlaceholder}
                        value={formatDateOfBirthForDisplay(data.dateOfBirth, locale)}
                        error={!!dobErrorText}
                        helperText={dobErrorText}
                        onChange={(value) => updateField('dateOfBirth', normalizeDateOfBirthInput(String(value ?? '')))}
                        type='text'
                        inputMode='text'
                    />
                    <MuiSelectOptions
                        label={t.mainSkill}
                        placeholder={loadingSkills ? t.loadingSkills : t.selectSkill}
                        value={data.mainSkill}
                        options={skillOptions}
                        onChange={(value) => updateField('mainSkill', String(value))}
                        fullWidth
                        disabled={loadingSkills}
                        menuProps={selectMenuProps}
                        selectProps={{
                            sx: {
                                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' },
                            },
                        }}
                    />
                </StackContent>

                <Divider />

                <ActionContainer>
                    {showBackToDashboard ? (
                        <Stack direction='row' gap={1} sx={{ width: '258px' }}>
                            <MuiButton
                                fullWidth
                                variant='outlined'
                                color='secondary'
                                sx={{ flex: 1, minWidth: 0 }}
                                href={backToDashboardHref}
                            >
                                {t.back}
                            </MuiButton>
                            <MuiButton
                                fullWidth
                                variant='contained'
                                color='secondary'
                                sx={{ flex: 1, minWidth: 0 }}
                                onClick={handleConfirm}
                                disabled={isSaveDisabled || saving}
                            >
                                {t.save}
                            </MuiButton>
                        </Stack>
                    ) : (
                        <MuiButton
                            fullWidth
                            variant='contained'
                            color='secondary'
                            sx={{ width: '258px' }}
                            onClick={handleConfirm}
                            disabled={isSaveDisabled || saving}
                        >
                            {t.save}
                        </MuiButton>
                    )}
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default IntroDialog;
