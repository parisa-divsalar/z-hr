import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Typography, Grid, Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import ResumeMoreTemplates from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesLeft';
import ResumeTemplatesRight, {
  MoreFeatureSuggestion,
} from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';
import {
  featureKeyFromTitle,
  readMoreFeaturesSelection,
  type MoreFeaturesSelection,
  writeMoreFeaturesSelection,
} from '@/utils/moreFeaturesSelection';

interface MoreFeaturesProps {
  setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES') => void;
}

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = (props) => {
  const { setStage } = props;
  const router = useRouter();
  const requestId = useWizardStore((state) => state.requestId);
  const [suggestions, setSuggestions] = useState<MoreFeatureSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [selection, setSelection] = useState<MoreFeaturesSelection>(() => readMoreFeaturesSelection(requestId));

  useEffect(() => {
    setSelection(readMoreFeaturesSelection(requestId));
  }, [requestId]);

  const toggleSuggestion = (suggestion: Pick<MoreFeatureSuggestion, 'id' | 'title'>, checked: boolean) => {
    const key = featureKeyFromTitle(suggestion.title) || String(suggestion.id ?? '').trim();
    if (!key) return;
    setSelection((prev) => {
      const next = { ...prev, [key]: checked };
      writeMoreFeaturesSelection(requestId, { [key]: checked });
      return next;
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadSuggestions = async () => {
      setLoadingSuggestions(true);
      setSuggestionsError(null);
      try {
        const res = await fetch('/api/more-features', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as MoreFeatureSuggestion[];
        if (isMounted) setSuggestions(Array.isArray(json) ? json : []);
      } catch (error) {
        if (isMounted) {
          setSuggestionsError(error instanceof Error ? error.message : 'Failed to load more features');
          setSuggestions([]);
        }
      } finally {
        if (isMounted) setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const leftSuggestions = suggestions.slice(0, 3);
  const rightSuggestions = suggestions.slice(3, 6);

  const leftWithSelection = useMemo(() => {
    return leftSuggestions.map((s) => {
      const key = featureKeyFromTitle(s.title) || String(s.id ?? '').trim();
      return { ...s, __featureKey: key, __checked: key ? Boolean(selection[key]) : false };
    });
  }, [leftSuggestions, selection]);

  const rightWithSelection = useMemo(() => {
    return rightSuggestions.map((s) => {
      const key = featureKeyFromTitle(s.title) || String(s.id ?? '').trim();
      return { ...s, __featureKey: key, __checked: key ? Boolean(selection[key]) : false };
    });
  }, [rightSuggestions, selection]);

  return (
    <>
      <Stack textAlign='center' mt={2} mb={2}>
        <Typography variant='h5' color='text.primary' fontWeight='500' mt={0.5}>
          More Features
        </Typography>
        <Typography variant='h6' color='text.primary' mt={2} fontWeight='400'>
          You can utilize these features with your resume
        </Typography>
      </Stack>
      <Grid container spacing={{ xs: 2, md: 3 }} mt={{ xs: 1, md: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {loadingSuggestions ? (
            <Typography variant='subtitle2' color='text.secondary'>
              Loading suggestions...
            </Typography>
          ) : suggestionsError ? (
            <Typography variant='subtitle2' color='error'>
              {suggestionsError}
            </Typography>
          ) : leftWithSelection.length === 0 ? (
            <Typography variant='subtitle2' color='text.secondary'>
              No feature suggestions available.
            </Typography>
          ) : (
            leftWithSelection.map((suggestion, index) =>
              index === 0 ? (
                <ResumeMoreTemplates
                  key={suggestion.id}
                  suggestion={suggestion}
                  checked={Boolean((suggestion as any).__checked)}
                  onCheckedChange={(checked) => toggleSuggestion(suggestion, checked)}
                />
              ) : (
                <Box key={suggestion.id} mt={2.5}>
                  <ResumeMoreTemplates
                    suggestion={suggestion}
                    checked={Boolean((suggestion as any).__checked)}
                    onCheckedChange={(checked) => toggleSuggestion(suggestion, checked)}
                  />
                </Box>
              ),
            )
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {loadingSuggestions ? (
            <Typography variant='subtitle2' color='text.secondary'>
              Loading suggestions...
            </Typography>
          ) : suggestionsError ? (
            <Typography variant='subtitle2' color='error'>
              {suggestionsError}
            </Typography>
          ) : (
            <ResumeTemplatesRight
              suggestions={rightWithSelection as any}
              getChecked={(s) => {
                const key = featureKeyFromTitle((s as any)?.title) || String((s as any)?.id ?? '').trim();
                return key ? Boolean(selection[key]) : false;
              }}
              onToggle={(s, checked) => toggleSuggestion(s as any, checked)}
            />
          )}
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 3 }}
        justifyContent='center'
        alignItems='center'
        p={{ xs: 2, sm: 3, md: 5 }}
      >
        <MuiButton
          text='Back'
          variant='outlined'
          color='secondary'
          size='large'
          startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
          onClick={() => setStage('RESUME_EDITOR')}
        />
        <MuiButton
          text='Submit'
          variant='contained'
          color='secondary'
          size='large'
          onClick={() => {
            const qs = new URLSearchParams();
            if (requestId) qs.set('requestId', requestId);
            router.push(`/resume-generator${qs.toString() ? `?${qs.toString()}` : ''}`);
          }}
        />
      </Stack>
    </>
  );
};

export default MoreFeatures;
