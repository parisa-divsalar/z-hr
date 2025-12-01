export const PublicRoutes = {
  landing: '/',
  login: '/login',
  forgetPassword: '/reset-password',
  newPassword: '/new-password',
  register: '/register',
  moreFeatures: '/more-features',
  resumeGenerator: '/resume-generator',
};

export const PrivateRoutes = {
  dashboard: '/dashboard',
  history: '/history',
  historyEdite: '/History-edite',
  payment: '/payment',
  setting: '/setting',
  support: '/support',
  interView: '/inter-view',
  resumeBuilder: '/resume-builder',
  learningHub: '/learning-hub',
  chatInterView: '/inter-view/chat-inter-view',
};

export const VisibilityLayout: string[] = [
  PublicRoutes.landing,
  PrivateRoutes.dashboard,
  PrivateRoutes.history,
  PrivateRoutes.support,
  PrivateRoutes.historyEdite,
  PrivateRoutes.chatInterView,
  PrivateRoutes.payment,
  PrivateRoutes.learningHub,
  PrivateRoutes.resumeBuilder,
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
  PrivateRoutes.resumeBuilder,
  PrivateRoutes.support,

  PrivateRoutes.interView,
  PrivateRoutes.chatInterView,
  PrivateRoutes.learningHub,
];
