'use client';

import { useMemo, useState } from 'react';

import { Box, Breadcrumbs, Button, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';

import FooterMain from '@/app/main/FooterMain';
import { ContainerSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

export default function ContactUsPage() {
  const locale = useLocaleStore((s) => s.locale);
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const t = getMainTranslations(locale).contactPage;

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const canSend = useMemo(() => {
    return Boolean(form.name.trim() && form.email.trim() && form.message.trim());
  }, [form.email, form.message, form.name]);

  const handleReset = () => setForm({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    // eslint-disable-next-line no-console
    console.log('Contact form submit:', form);
  };

  const breadcrumbSeparator = dir === 'rtl' ? '‹' : '›';

  return (
    <Box
      dir={dir}
      sx={{
        width: '100%',
        direction: dir,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.25fr)' },
          gap: { xs: 3.5, md: 5 },
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* Left / First column */}
        <Stack sx={{ minWidth: 0 }} spacing={3}>
          <Stack spacing={1.5}>
            <Breadcrumbs
              aria-label='breadcrumb'
              separator={breadcrumbSeparator}
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'text.secondary' },
                '& .MuiTypography-root': {
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                },
                flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
              }}
            >
              <MuiLink component={Link} href='/' underline='hover' color='inherit'>
                {t.home}
              </MuiLink>
              <Typography color='text.secondary'>{t.contactUs}</Typography>
            </Breadcrumbs>

            <Typography variant='h2' fontWeight={700} color='text.primary' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {t.contactUs}
            </Typography>
          </Stack>

          <Stack spacing={1.25} sx={{ direction: dir }}>
            <Stack direction='row' sx={{ alignItems: 'baseline', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
              <Typography fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                {t.address}
              </Typography>
              <Typography fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                {t.addressValue}
              </Typography>
            </Stack>
            <Stack direction='row' sx={{ alignItems: 'baseline', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
              <Typography fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                {t.email}
              </Typography>
              <Typography fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                {t.emailValue}
              </Typography>
            </Stack>
            <Stack direction='row' sx={{ alignItems: 'baseline', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
              <Typography fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                {t.phone}
              </Typography>
              <Typography fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                {t.phoneValue}
              </Typography>
            </Stack>
          </Stack>

          <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%', direction: dir }}>
            <Stack spacing={1.75} mt={2}>
              <Typography variant='h5' fontWeight={492} color='text.primary' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                {t.contactForm}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  placeholder={t.yourName}
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  size='medium'
                  fullWidth
                  inputProps={{ dir }}
                />
                <TextField
                  placeholder={t.yourEmail}
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  size='medium'
                  type='email'
                  fullWidth
                  inputProps={{ dir }}
                />
              </Box>

              <ContainerSkill
                direction='row'
                active={Boolean(form.message.trim())}
                sx={{
                  maxWidth: '100%',
                  marginTop: 0,
                  marginInline: 0,
                  flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                }}
              >
                <InputContent
                  placeholder={t.typeMessage}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  style={{ maxHeight: 240 }}
                  dir={dir}
                  aria-label={t.messageAria}
                />
              </ContainerSkill>

              <Stack direction='row' spacing={1.5} sx={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                <Button
                  variant='outlined'
                  color='inherit'
                  onClick={handleReset}
                  sx={{
                    borderColor: 'grey.100',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'grey.200', backgroundColor: 'action.hover' },
                  }}
                >
                  {t.reset}
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={!canSend}
                  sx={{
                    backgroundColor: 'secondary.main',
                    '&:hover': { backgroundColor: 'secondary.dark' },
                  }}
                >
                  {t.send}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Right */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 320, sm: 380, md: 520 },
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'grey.50',
          }}
        >
          <Box
            component='iframe'
            title={t.mapTitle}
            src='https://www.google.com/maps?q=Al%20Safa%2C%20Dubai&z=14&output=embed'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            sx={{
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        </Box>
      </Box>

      <Box id='contact'>
        <FooterMain />
      </Box>
    </Box>
  );
}
