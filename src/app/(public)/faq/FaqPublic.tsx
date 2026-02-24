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
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

type FaqTabId = 'resume' | 'ats' | 'pricing' | 'formats' | 'interview';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
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
  const locale = useLocaleStore((s) => s.locale);
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const mainT = getMainTranslations(locale);
  const t = mainT.faqPage;
  const navT = mainT.nav;

  const faqByTab: Record<FaqTabId, FaqItem[]> = React.useMemo(
    () => ({
      resume: t.resume,
      ats: t.ats,
      pricing: t.pricing,
      formats: t.formats,
      interview: t.interview,
    }),
    [t]
  );

  const tabs = t.tabs;
  const [activeTab, setActiveTab] = React.useState<FaqTabId>('resume');
  const [query, setQuery] = React.useState('');
  const allItems = React.useMemo(() => faqByTab[activeTab], [activeTab, faqByTab]);

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((it) => it.question.toLowerCase().includes(q) || it.answer.toLowerCase().includes(q));
  }, [allItems, query]);

  const [expanded, setExpanded] = React.useState<string | false>(filteredItems[0]?.id ?? false);

  React.useEffect(() => {
    if (!filteredItems.length) {
      setExpanded(false);
      return;
    }
    const stillExists = expanded && filteredItems.some((it) => it.id === expanded);
    if (!stillExists) setExpanded(filteredItems[0].id);
  }, [activeTab, expanded, filteredItems, query]);

  const breadcrumbSeparator = dir === 'rtl' ? '‹' : '›';

  return (
    <Box dir={dir} sx={[faqPublicSx.root, { direction: dir }]}>
      <Box sx={faqPublicSx.hero}>
        <Box sx={[faqPublicSx.heroInner, { textAlign: dir === 'rtl' ? 'right' : 'center' }]}>
          <Breadcrumbs aria-label='breadcrumb' separator={breadcrumbSeparator} sx={faqPublicSx.breadcrumbs}>
            <MuiLink component={Link} href='/' underline='hover' color='inherit'>
              {t.home}
            </MuiLink>
            <Typography variant='body1' fontWeight='584' color='text.primary'>
              {t.faq}
            </Typography>
          </Breadcrumbs>

          <Typography variant='h1' fontWeight='700' sx={faqPublicSx.heroTitle}>
            {t.heroTitle}
          </Typography>

          <Typography variant='h5' fontWeight='492' sx={faqPublicSx.heroLead} mt={4}>
            {t.heroLead}
          </Typography>

          <Box sx={faqPublicSx.heroSearchWrap}>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              fullWidth
              sx={[faqPublicSx.heroSearch, { '& input': { direction: dir } }]}
              InputProps={{
                ...(dir === 'rtl'
                  ? {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon fontSize='small' sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }
                  : {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <SearchIcon fontSize='small' sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }),
              }}
              inputProps={{ 'aria-label': t.searchPlaceholder }}
            />
          </Box>
        </Box>
      </Box>

      <Box />

      <Box component='section' sx={faqPublicSx.contentSection}>
        <Box sx={[faqPublicSx.sparkleFloatLeft, dir === 'rtl' && { left: 'auto', right: { xs: 16, sm: 24 } }]}>
          <Sparkle size={22} />
        </Box>
        <Box sx={[faqPublicSx.sparkleFloatRight, dir === 'rtl' && { right: 'auto', left: { xs: 16, sm: 24 } }]}>
          <Sparkle size={22} />
        </Box>

        <Box sx={faqPublicSx.contentInner}>
          <Typography variant='h1' fontWeight='700' sx={[faqPublicSx.sectionTitle, { textAlign: dir === 'rtl' ? 'right' : 'center' }]}>
            {t.sectionTitle}
          </Typography>
          <Typography fontWeight='492' variant='subtitle1' sx={[faqPublicSx.sectionLead, { textAlign: dir === 'rtl' ? 'right' : 'center' }]}>
            {t.sectionLead}
          </Typography>

          <Box sx={faqPublicSx.tabsRow}>
            <Box
              sx={[
                faqPublicSx.tabsScroller,
                dir === 'rtl' && { flexDirection: 'row-reverse', pl: 2, pr: 0.5 },
              ]}
              role='tablist'
              aria-label='FAQ categories'
            >
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as FaqTabId)}
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
                    sx={[
                      faqPublicSx.summary,
                      dir === 'rtl' && {
                        pl: { xs: 2, sm: 3 },
                        pr: { xs: 7, sm: 8 },
                        '& .MuiAccordionSummary-expandIconWrapper': {
                          right: { xs: 16, sm: 24 },
                          left: 'auto',
                        },
                      },
                    ]}
                  >
                    <Typography fontWeight='584' variant='h5' sx={[faqPublicSx.question, { textAlign: dir === 'rtl' ? 'right' : 'left' }]}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={[faqPublicSx.details, { textAlign: dir === 'rtl' ? 'right' : 'left' }]}>
                    <Typography fontWeight='492' variant='subtitle1' sx={[faqPublicSx.answer, { direction: dir }]}>
                      {item.answer}
                    </Typography>
                    {!!item.tags?.length && (
                      <Stack
                        direction='row'
                        gap={1}
                        flexWrap='wrap'
                        mt={1.25}
                        sx={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}
                      >
                        {item.tags.map((tagKey) => {
                          const isPricing = tagKey.trim().toLowerCase() === 'pricing';
                          if (!isPricing) return <Chip key={tagKey} label={tagKey} size='small' sx={faqPublicSx.chip} />;

                          return (
                            <MuiLink
                              key={tagKey}
                              component={Link}
                              href='/pricing'
                              underline='none'
                              aria-label={t.goToPricing}
                              sx={{ display: 'inline-flex' }}
                            >
                              <Chip
                                label={navT.pricing}
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
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                }}
              >
                <Typography fontWeight={600} color='text.primary'>
                  {t.noResults}
                </Typography>
                <Typography color='text.secondary' mt={0.5}>
                  {t.tryDifferentKeyword}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <Box id='contact' sx={{ mb: 'calc(-1 * var(--children-padding))' }} mt={5}>
        <FooterMain />
      </Box>
    </Box>
  );
}
