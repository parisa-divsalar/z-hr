import { NextResponse, type NextRequest } from 'next/server';
import { PublicRoutes, normalizeRoute } from '@/config/routes';

function isPublicPath(pathname: string) {
    const normalizedPathname = normalizeRoute(pathname);

    // Treat `/` as public (marketing/home page).
    if (normalizedPathname === '/') return true;

    const publicRoutes: string[] = [
        PublicRoutes.landing,
        PublicRoutes.blog,
        PublicRoutes.moreFeatures,
        PublicRoutes.resumeGenerator,
        PublicRoutes.main,
        PublicRoutes.congrats,
    ];

    return publicRoutes.some((route) => {
        const normalizedRoute = normalizeRoute(route);
        if (normalizedRoute === '/') return normalizedPathname === '/';
        if (normalizedPathname === normalizedRoute) return true;
        return normalizedPathname.startsWith(`${normalizedRoute}/`);
    });
}

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    if (
        pathname === '/manifest.webmanifest' ||
        pathname === '/manifest.json' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname.startsWith('/icons/') ||
        pathname.startsWith('/images/')
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/auth')) {
        if (accessToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    if (!accessToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|icons|images|api).*)'],
};
