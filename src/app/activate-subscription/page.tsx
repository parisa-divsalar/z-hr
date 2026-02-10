'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ResumeIcon from '@/assets/images/dashboard/resume.svg';
import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';

export default function ActivateSubscriptionPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: 'var(--app-height)',
        width: '100%',
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Box
        sx={{
          width: 'min(92vw, 560px)',
          borderRadius: 4,
          border: '1px solid #E8E8EE',
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: '0px 12px 40px rgba(17, 24, 39, 0.08)',
        }}
      >
        {/* Header */}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            px: 3,
            py: 2,
            bgcolor: '#FAFAFC',
          }}
        >
          <Stack direction='row' alignItems='center' gap={1.5} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(77, 73, 252, 0.10)',
                border: '1px solid rgba(77, 73, 252, 0.16)',
                flex: '0 0 auto',
              }}
            >
              <AppImage src={logo} width={18} height={24} alt='Z-CV logo' />
            </Box>

            <Stack sx={{ minWidth: 0 }}>
              <Typography variant='subtitle1' fontWeight={800} color='text.primary' lineHeight={1.1} noWrap>
                Z-CV
              </Typography>
              <Typography variant='caption' color='text.secondary' lineHeight={1.1} noWrap>
                AI Resume Maker
              </Typography>
            </Stack>
          </Stack>

          <Link
            href='/'
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
            }}
          >
            <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
              Website
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Link>
        </Stack>

        <Divider />

        {/* Body */}
        <Stack
          alignItems='center'
          justifyContent='center'
          sx={{
            px: 3,
            pt: 5,
            pb: 4,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 140,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 104,
                  height: 104,
                  borderRadius: '50%',
                  bgcolor: 'rgba(77, 73, 252, 0.08)',
                  filter: 'blur(0px)',
                }}
              />
            </Box>

            <Box
              sx={{
                position: 'relative',
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: '#fff',
                border: '1px solid #EEF0F6',
                boxShadow: '0px 10px 28px rgba(17, 24, 39, 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { width: 30, height: 30 },
              }}
            >
              <ResumeIcon />
            </Box>

            {/* Decorative dots */}
            <Box
              sx={{
                position: 'absolute',
                top: 14,
                left: 18,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'rgba(77, 73, 252, 0.18)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 18,
                left: 34,
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'rgba(17, 24, 39, 0.08)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 22,
                right: 22,
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'rgba(17, 24, 39, 0.08)',
              }}
            />
          </Box>

          <Typography variant='h5' fontWeight={800} color='text.primary' textAlign='center' sx={{ mb: 1 }}>
            Activate Your Subscription Plan
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            textAlign='center'
            sx={{ maxWidth: 420, mb: 2.75 }}
          >
            Build and maintain web applications using React.js. Work with designers and backend developers to implement
            features. Ensure apps are fast, scalable, and user-friendly.
          </Typography>

          <MuiButton
            text='See Our Plans'
            variant='contained'
            color='inherit'
            sx={{
              px: 3,
              height: 44,
              borderRadius: 2,
              bgcolor: '#111827',
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0B1220', boxShadow: 'none' },
            }}
            onClick={() => router.push(PublicRoutes.pricing)}
          />
        </Stack>

        <Divider />

        {/* Footer */}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            px: 3,
            py: 2,
            bgcolor: '#FAFAFC',
          }}
        >
          <Typography variant='subtitle1' fontWeight={800} color='text.primary'>
            Z-CV
          </Typography>

          <Typography variant='caption' color='text.secondary' sx={{ textAlign: 'center' }}>
            All rights reserved. &nbsp; © 2025
          </Typography>

          <Stack direction='row' gap={0.5}>
            {[
              { label: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 18 }} /> },
              { label: 'LinkedIn', icon: <LinkedInIcon sx={{ fontSize: 18 }} /> },
              { label: 'Instagram', icon: <InstagramIcon sx={{ fontSize: 18 }} /> },
              { label: 'X', icon: <XIcon sx={{ fontSize: 18 }} /> },
            ].map((item) => (
              <IconButton
                key={item.label}
                aria-label={item.label}
                size='small'
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: '#fff',
                  border: '1px solid #EEF0F6',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}



