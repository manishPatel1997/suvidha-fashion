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
    '/idea',
    '/sketches',
    '/setting'
]

// Map routes to module names in token
const routeToModuleMap = {
    '/pre-production': 'pre_production',
    '/production': 'production',
    '/post-production': 'post_production',
    '/fabric': 'fabric',
    '/yarn': 'yarn',
    '/sequence': 'sequence',
    '/people': 'user',
    '/vendor': 'vendor',
    '/setting': 'setting',
    '/tasks': 'task',
    '/idea': 'ideas',
    '/sketches': 'sketches'
}

// Auth routes
const authRoutes = ['/login']

export function proxy(request) {
    const token = request.cookies.get('token')?.value

    // Decode JWT (Edge compatible)
    let role = null
    let moduleAccess = []
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1]
            const decoded = JSON.parse(atob(payloadBase64))
            role = decoded?.role ?? null
            console.log('role', role)
            if (decoded?.module_access) {
                moduleAccess = decoded.module_access.split(',')
            }
        } catch (e) {
            console.error('Failed to decode token:', e)
        }
    }

    const { pathname } = request.nextUrl

    // Route checks
    const isProtectedRoute = protectedRoutes.some(route =>
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

    // ✅ Logged in → logic
    if (token) {
        const defaultPath = (role && role.toLowerCase() === 'admin') ? '/dashboard' : '/profile';

        // ❌ Prevent access to auth pages if already logged in
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(defaultPath, request.url))
        }

        // ❌ Redirect root to defaultPath
        if (pathname === '/') {
            return NextResponse.redirect(new URL(defaultPath, request.url))
        }

        // ❌ Prevent non-admins from accessing dashboard
        if (pathname.startsWith('/dashboard') && (!role || role.toLowerCase() !== 'admin')) {
            return NextResponse.redirect(new URL('/profile', request.url))
        }

        // =========================
        // 🔒 MODULE ACCESS CHECK
        // =========================
        let requiredModule = null;
        for (const [route, moduleName] of Object.entries(routeToModuleMap)) {
            if (pathname.startsWith(route)) {
                requiredModule = moduleName;
                break;
            }
        }

        // If the route requires a specific module, check if the user has access
        if (requiredModule && !moduleAccess.includes(requiredModule)) {
            const fallbackPath = (role && role.toLowerCase() === 'admin') ? '/dashboard' : '/profile';
            return NextResponse.redirect(new URL(fallbackPath, request.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
}