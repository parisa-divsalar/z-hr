import { NextRequest, NextResponse } from "next/server";

const ADMIN_AUTH_COOKIE = "zcv_admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = req.cookies.get(ADMIN_AUTH_COOKIE)?.value === "1";

  // Force-disable signup route for this admin (fixed credentials only).
  if (pathname === "/signup") {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Allow sign-in page (and logout which will clear the cookie and redirect).
  if (pathname === "/signin" || pathname === "/logout") {
    return NextResponse.next();
  }

  // All other pages require auth.
  if (!isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)",
  ],
};



