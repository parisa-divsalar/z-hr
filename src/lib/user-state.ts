import { db } from '@/lib/db';

export type ResolveStateInput = {
  userId: number;
  isVerified?: boolean | null;
  planStatus?: 'free' | 'paid' | 'expired' | 'failed' | 'blocked' | 'none' | null;
  credits?: number | null;
  featureBlocked?: boolean | null;
  justConverted?: boolean | null;
  inactiveDays?: number | null;
  lastActiveAt?: string | null;
  paymentFailed?: boolean | null;
  usageDecline?: boolean | null;
};

function toBool(v: any): boolean | null {
  if (v === true || v === false) return v;
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(s)) return true;
  if (['0', 'false', 'no', 'n'].includes(s)) return false;
  return null;
}

function toNumberOrNull(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function calcInactiveDays(lastActiveAt?: string | null): number | null {
  if (!lastActiveAt) return null;
  const dt = new Date(lastActiveAt);
  if (Number.isNaN(dt.getTime())) return null;
  const diffMs = Date.now() - dt.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function evaluateChurnRisk(userId: number, lastActiveAt?: string | null): boolean {
  const activityLogs = db.userStateLogs.findAll().filter((log: any) => Number(log?.user_id) === Number(userId));
  
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  
  // Get last 7 days activity
  const last7Days = activityLogs.filter((log: any) => {
    const logDate = new Date(log.created_at);
    return (now.getTime() - logDate.getTime()) <= sevenDaysMs;
  });
  
  // Get previous 7 days activity (days 8-14)
  const prev7Days = activityLogs.filter((log: any) => {
    const logDate = new Date(log.created_at);
    const daysAgo = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo > 7 && daysAgo <= 14;
  });
  
  // Check usage decline >= 60%
  if (prev7Days.length > 0) {
    const decline = ((prev7Days.length - last7Days.length) / prev7Days.length) * 100;
    if (decline >= 60) return true;
  }
  
  // Check inactivity >= 14 days
  const daysSinceActive = calcInactiveDays(lastActiveAt);
  if (daysSinceActive != null && daysSinceActive >= 14) return true;
  
  return false;
}

export function resolveUserState(input: ResolveStateInput) {
  const user = db.users.findById(input.userId);
  if (!user) return { state: 'Guest', reason: 'user_not_found' };

  const filterByUserId = (rows: any[]) => rows.filter((r: any) => Number(r?.user_id) === Number(input.userId));

  const cvs = db.cvs.findByUserId(input.userId) ?? [];
  const resumeDrafts = filterByUserId(db.resumeDrafts.findAll());
  const wizardData = filterByUserId(db.wizardData.findAll());
  const interviewSessions = filterByUserId(db.interviewSessions.findAll());
  const coverLetters = filterByUserId(db.coverLetters.findAll());
  const resumeSectionOutputs = filterByUserId(db.resumeSectionOutputs.findAll());

  const hasResume = cvs.length > 0;
  const hasStartedResume = hasResume || resumeDrafts.length > 0 || wizardData.length > 0;
  const hasCompletedResume = hasResume;

  const advancedUsage =
    interviewSessions.length > 0 || coverLetters.length > 0 || resumeSectionOutputs.length > 0 || cvs.length > 1;

  const isVerified =
    input.isVerified ??
    (typeof (user as any)?.is_verified === 'boolean'
      ? (user as any).is_verified
      : typeof (user as any)?.email_verified === 'boolean'
        ? (user as any).email_verified
        : (user as any)?.verified_at
          ? true
          : null);

  const planStatus = (input.planStatus ?? ((user as any)?.plan_status as any) ?? null) as
    | 'free'
    | 'paid'
    | 'expired'
    | 'failed'
    | 'blocked'
    | 'none'
    | null;

  const paymentFailed = input.paymentFailed ?? (user as any)?.payment_failed ?? false;
  const featureBlocked = input.featureBlocked ?? (user as any)?.feature_blocked ?? false;
  const justConverted = input.justConverted ?? (user as any)?.just_converted ?? false;
  const credits = input.credits ?? toNumberOrNull((user as any)?.credits ?? (user as any)?.coin ?? null);

  const inactiveDays =
    input.inactiveDays != null
      ? input.inactiveDays
      : calcInactiveDays(input.lastActiveAt ?? (user as any)?.last_active_at ?? null);

  if (paymentFailed || planStatus === 'failed') return { state: 'Payment Failed', reason: 'payment_failed' };

  // Check churn-risk before dormant (preventive detection)
  const isChurnRisk = evaluateChurnRisk(input.userId, input.lastActiveAt ?? (user as any)?.last_active_at ?? null);
  if (isChurnRisk) return { state: 'Churn-risk User', reason: 'churn_risk' };

  if (inactiveDays != null && inactiveDays >= 30) return { state: 'Dormant User', reason: `inactive_${inactiveDays}_days` };

  if (isVerified === false) return { state: 'Registered – Not Verified', reason: 'not_verified' };

  if (!hasStartedResume) return { state: 'Registered – No Resume', reason: 'no_resume' };
  if (hasStartedResume && !hasCompletedResume) return { state: 'Started Resume – Incomplete', reason: 'resume_incomplete' };

  if (planStatus === 'paid') {
    if (justConverted) return { state: 'Paid – Just Converted', reason: 'just_converted' };
    if (credits != null && credits <= 0) return { state: 'Paid – Credit Exhausted', reason: 'credits_exhausted' };
    if (advancedUsage) return { state: 'Paid – Power User', reason: 'power_user' };
    return { state: 'Paid – Active', reason: 'paid_active' };
  }

  if (planStatus === 'expired') return { state: 'Paid – Expired Plan', reason: 'plan_expired' };
  if (featureBlocked || planStatus === 'blocked') return { state: 'Free – Feature Blocked', reason: 'feature_blocked' };

  if (hasCompletedResume && cvs.length === 1) return { state: 'Free – First Resume Completed', reason: 'first_resume' };
  if (hasCompletedResume && advancedUsage) return { state: 'Free – Activated (Exploring)', reason: 'free_activated' };

  return { state: 'Free – First Resume Completed', reason: 'default_free' };
}

export function recordUserStateTransition(
  userId: number,
  input: Omit<ResolveStateInput, 'userId'> = {},
  meta?: Record<string, unknown>
) {
  const user = db.users.findById(userId);
  if (!user) return { state: 'Guest', reason: 'user_not_found' };

  const resolved = resolveUserState({ userId, ...input });
  const prevState = (user as any)?.user_state ?? null;

  if (prevState !== resolved.state) {
    db.userStateHistory.append({
      user_id: userId,
      prev_state: prevState,
      state: resolved.state,
      reason: resolved.reason,
      meta: meta ?? null,
    });
  }

  db.users.update(userId, {
    user_state: resolved.state,
    user_state_reason: resolved.reason,
    user_state_updated_at: new Date().toISOString(),
  } as any);

  return resolved;
}

export function normalizeResolveInput(
  params: Record<string, string | string[] | undefined>
): Omit<ResolveStateInput, 'userId'> {
  const get = (key: string) => (Array.isArray(params[key]) ? params[key]?.[0] : params[key]);
  return {
    isVerified: toBool(get('isVerified')),
    planStatus: (get('planStatus') as any) ?? null,
    credits: toNumberOrNull(get('credits')),
    featureBlocked: toBool(get('featureBlocked')),
    justConverted: toBool(get('justConverted')),
    inactiveDays: toNumberOrNull(get('inactiveDays')),
    lastActiveAt: get('lastActiveAt') ?? null,
    paymentFailed: toBool(get('paymentFailed')),
    usageDecline: toBool(get('usageDecline')),
  };
}
