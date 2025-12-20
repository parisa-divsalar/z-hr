import { NextResponse, type NextRequest } from 'next/server';

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

    if (!accessToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|icons|images|api).*)'],
};
