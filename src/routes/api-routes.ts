export type ApiRoute = {
  path: string;
  methods: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'>;
  feature: string;
  userStateEvent?: string;
};

// Central route registry for backend + frontend alignment.
export const API_ROUTES: ApiRoute[] = [
  // Auth
  { path: '/api/auth/register', methods: ['POST'], feature: 'auth', userStateEvent: 'register' },
  { path: '/api/auth/login', methods: ['POST'], feature: 'auth', userStateEvent: 'login' },
  { path: '/api/auth/logout', methods: ['POST'], feature: 'auth' },
  { path: '/api/auth/forgot-password', methods: ['POST'], feature: 'auth' },
  { path: '/api/auth/update-password', methods: ['POST'], feature: 'auth' },

  // User profile
  { path: '/api/users/me', methods: ['GET'], feature: 'profile', userStateEvent: 'profile_view' },

  // Wizard
  { path: '/api/wizard/save', methods: ['GET', 'POST'], feature: 'wizard', userStateEvent: 'wizard_save' },

  // Resume
  { path: '/api/resume/generate', methods: ['GET', 'POST'], feature: 'resume', userStateEvent: 'resume_generate' },
  { path: '/api/resume/save-override', methods: ['POST'], feature: 'resume', userStateEvent: 'resume_override' },

  // CV
  { path: '/api/cv/add-cv', methods: ['POST'], feature: 'cv', userStateEvent: 'cv_add' },
  { path: '/api/cv/edit-cv', methods: ['PUT'], feature: 'cv', userStateEvent: 'cv_edit' },
  { path: '/api/cv/delete', methods: ['DELETE'], feature: 'cv' },
  { path: '/api/cv/get-cv', methods: ['GET'], feature: 'cv' },
  { path: '/api/cv/analyze', methods: ['POST'], feature: 'cv', userStateEvent: 'cv_analyze' },
  { path: '/api/cv/cv-analysis-detailed', methods: ['POST'], feature: 'cv' },
  { path: '/api/cv/improve', methods: ['POST'], feature: 'cv' },
  { path: '/api/cv/get-improved', methods: ['GET'], feature: 'cv' },
  { path: '/api/cv/post-improved', methods: ['POST'], feature: 'cv' },
  { path: '/api/cv/send-file', methods: ['POST'], feature: 'cv' },
  { path: '/api/cv/cover-letter', methods: ['POST'], feature: 'cover-letter', userStateEvent: 'cover_letter' },
  { path: '/api/cv/add-cover-letter', methods: ['POST'], feature: 'cover-letter' },
  { path: '/api/cv/get-cover-letter', methods: ['GET'], feature: 'cover-letter' },

  // Skill Gap + Skills
  { path: '/api/skills/analyze-gap', methods: ['POST'], feature: 'skill-gap', userStateEvent: 'skill_gap' },
  { path: '/api/skills/categories', methods: ['GET'], feature: 'skills' },
  { path: '/api/skills/by-category', methods: ['GET'], feature: 'skills' },
  { path: '/api/slills-categories', methods: ['GET'], feature: 'skills' },

  // Files
  { path: '/api/files/extract-text', methods: ['POST'], feature: 'files', userStateEvent: 'files_extract_text' },

  // Interview
  { path: '/api/interview/questions', methods: ['POST'], feature: 'interview', userStateEvent: 'interview_questions' },

  // History
  { path: '/api/history', methods: ['GET'], feature: 'history', userStateEvent: 'history_view' },

  // User states
  { path: '/api/user-states', methods: ['GET'], feature: 'user-states' },
  { path: '/api/user-states/resolve', methods: ['GET'], feature: 'user-states' },
  { path: '/api/user-states/history', methods: ['GET'], feature: 'user-states' },
  { path: '/api/user-states/audit', methods: ['POST'], feature: 'user-states' },
  { path: '/api/user-states/definitions', methods: ['GET'], feature: 'user-states' },

  // Learning Hub
  { path: '/api/learning-hub/courses', methods: ['GET', 'OPTIONS'], feature: 'learning-hub' },
  { path: '/api/learning-hub/status', methods: ['GET'], feature: 'learning-hub' },
  { path: '/api/learning-hub/sync', methods: ['GET', 'POST', 'OPTIONS'], feature: 'learning-hub' },
  { path: '/api/learning-hub/youtube/sync', methods: ['GET', 'POST', 'OPTIONS'], feature: 'learning-hub' },

  // Plans + More features
  { path: '/api/plans', methods: ['GET'], feature: 'plans' },
  { path: '/api/more-features', methods: ['GET'], feature: 'more-features' },

  // Jobs
  { path: '/api/jobs/sync', methods: ['GET'], feature: 'jobs' },
  { path: '/api/jobs/test', methods: ['GET'], feature: 'jobs' },

  // Blog
  { path: '/api/blog/articles', methods: ['GET'], feature: 'blog' },

  // Categories
  { path: '/api/categories-name', methods: ['GET'], feature: 'categories' },

  // Admin
  { path: '/api/admin/database', methods: ['GET'], feature: 'admin' },
  { path: '/api/admin/history', methods: ['GET'], feature: 'admin' },
  { path: '/api/admin/table/[table]', methods: ['GET', 'POST', 'PATCH', 'DELETE'], feature: 'admin' },
  { path: '/api/admin/test-ping', methods: ['GET'], feature: 'admin' },
  { path: '/api/admin/test-jobs', methods: ['GET'], feature: 'admin' },
  { path: '/api/admin/test-chatgpt', methods: ['GET'], feature: 'admin' },

  // Legacy Apps
  { path: '/api/Apps/SendFile', methods: ['POST'], feature: 'legacy-apps' },
  { path: '/api/Apps/AddCV', methods: ['POST'], feature: 'legacy-apps' },
];
