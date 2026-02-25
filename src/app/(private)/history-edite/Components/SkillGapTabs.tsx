'use client';

import { useMemo, useState } from 'react';

import { Tab } from '@mui/material';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { PublicRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import { TabsContainer, StyledTabs } from '../styled';

interface SkillGapTabsProps {
  onChange?: (tab: string) => void;
  value?: string;
}

const DEFAULT_TAB = 'interview-questions';

const SkillGapTabs = ({ onChange, value }: SkillGapTabsProps) => {
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).historyEdite.tabs;
  const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
  const [uncontrolledTab, setUncontrolledTab] = useState(DEFAULT_TAB);
  const activeTab = value ?? uncontrolledTab;

  const [lockedOpen, setLockedOpen] = useState(false);
  const [lockedLabel, setLockedLabel] = useState<string>(t.coverLetter);

  const enabled = useMemo(() => new Set((access?.enabledKeys ?? []).filter(Boolean)), [access?.enabledKeys]);

  const locks = useMemo(() => {
    const canInterview =
      enabled.has('question_interview') || enabled.has('text_interview') || enabled.has('interview_questions');
    const canPositions = enabled.has('position_suggestion') || enabled.has('job_position_suggestions');
    const canSkillGap = enabled.has('skill_gap');
    const canCoverLetter = enabled.has('ai_cover_letter') || enabled.has('cover_letter');

    return {
      'interview-questions': { locked: !canInterview, label: t.suggestedInterviewQuestions },
      positions: { locked: !canPositions, label: t.suggestedPositions },
      'skill-gap': { locked: !canSkillGap, label: t.skillGap },
      'cover-letter': { locked: !canCoverLetter, label: t.coverLetter },
    } as const;
  }, [enabled, t]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (isAccessLoading) return;
    const lock = (locks as any)[newValue] as { locked: boolean; label: string } | undefined;
    if (lock?.locked) {
      setLockedLabel(lock.label);
      setLockedOpen(true);
      return;
    }
    if (value === undefined) setUncontrolledTab(newValue);
    onChange?.(newValue);
  };

  const tabSx = (locked: boolean) =>
    locked || isAccessLoading ? { opacity: 0.55, cursor: 'not-allowed' } : undefined;

  return (
    <>
      <PlanRequiredDialog
        open={lockedOpen}
        onClose={() => setLockedOpen(false)}
        title={t.featureLocked}
        headline={t.featureLockedHeadline(lockedLabel)}
        bodyText={t.featureLockedBody}
        primaryLabel={t.buyPlanCoins}
        primaryHref={PublicRoutes.pricing}
      />

      <TabsContainer>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          textColor='primary'
          indicatorColor='primary'
          variant='standard'
        >
          <Tab
            label={t.suggestedInterviewQuestions}
            value='interview-questions'
            aria-disabled={isAccessLoading || locks['interview-questions'].locked}
            sx={tabSx(locks['interview-questions'].locked)}
          />
          <Tab
            label={t.suggestedPositions}
            value='positions'
            aria-disabled={isAccessLoading || locks.positions.locked}
            sx={tabSx(locks.positions.locked)}
          />
          <Tab
            label={t.skillGap}
            value='skill-gap'
            aria-disabled={isAccessLoading || locks['skill-gap'].locked}
            sx={tabSx(locks['skill-gap'].locked)}
          />
          <Tab
            label={t.coverLetter}
            value='cover-letter'
            aria-disabled={isAccessLoading || locks['cover-letter'].locked}
            sx={tabSx(locks['cover-letter'].locked)}
          />
        </StyledTabs>
      </TabsContainer>
    </>
  );
};

export default SkillGapTabs;
