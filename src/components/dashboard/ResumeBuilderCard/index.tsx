'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { ResumeBuilderCardRoot } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';

type ResumeInProgress = {
  requestId: string;
  updatedAt: string;
  step?: string;
  completedSections: number;
  totalSections: number;
};

type Props = {
  resumeInProgress?: ResumeInProgress | null;
  creditsRemaining?: number;
};

function toMMDDYYYY(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function formatStepLabel(step?: string) {
  const raw = String(step ?? '').trim();
  if (!raw) return 'In progress';
  const lower = raw.toLowerCase();
  if (lower === 'completed') return 'Final step';
  if (lower.includes('step') || lower.includes('completed') || lower.includes('incomplete')) {
    return raw.replace(/_/g, ' ');
  }
  // e.g. "1" / "2" / "3"
  if (/^\d+$/.test(raw)) return `Step ${raw}`;
  return raw.replace(/_/g, ' ');
}

const ResumeBuilderCard = ({ resumeInProgress, creditsRemaining = 0 }: Props) => {
  const router = useRouter();
  const [isStartingNew, setIsStartingNew] = useState(false);
  const hasDraft = Boolean(resumeInProgress?.requestId);
  const isBlockedByCredits = hasDraft && Number(creditsRemaining) <= 0;

  const meta = hasDraft
    ? {
        stepLabel: formatStepLabel(resumeInProgress?.step),
        date: toMMDDYYYY(String(resumeInProgress?.updatedAt ?? '')),
        progress: `${Math.max(0, Number(resumeInProgress?.completedSections ?? 0))}/${Math.max(
          1,
          Number(resumeInProgress?.totalSections ?? 8),
        )}`,
      }
    : null;

  const handleContinue = () => {
    if (!hasDraft) {
      router.push(PrivateRoutes.resumeBuilder);
      return;
    }

    if (isBlockedByCredits) {
      router.push(PublicRoutes.pricing);
      return;
    }

    const qs = new URLSearchParams();
    const rawStep = String(resumeInProgress?.step ?? '').trim();
    const parsedStep = Number.parseInt(rawStep, 10);
    const explicitWizardStep =
      Number.isFinite(parsedStep) && parsedStep >= 1 && parsedStep <= 3 ? String(parsedStep) : null;
    const shouldOpenEditor = Number(resumeInProgress?.completedSections ?? 0) > 0;
    qs.set('step', explicitWizardStep ?? (shouldOpenEditor ? '3' : '1'));
    qs.set('requestId', String(resumeInProgress?.requestId ?? ''));
    router.push(`${PrivateRoutes.resumeBuilder}?${qs.toString()}`);
  };

  const handleStartNew = async () => {
    if (!hasDraft) {
      router.push(`${PrivateRoutes.resumeBuilder}?step=1&new=1`);
      return;
    }

    if (isBlockedByCredits) {
      router.push(PublicRoutes.pricing);
      return;
    }

    const ok = window.confirm(
      'Start a new resume? This will discard your current in-progress resume draft.',
    );
    if (!ok) return;

    setIsStartingNew(true);
    try {
      await fetch('/api/resume/discard-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: String(resumeInProgress?.requestId ?? '').trim() }),
      });
    } catch {
      // If discard fails, still allow starting fresh client-side.
    } finally {
      setIsStartingNew(false);
    }

    router.push(`${PrivateRoutes.resumeBuilder}?step=1&new=1`);
  };

  return (
    <ResumeBuilderCardRoot>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 2, sm: 3 }}
      >
        <Stack gap={0.75} sx={{ minWidth: 0 }}>
          <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
            Resume Builder
          </Typography>

          {meta ? (
            <Stack direction='row' gap={2} alignItems='center' sx={{ flexWrap: 'wrap' }}>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {isBlockedByCredits ? 'Paused' : meta.stepLabel}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                •
              </Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {meta.date || '—'}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                •
              </Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {meta.progress}
              </Typography>
              {isBlockedByCredits ? (
                <>
                  <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                    •
                  </Typography>
                  <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                    Credits finished
                  </Typography>
                </>
              ) : null}
            </Stack>
          ) : (
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              Start building your first resume
            </Typography>
          )}
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1}
          sx={{ width: { xs: '100%', sm: 'auto' }, alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          <MuiButton
            text={!hasDraft ? 'Start' : isBlockedByCredits ? 'Recharge & continue' : 'Continue'}
            color='secondary'
            sx={{
              height: 40,
              px: 3,
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 150 },
            }}
            onClick={handleContinue}
          />

          {hasDraft && !isBlockedByCredits ? (
            <MuiButton
              text='Start new'
              variant='outlined'
              color='secondary'
              loading={isStartingNew}
              sx={{
                height: 40,
                px: 3,
                borderRadius: 2,
                minWidth: { xs: '100%', sm: 150 },
              }}
              onClick={handleStartNew}
            />
          ) : null}
        </Stack>
      </Stack>
    </ResumeBuilderCardRoot>
  );
};

export default ResumeBuilderCard;


