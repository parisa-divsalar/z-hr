'use client';

import { useMemo, useState } from 'react';

import { Box, Breadcrumbs, Button, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';

import FooterMain from '@/app/main/FooterMain';
import { ContainerSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';
import { InputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';




export default function ContactUsPage() {
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
    // UI-only: no backend wired here yet.
    // Keep it silent to match the screenshot; the parent app may add snackbar/toast later.
    if (!canSend) return;
    // eslint-disable-next-line no-console
    console.log('Contact form submit:', form);
  };

  return (
    <Box
      dir='ltr'
      sx={{
        width: '100%',
        direction: 'ltr',
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
        {/* Left */}
        <Stack sx={{ minWidth: 0 }} spacing={3}>
          <Stack spacing={1.5}>
            <Breadcrumbs
              aria-label='breadcrumb'
              separator='›'
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'text.secondary' },
                '& .MuiTypography-root': {
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                },
              }}
            >
              <MuiLink component={Link} href='/' underline='hover' color='inherit'>
                Home
              </MuiLink>
              <Typography color='text.secondary'>Contact us</Typography>
            </Breadcrumbs>

            <Typography variant='h2' fontWeight={700} color='text.primary'>
              Contact Us
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Stack direction='row'  sx={{ alignItems: 'baseline' }}>
              <Typography fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                Address
              </Typography>
              <Typography  fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                123 Innovation Drive, Dubai, UAE
              </Typography>
            </Stack>
            <Stack direction='row'  sx={{ alignItems: 'baseline' }}>
              <Typography  fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                Email
              </Typography>
              <Typography fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                Info@z-cv.com
              </Typography>
            </Stack>
            <Stack direction='row'  sx={{ alignItems: 'baseline' }}>
              <Typography  fontWeight={400} variant='subtitle1' color='text.secondary' sx={{ width: 84, flexShrink: 0 }}>
                Phone
              </Typography>
              <Typography fontWeight={492} variant='subtitle1' color='text.primary' sx={{ minWidth: 0 }}>
                9999999999
              </Typography>
            </Stack>
          </Stack>

          <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={1.75} mt={2}>
              <Typography variant='h5' fontWeight={492} color='text.primary'>
                Contact form
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  placeholder='Your name'
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  size='medium'
                  fullWidth
                />
                <TextField
                  placeholder='Your email'
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  size='medium'
                  type='email'
                  fullWidth
                />
              </Box>

              <ContainerSkill
                direction='row'
                active={Boolean(form.message.trim())}
                sx={{
                  // Keep it aligned with the contact form grid (not the wizard's centered/maxWidth layout)
                  maxWidth: '100%',
                  marginTop: 0,
                  marginInline: 0,
                }}
              >
                <InputContent
                  placeholder='Type your message'
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  // Match wizard behavior: auto-grow until maxHeight, then scroll inside the field.
                  style={{ maxHeight: 240 }}
                  dir='auto'
                  aria-label='Message'
                />
              </ContainerSkill>

              <Stack direction='row' spacing={1.5}>
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
                  Reset
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
                  Send
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
            title='Z-CV location map'
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
