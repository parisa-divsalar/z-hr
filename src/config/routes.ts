export const PublicRoutes = {
  landing: '/',
  login: '/login',
  register: '/register',
  moreFeatures: '/more-features',
  resumeGenerator: '/resume-generator',
};

export const PrivateRoutes = {
  dashboard: '/dashboard',
};

export const VisibilityLayout: string[] = [PublicRoutes.landing, PrivateRoutes.dashboard];

export const VisibilitySideBar: string[] = [PrivateRoutes.dashboard];
