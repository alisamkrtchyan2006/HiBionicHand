import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip i18n middleware for admin routes
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Prevent locale codes from being treated as routes when they appear after another locale
  // e.g., /en/arm should redirect to /arm
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length >= 2) {
    const firstSegment = pathSegments[0];
    const secondSegment = pathSegments[1];
    
    // If first segment is a locale and second segment is also a locale, redirect
    if (
      routing.locales.includes(firstSegment as any) &&
      routing.locales.includes(secondSegment as any) &&
      firstSegment !== secondSegment
    ) {
      // Redirect to the second locale (e.g., /en/arm -> /arm)
      const newPath = `/${secondSegment}${pathSegments.slice(2).length > 0 ? '/' + pathSegments.slice(2).join('/') : ''}`;
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|.*\\..*).*)'
  ]
};

