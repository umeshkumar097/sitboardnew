import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';

    // Verify token
    let session = null;
    if (token) {
        try {
            const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
            session = payload;
        } catch (e) {
            // Invalid token
        }
    }

    // If on login page and logged in -> dashboard
    if (isLoginPage && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If on protected route and not logged in -> login
    if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Legacy /admin route protection (optional, can be removed if not used)
    if (request.nextUrl.pathname.startsWith('/admin') && !session) {
        const adminToken = request.cookies.get('admin_token')?.value;
        if (!adminToken) {
            // return NextResponse.redirect(new URL('/admin/login', request.url));
            // For now, let's redirect to our new login for consistency if they try to access old admin
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/admin/:path*'],
};
