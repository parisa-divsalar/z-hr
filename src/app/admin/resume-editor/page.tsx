'use client';

import React, { useEffect, useMemo } from 'react';

import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import { useWizardStore } from '@/store/wizard';

export default function AdminResumeEditorPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const requestId = searchParams.get('requestId');

  const setRequestId = useWizardStore((s) => s.setRequestId);

  const normalized = useMemo(() => {
    const uid = String(userId ?? '').trim();
    const rid = String(requestId ?? '').trim();
    return {
      userId: uid || null,
      requestId: rid || null,
      isValid: Boolean(uid && rid),
    };
  }, [userId, requestId]);

  useEffect(() => {
    if (!normalized.requestId) return;
    // Keep the existing editor flow intact by seeding the wizard store requestId.
    setRequestId(normalized.requestId);
  }, [normalized.requestId, setRequestId]);

  if (!normalized.isValid) {
    return (
      <Stack p={3} gap={1}>
        <Typography variant="h5" fontWeight={600}>
          Resume editor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Missing query params. Expected: <code>userId</code> and <code>requestId</code>.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" height="100%" p={2}>
      <Typography variant="h5" color="text.primary" fontWeight={600} mt={2}>
        Resume editor (admin)
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
        userId: {normalized.userId} · requestId: {normalized.requestId}
      </Typography>

      <ResumeEditor
        setStage={() => undefined}
        setActiveStep={() => undefined}
        apiUserId={normalized.userId}
        requestIdOverride={normalized.requestId}
        disableAutoPoll
      />
    </Stack>
  );
}


