'use client';

import { useMemo, useState } from 'react';

import { Tab } from '@mui/material';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { PublicRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';

import { TabsContainer, StyledTabs } from '../styled';

interface SkillGapTabsProps {
  onChange?: (tab: string) => void;
  value?: string;
}

const DEFAULT_TAB = 'interview-questions';

const SkillGapTabs = ({ onChange, value }: SkillGapTabsProps) => {
  const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
  const [uncontrolledTab, setUncontrolledTab] = useState(DEFAULT_TAB);
  const activeTab = value ?? uncontrolledTab;

  const [lockedOpen, setLockedOpen] = useState(false);
  const [lockedLabel, setLockedLabel] = useState<string>('this feature');

  const enabled = useMemo(() => new Set((access?.enabledKeys ?? []).filter(Boolean)), [access?.enabledKeys]);

  const locks = useMemo(() => {
    const canInterview =
      enabled.has('question_interview') || enabled.has('text_interview') || enabled.has('interview_questions');
    const canPositions = enabled.has('position_suggestion') || enabled.has('job_position_suggestions');
    const canSkillGap = enabled.has('skill_gap');
    const canCoverLetter = enabled.has('ai_cover_letter') || enabled.has('cover_letter');

    return {
      'interview-questions': { locked: !canInterview, label: 'Suggested interview questions' },
      positions: { locked: !canPositions, label: 'Suggested Positions' },
      'skill-gap': { locked: !canSkillGap, label: 'Skill Gap' },
      'cover-letter': { locked: !canCoverLetter, label: 'Cover letter' },
    } as const;
  }, [enabled]);

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
        title='Feature locked'
        headline={`"${lockedLabel}" is disabled for your account.`}
        bodyText='Buy coins/upgrade your plan, then enable it in More Features (Step 3).'
        primaryLabel='Buy plan / coins'
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
            label='Suggested interview questions'
            value='interview-questions'
            aria-disabled={isAccessLoading || locks['interview-questions'].locked}
            sx={tabSx(locks['interview-questions'].locked)}
          />
          <Tab
            label='Suggested Positions'
            value='positions'
            aria-disabled={isAccessLoading || locks.positions.locked}
            sx={tabSx(locks.positions.locked)}
          />
          <Tab
            label='Skill Gap'
            value='skill-gap'
            aria-disabled={isAccessLoading || locks['skill-gap'].locked}
            sx={tabSx(locks['skill-gap'].locked)}
          />
          <Tab
            label='Cover letter'
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
