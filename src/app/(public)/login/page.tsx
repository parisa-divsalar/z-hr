'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

import { MainContainer, TermsTypography } from '@/app/(public)/login/styled';
import { verifyCode } from '@/app/api/auth';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PrivateRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const LoginPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { loginStart, loginFailure, loginSuccess } = useAuthStore();

  const msisdnFromParams = params.get('msisdn');
  const [msisdn, setMsisdn] = useState<string>(
    msisdnFromParams ? (msisdnFromParams.startsWith('0') ? msisdnFromParams : `0${msisdnFromParams}`) : '',
  );
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    loginStart();
    setLoading(true);

    verifyCode()
      .then((res: any) => {
        loginSuccess(res.accessToken, res.refreshToken);
        router.replace(PrivateRoutes.dashboard);
      })
      .catch(() => loginFailure())
      .finally(() => setLoading(false));
  };
  return (
    <MainContainer>
      <Stack>
        <Typography color='text.primary' variant='subtitle2' pb={2}>
          لطفا شماره موبایل خود را وارد نمایید.
        </Typography>

        <MuiInput
          value={msisdn}
          onChange={setMsisdn}
          label='شماره موبایل'
          maxLength={msisdn.startsWith('0') ? 11 : 10}
          onEnter={() => msisdn !== '' && !loading && onSubmit()}
          placeholder='09121234567'
        />

        <Typography color='text.secondary' variant='caption' mt={2}>
          با کلیک بر روی ادامه، موافقت خودم را با
          <TermsTypography variant='caption'>قوانین و مقررات </TermsTypography>
          اعلام میدارم.
        </Typography>
      </Stack>

      <MuiButton onClick={onSubmit} loading={loading} fullWidth disabled={msisdn === ''}>
        ادامه
      </MuiButton>
    </MainContainer>
  );
};

export default LoginPage;
