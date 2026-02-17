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
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Role-Based Access Control
        const role = session.role;
        const path = request.nextUrl.pathname;

        // 1. Super Admin Only Routes
        if (
            (path.startsWith('/dashboard/companies') ||
                path.startsWith('/dashboard/users') ||     // Global Users
                path.startsWith('/dashboard/admin')) &&    // Admin specific
            role !== 'super_admin'
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // 2. Company Admin Only Routes (Agents should not see these)
        if (
            (path.startsWith('/dashboard/billing') ||
                path.startsWith('/dashboard/agents') ||
                path.startsWith('/dashboard/settings') ||
                path.startsWith('/dashboard/projects')) && // Projects usually for Admin/Agent, but distinct
            role === 'agent'
        ) {
            // Agents might need Projects read-only? For now blocking based on plan.
            // If Agents need Projects, remove that check. 
            // But based on Sidebar, Agents only see Leads.
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // 3. Billing is strictly Company Admin (Super Admin doesn't pay, Agents don't pay)
        // Actually Super Admin might want to debug billing but typically they manage companies.
        // Let's keep it strict for now: Company Admin.
        if (path.startsWith('/dashboard/billing') && role !== 'company_admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
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

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/admin/:path*'],
};
