import { NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/pre-production']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login']

export function proxy(request) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the current path is an auth route (login, register, etc.)
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname) // Save intended destination
        return NextResponse.redirect(loginUrl)
    }

    // If already authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If already authenticated and visiting non-protected routes (like root "/"), redirect to dashboard
    if (!isProtectedRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
}
