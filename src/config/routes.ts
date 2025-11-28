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
  payment: '/payment',
  setting: '/setting',
  interView: '/inter-view',
  learningHub: '/learning-hub',
  chatInterView: '/inter-view/chat-inter-view',
};

export const VisibilityLayout: string[] = [
  PublicRoutes.landing,
  PrivateRoutes.dashboard,
  PrivateRoutes.history,
  PrivateRoutes.historyEdite,
  PrivateRoutes.chatInterView,
  PrivateRoutes.payment,
  PrivateRoutes.learningHub,
  PrivateRoutes.setting,
  PrivateRoutes.interView,
  PublicRoutes.moreFeatures,
  PublicRoutes.resumeGenerator,
];

export const VisibilitySideBar: string[] = [
  PrivateRoutes.dashboard,
  PrivateRoutes.history,
  PrivateRoutes.historyEdite,
  PrivateRoutes.payment,
  PrivateRoutes.setting,

  PrivateRoutes.interView,
  PrivateRoutes.chatInterView,
  PrivateRoutes.learningHub,
];
