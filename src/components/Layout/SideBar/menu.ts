import type { ComponentType, SVGProps } from 'react';

import DashboardRoundedIcon from '@/assets/images/menu/Icon1.svg';
import ArticleRoundedIcon from '@/assets/images/menu/Icon2.svg';
import HistoryRoundedIcon from '@/assets/images/menu/Icon3.svg';
import CreditCardRoundedIcon from '@/assets/images/menu/Icon4.svg';
import SchoolRoundedIcon from '@/assets/images/menu/Icon5.svg';
import SettingsRoundedIcon from '@/assets/images/menu/Icon6.svg';
import HeadphonesRoundedIcon from '@/assets/images/menu/Icon7.svg';
import MicRoundedIcon from '@/assets/images/menu/Icon8.svg';
import { normalizeRoute, PrivateRoutes } from '@/config/routes';

export type SidebarMenuItem = {
    label: string;
    translationKey: keyof typeof sidebarTranslationKeys;
    route: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    paths?: string[];
};

export const sidebarTranslationKeys = {
    dashboard: 'dashboard',
    resumeBuilder: 'resumeBuilder',
    history: 'history',
    payment: 'payment',
    learningHub: 'learningHub',
    interview: 'interview',
    setting: 'setting',
    support: 'support',
} as const;

export const sidebarMenuItems: SidebarMenuItem[] = [
    {
        label: 'Dashboard',
        translationKey: 'dashboard',
        route: PrivateRoutes.dashboard,
        icon: DashboardRoundedIcon,
    },
    {
        label: 'Resume Builder',
        translationKey: 'resumeBuilder',
        route: PrivateRoutes.resumeBuilder,
        icon: ArticleRoundedIcon,
    },
    {
        label: 'History',
        translationKey: 'history',
        route: PrivateRoutes.history,
        icon: HistoryRoundedIcon,
        paths: [PrivateRoutes.history, PrivateRoutes.historyEdite],
    },
    {
        label: 'Payment',
        translationKey: 'payment',
        route: PrivateRoutes.payment,
        icon: CreditCardRoundedIcon,
    },
    {
        label: 'Learning Hub',
        translationKey: 'learningHub',
        route: PrivateRoutes.learningHub,
        icon: SchoolRoundedIcon,
    },
    {
        label: 'Interview',
        translationKey: 'interview',
        route: PrivateRoutes.interView,
        icon: MicRoundedIcon,
        paths: [PrivateRoutes.interView, PrivateRoutes.chatInterView, PrivateRoutes.voiceInterView],
    },
    {
        label: 'Setting',
        translationKey: 'setting',
        route: PrivateRoutes.setting,
        icon: SettingsRoundedIcon,
    },
    {
        label: 'Support',
        translationKey: 'support',
        route: PrivateRoutes.support,
        icon: HeadphonesRoundedIcon,
    },
    // {
    //     label: 'Email',
    //     route: PrivateRoutes.email,
    //     icon: HeadphonesRoundedIcon,
    // },
];

export const isSidebarMenuItemActive = (item: SidebarMenuItem, pathname?: string | null) => {
    const normalizedPathname = normalizeRoute(pathname);
    const routesToCheck =
        item.paths && item.paths.length > 0 ? item.paths : [item.route];

    return routesToCheck.some((route) => {
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


































