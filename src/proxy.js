import { NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/pre-production',
    '/production',
    '/post-production',
    '/fabric',
    '/yarn',
    '/sequence',
    '/people',
    '/vendor',
    '/tasks',
    '/profile',
    '/idea'
]

// Admin-only routes
const adminOnlyRoutes = [
    '/dashboard',
    '/pre-production',
    '/production',
    '/post-production',
    '/fabric',
    '/yarn',
    '/sequence',
    '/people',
    '/vendor',
    '/setting',
    '/idea'
]

// Routes accessible by non-admin users
const nonAdminAllowedRoutes = ['/tasks', '/profile']

// Auth routes
const authRoutes = ['/login']

export function proxy(request) {
    const token = request.cookies.get('token')?.value

    // Decode JWT (Edge compatible)
    let role = null
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1]
            const decoded = JSON.parse(atob(payloadBase64))
            role = decoded?.role ?? null
        } catch (e) {
            console.error('Failed to decode token:', e)
        }
    }

    const { pathname } = request.nextUrl

    // Route checks
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAdminOnlyRoute = adminOnlyRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isNonAdminRoute = nonAdminAllowedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    // 🚫 Not logged in → block protected routes
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ✅ Logged in → role-based logic
    if (token) {
        const isAdmin = role === 'admin'

        // =========================
        // 👤 NON-ADMIN LOGIC
        // =========================
        if (!isAdmin) {
            // ❌ Block admin-only routes
            if (isAdminOnlyRoute) {
                return NextResponse.redirect(new URL('/tasks', request.url))
            }

            // ❌ Prevent access to auth pages
            if (isAuthRoute) {
                return NextResponse.redirect(new URL('/tasks', request.url))
            }

            // ❌ Redirect root
            if (pathname === '/') {
                return NextResponse.redirect(new URL('/tasks', request.url))
            }
        }

        // =========================
        // 👑 ADMIN LOGIC
        // =========================
        if (isAdmin) {
            // ❌ Admin accessing non-admin routes (/tasks, /profile)
            if (!isAdminOnlyRoute && !isAuthRoute && pathname !== '/') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            // ❌ Prevent admin from login page
            if (isAuthRoute) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            // ❌ Redirect root
            if (pathname === '/') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
}