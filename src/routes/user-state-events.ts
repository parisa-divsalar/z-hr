export type UserStateEvent =
  | 'register'
  | 'login'
  | 'wizard_save'
  | 'cv_add'
  | 'cv_edit'
  | 'cv_analyze'
  | 'cover_letter'
  | 'interview_questions'
  | 'resume_generate'
  | 'resume_override'
  | 'skill_gap'
  | 'files_extract_text'
  | 'learning_hub_view'
  | 'history_view'
  | 'profile_view'
  | 'profile_update';

export const USER_STATE_EVENTS: Array<{ event: UserStateEvent; description: string }> = [
  { event: 'register', description: 'User completed registration.' },
  { event: 'login', description: 'User logged in successfully.' },
  { event: 'wizard_save', description: 'User saved wizard data.' },
  { event: 'cv_add', description: 'User created a new CV.' },
  { event: 'cv_edit', description: 'User edited an existing CV.' },
  { event: 'cv_analyze', description: 'User ran CV analysis.' },
  { event: 'cover_letter', description: 'User generated a cover letter.' },
  { event: 'interview_questions', description: 'User generated interview questions.' },
  { event: 'resume_generate', description: 'User generated resume sections.' },
  { event: 'resume_override', description: 'User saved resume section overrides.' },
  { event: 'skill_gap', description: 'User generated skill gap analysis.' },
  { event: 'files_extract_text', description: 'User extracted text from a file.' },
  { event: 'learning_hub_view', description: 'User viewed Learning Hub content.' },
  { event: 'history_view', description: 'User viewed resume history.' },
  { event: 'profile_view', description: 'User viewed profile details.' },
  { event: 'profile_update', description: 'User updated profile details.' },
];

export const ADVANCED_USAGE_EVENTS = new Set<UserStateEvent>([
  'cover_letter',
  'interview_questions',
  'skill_gap',
  'resume_generate',
  'resume_override',
  'cv_analyze',
  'files_extract_text',
]);

export const USER_STATE_DEFINITIONS = [
  {
    state: 'Guest',
    reason: 'user_not_found',
    criteria: 'No user found for userId',
    order: 1,
  },
  {
    state: 'Payment Failed',
    reason: 'payment_failed',
    criteria: 'paymentFailed === true OR planStatus === failed',
    order: 13,
  },
  {
    state: 'Dormant User',
    reason: 'inactive_30+_days',
    criteria: 'inactiveDays >= 30',
    order: 14,
  },
  {
    state: 'Churn-risk User',
    reason: 'churn_risk',
    criteria: 'inactiveDays >= 14 OR usageDecline === true',
    order: 15,
  },
  {
    state: 'Registered – Not Verified',
    reason: 'not_verified',
    criteria: 'isVerified === false',
    order: 2,
  },
  {
    state: 'Registered – No Resume',
    reason: 'no_resume',
    criteria: '!hasStartedResume',
    order: 3,
  },
  {
    state: 'Started Resume – Incomplete',
    reason: 'resume_incomplete',
    criteria: 'hasStartedResume && !hasCompletedResume',
    order: 4,
  },
  {
    state: 'Paid – Just Converted',
    reason: 'just_converted',
    criteria: 'planStatus === paid && justConverted === true',
    order: 8,
  },
  {
    state: 'Paid – Credit Exhausted',
    reason: 'credits_exhausted',
    criteria: 'planStatus === paid && credits <= 0',
    order: 11,
  },
  {
    state: 'Paid – Expired Plan',
    reason: 'plan_expired',
    criteria: 'planStatus === expired',
    order: 12,
  },
  {
    state: 'Paid – Power User',
    reason: 'power_user',
    criteria: 'planStatus === paid && advancedUsage === true',
    order: 10,
  },
  {
    state: 'Paid – Active',
    reason: 'paid_active',
    criteria: 'planStatus === paid (fallback)',
    order: 9,
  },
  {
    state: 'Free – Feature Blocked',
    reason: 'feature_blocked',
    criteria: 'featureBlocked === true OR planStatus === blocked',
    order: 7,
  },
  {
    state: 'Free – First Resume Completed',
    reason: 'first_resume',
    criteria: 'hasCompletedResume && cvs.length === 1',
    order: 5,
  },
  {
    state: 'Free – Activated (Exploring)',
    reason: 'free_activated',
    criteria: 'hasCompletedResume && advancedUsage === true',
    order: 6,
  },
  {
    state: 'Free – First Resume Completed',
    reason: 'default_free',
    criteria: 'fallback for free users with completed resume',
    order: 5,
  },
];
