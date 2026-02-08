'use client';

import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import { faqPublicSx } from '@/app/(public)/faq/FaqPublic.styles';
import FooterMain from '@/app/main/FooterMain';

type FaqTabId = 'resume' | 'ats' | 'pricing' | 'formats' | 'interview';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

const TABS: { id: FaqTabId; label: string }[] = [
  { id: 'resume', label: 'Resume & CV (Dubai format)' },
  { id: 'ats', label: 'ATS / Profile Strength' },
  { id: 'pricing', label: 'Pricing & Plans' },
  { id: 'formats', label: 'Upload / Import / Formats (PDF/DOCX)' },
  { id: 'interview', label: 'Interview Practice / Learning Hub' },
];

const FAQ_BY_TAB: Record<FaqTabId, FaqItem[]> = {
  resume: [
    {
      id: 'dubai-resume',
      question: 'Is it possible to create a resume for Dubai?',
      answer: "Check your resume's ATS compatibility with our score checker for better applications.",
      tags: ['Pricing'],
    },
    { id: 'ats-friendly', question: 'Are your resumes ATS-friendly?', answer: 'Yes—our templates are designed to be ATS-friendly and readable by recruiters and tracking systems.' },
    { id: 'pdf-docx', question: 'Can I get a PDF/DOCX output?', answer: 'Yes. You can export your resume in PDF and DOCX formats depending on your plan and template.' },
    { id: 'collaboration', question: 'What features do you offer for collaboration?', answer: 'You can share, review, and iterate faster with version history and easy export/share options.' },
    { id: 'trial', question: 'Is there a trial period available?', answer: 'We offer a trial so you can test templates and core features before committing to a plan.' },
  ],
  ats: [
    { id: 'ats-score', question: 'How do I improve my ATS score?', answer: 'Use clear section headings, measurable achievements, and keywords from the job description—then re-check your score.' },
    { id: 'keywords', question: 'Do you suggest keywords?', answer: 'Yes, we can recommend role-relevant keywords based on your target job and your existing content.' },
    { id: 'formatting', question: 'What formatting hurts ATS?', answer: 'Complex tables, multi-column layouts, and text inside images can reduce ATS readability. Our ATS templates avoid these.' },
  ],
  pricing: [
    { id: 'plans', question: 'What plans do you offer?', answer: 'We offer multiple plans depending on export needs, templates, and AI features. See the Pricing page for details.' },
    { id: 'cancel', question: 'Can I cancel anytime?', answer: 'Yes. You can cancel your subscription at any time from your account settings.' },
    { id: 'refund', question: 'Do you offer refunds?', answer: 'Refunds depend on the plan and usage. Contact support and we’ll help you quickly.' },
  ],
  formats: [
    { id: 'import-docx', question: 'Can I import an existing resume?', answer: 'Yes. You can upload supported files and we’ll help you restructure the content into our templates.' },
    { id: 'pdf-quality', question: 'Will the exported PDF be print-ready?', answer: 'Yes. Exports are high-quality and optimized for both printing and online sharing.' },
    { id: 'fonts', question: 'Can I change fonts?', answer: 'Template font options may vary, but we aim for professional, ATS-safe typography choices.' },
  ],
  interview: [
    { id: 'practice', question: 'Do you have interview practice questions?', answer: 'Yes. We provide a learning hub with role-based interview questions and structured practice prompts.' },
    { id: 'feedback', question: 'Do you provide feedback?', answer: 'You’ll get guidance on structure and clarity. More advanced feedback features depend on your plan.' },
  ],
};

const Sparkle = (props: { size?: number }) => {
  const size = props.size ?? 18;
  const gradientId = React.useId();
  return (
    <Box
      component='svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
      sx={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0' x2='24' y2='24'>
          <stop offset='0' stopColor='#3B82F6' />
          <stop offset='0.55' stopColor='#8B5CF6' />
          <stop offset='1' stopColor='#06B6D4' />
        </linearGradient>
      </defs>
      <path
        d='M12 1.75l1.55 6.1 6.1 1.55-6.1 1.55L12 17.05l-1.55-6.1-6.1-1.55 6.1-1.55L12 1.75z'
        fill={`url(#${gradientId})`}
      />
      <path
        d='M18.75 13.2l.9 3.55 3.55.9-3.55.9-.9 3.55-.9-3.55-3.55-.9 3.55-.9.9-3.55z'
        fill={`url(#${gradientId})`}
      />
    </Box>
  );
};

export default function FaqPublic() {
  const [activeTab, setActiveTab] = React.useState<FaqTabId>('resume');
  const [query, setQuery] = React.useState('');
  const allItems = React.useMemo(() => FAQ_BY_TAB[activeTab], [activeTab]);

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((it) => it.question.toLowerCase().includes(q) || it.answer.toLowerCase().includes(q));
  }, [allItems, query]);

  const [expanded, setExpanded] = React.useState<string | false>(filteredItems[0]?.id ?? false);

  React.useEffect(() => {
    // Keep expansion stable when switching tabs / searching.
    if (!filteredItems.length) {
      setExpanded(false);
      return;
    }
    const stillExists = expanded && filteredItems.some((it) => it.id === expanded);
    if (!stillExists) setExpanded(filteredItems[0].id);
  }, [activeTab, expanded, filteredItems, query]);

  return (
    <Box dir='ltr' sx={faqPublicSx.root}>
      {/* Hero */}
      <Box sx={faqPublicSx.hero}>
        <Box sx={faqPublicSx.heroInner}>
          <Breadcrumbs aria-label='breadcrumb' separator='›' sx={faqPublicSx.breadcrumbs}>
            <MuiLink component={Link} href='/' underline='hover' color='inherit'>
              Home
            </MuiLink>
            <Typography variant='body1' fontWeight='584'  color='text.primary'>FAQ</Typography>
          </Breadcrumbs>

          <Typography variant='h1' fontWeight='700'   sx={faqPublicSx.heroTitle}>
            Frequently Asked Questions
          </Typography>

          <Typography  variant='h5' fontWeight='492'   sx={faqPublicSx.heroLead} mt={4}>
            "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
            <br />
            Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.
          </Typography>

          <Box sx={faqPublicSx.heroSearchWrap}>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search question...'
              fullWidth
              sx={faqPublicSx.heroSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon fontSize='small' sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ 'aria-label': 'Search FAQ' }}
            />
          </Box>
        </Box>
      </Box>

      <Box/>

      {/* Content */}
      <Box component='section' sx={faqPublicSx.contentSection}>
        <Box sx={faqPublicSx.sparkleFloatLeft}>
          <Sparkle size={22} />
        </Box>
        <Box sx={faqPublicSx.sparkleFloatRight}>
          <Sparkle size={22} />
        </Box>

        <Box sx={faqPublicSx.contentInner}>
          <Typography variant='h1' fontWeight='700'   sx={faqPublicSx.sectionTitle}>
            FAQ
          </Typography>
          <Typography fontWeight='492' variant='subtitle1' sx={faqPublicSx.sectionLead}>
            "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
            <br />
            Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.
          </Typography>

          <Box sx={faqPublicSx.tabsRow}>
            <Box sx={faqPublicSx.tabsScroller} role='tablist' aria-label='FAQ categories'>
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant='text'
                    disableElevation
                    sx={{
                      ...faqPublicSx.tabPill,
                      ...(isActive ? faqPublicSx.tabPillActive : null),
                    }}
                    role='tab'
                    aria-selected={isActive}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <Stack sx={faqPublicSx.listWrap}>
            {filteredItems.map((item) => {
              const isExpanded = expanded === item.id;
              return (
                <Accordion
                  key={item.id}
                  disableGutters
                  elevation={0}
                  expanded={isExpanded}
                  onChange={(_, next) => setExpanded(next ? item.id : false)}
                  sx={faqPublicSx.accordion}
                >
                  <AccordionSummary
                    disableRipple
                    expandIcon={
                      <Box sx={faqPublicSx.expandIconBubble}>
                        {isExpanded ? (
                          <CloseIcon sx={{ fontSize: 18, color: 'text.primary' }} />
                        ) : (
                          <AddIcon sx={{ fontSize: 18, color: 'text.primary' }} />
                        )}
                      </Box>
                    }
                    sx={faqPublicSx.summary}
                  >
                    <Typography fontWeight='584' variant='h5' sx={faqPublicSx.question}>{item.question}</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={faqPublicSx.details}>
                    <Typography fontWeight='492' variant='subtitle1' sx={faqPublicSx.answer}>{item.answer}</Typography>
                    {!!item.tags?.length && (
                      <Stack direction='row' gap={1} flexWrap='wrap' mt={1.25}>
                        {item.tags.map((t) => {
                          const isPricing = t.trim().toLowerCase() === 'pricing';
                          if (!isPricing) return <Chip key={t} label={t} size='small' sx={faqPublicSx.chip} />;

                          return (
                            <MuiLink
                              key={t}
                              component={Link}
                              href='/pricing'
                              underline='none'
                              aria-label='Go to pricing'
                              sx={{ display: 'inline-flex' }}
                            >
                              <Chip
                                label={t}
                                size='small'
                                sx={[
                                  faqPublicSx.chip,
                                  {
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.14)' },
                                  },
                                ]}
                              />
                            </MuiLink>
                          );
                        })}
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}

            {!filteredItems.length && (
              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(16, 24, 40, 0.08)',
                  bgcolor: 'common.white',
                  p: { xs: 2, sm: 2.5 },
                  boxShadow: '0px 10px 30px rgba(16, 24, 40, 0.06)',
                }}
              >
                <Typography fontWeight={600} color='text.primary'>
                  No results
                </Typography>
                <Typography color='text.secondary' mt={0.5}>
                  Try a different keyword.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <div id='contact'>
        <FooterMain />
      </div>
    </Box>
  );
}


