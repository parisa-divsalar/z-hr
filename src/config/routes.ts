export const PublicRoutes = {
    landing: '/landing',
    login: '/auth/login',
    forgetPassword: '/auth/reset-password',
    newPassword: '/auth/new-password',
    register: '/auth/register',
    congrats: '/congrats',
    moreFeatures: '/more-features',
    resumeGenerator: '/resume-generator',
    main: '/main',
    blog: '/blog',
};

export const PrivateRoutes = {
    dashboard: '/dashboard',
    history: '/history',
    historyEdite: '/history-edite',
    payment: '/payment',
    setting: '/setting',
    support: '/support',
    interView: '/inter-view',
    resumeBuilder: '/resume-builder',
    learningHub: '/learning-hub',
    chatInterView: '/inter-view/chat-inter-view',
    voiceInterView: '/inter-view/voice-inter-view',
};

export const VisibilityLayout: string[] = [
    PublicRoutes.landing,
    PublicRoutes.blog,
    PrivateRoutes.dashboard,
    PrivateRoutes.history,
    PrivateRoutes.support,
    PrivateRoutes.historyEdite,
    PrivateRoutes.chatInterView,
    PrivateRoutes.voiceInterView,
    PrivateRoutes.payment,
    PrivateRoutes.learningHub,
    PrivateRoutes.resumeBuilder,
    PrivateRoutes.setting,
    PrivateRoutes.interView,
    PublicRoutes.moreFeatures,
    PublicRoutes.resumeGenerator,
    PublicRoutes.main,
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
    PrivateRoutes.voiceInterView,
    PrivateRoutes.learningHub,
];

const normalizeRoute = (value?: string | null) => {
    if (!value) return '/';
    if (value === '/') return '/';
    return value.replace(/\/+$/, '');
};

export const isLayoutVisible = (pathname?: string | null) => {
    const normalizedPathname = normalizeRoute(pathname);
    return VisibilityLayout.some((route) => {
        const normalizedRoute = normalizeRoute(route);
        if (normalizedRoute === '/') {
            return normalizedPathname === '/';
        }
        if (normalizedPathname === normalizedRoute) {
            return true;
        }
        return normalizedPathname.startsWith(`${normalizedRoute}/`);
    });
};
