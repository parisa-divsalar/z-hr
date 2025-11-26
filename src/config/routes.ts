export const PublicRoutes = {
  landing: '/',
  login: '/login',
  register: '/register',
  moreFeatures: '/more-features',
  resumeGenerator: '/resume-generator',
};

export const PrivateRoutes = {
  dashboard: '/dashboard',
  history: '/history',
  historyEdite: '/history-edite',
};

export const VisibilityLayout: string[] = [
  PublicRoutes.landing,
  PrivateRoutes.dashboard,
  PrivateRoutes.history,
  PrivateRoutes.historyEdite,
  PublicRoutes.moreFeatures,
  PublicRoutes.resumeGenerator,
];

export const VisibilitySideBar: string[] = [PrivateRoutes.dashboard, PrivateRoutes.history, PrivateRoutes.historyEdite];
