import { NextResponse } from 'next/server';

export function proxy(request) {
    const { pathname } = request.nextUrl;

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Since Edge middleware cannot read localStorage directly (which the app currently uses),
    // we use a cookie-based check as a fallback exactly as requested.
    // NOTE: True auto-redirect is primarily handled via client-side useEffect hooks on the login/register pages.
    const userRole = request.cookies.get('userRole')?.value;

    if (userRole) {
        // If user is logged in via cookies, redirect away from public pages
        if (pathname === '/login' || pathname === '/' || pathname === '/internship/register' || pathname === '/internship') {
            return NextResponse.redirect(new URL(userRole === 'admin' ? '/admin' : '/dashboard', request.url));
        }
    } else {
        // Not logged in (by cookies)
        // The root page redirects to /login
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Block the old /internship landing page (only allow /internship/register)
        if (pathname === '/internship') {
            return NextResponse.redirect(new URL('/internship/register', request.url));
        }
    }

    // Block the old /developer route completely
    if (pathname.startsWith('/developer')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
