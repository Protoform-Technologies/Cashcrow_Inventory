import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Read + verify the session JWT. getClaims() verifies the token LOCALLY when
    // the project uses asymmetric JWT signing keys (no network round-trip per
    // request). It still refreshes an expired token via getSession() (writing new
    // cookies through setAll above), and only falls back to a network getUser()
    // for the legacy symmetric secret — so this is safe regardless of key type,
    // and fast when asymmetric keys are enabled.
    const { data: claimsData } = await supabase.auth.getClaims()
    const claims = claimsData?.claims
    const appMetadata = claims?.app_metadata

    // 1. Instant Logout for Forced Logouts
    if (claims && appMetadata?.force_logout === true) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Protected Routes Logic
    const isLoginPage = request.nextUrl.pathname === '/'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isMemberRoute = request.nextUrl.pathname.startsWith('/member')

    if (claims) {
        // Use the cached role from the token if available
        const role = appMetadata?.role?.toUpperCase() || null

        // If logged in and tries to access login page, redirect to dashboard
        if (isLoginPage) {
            if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
            if (role === 'MEMBER') return NextResponse.redirect(new URL('/member', request.url))

            // Fallback to DB query ONLY if metadata is missing
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', claims.sub)
                .single()

            const dbRole = profile?.role?.toUpperCase()
            if (dbRole === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
            if (dbRole === 'MEMBER') return NextResponse.redirect(new URL('/member', request.url))
        }

        // Additional role-based route protection
        if ((isAdminRoute || isMemberRoute) && appMetadata?.is_active === false) {
            // Inactive (new) users should be on the reset-password page. Redirect
            // to login, which auto-forwards them to reset-password.
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (isAdminRoute && role !== 'ADMIN' && role !== null) {
            return NextResponse.redirect(new URL('/member', request.url))
        }
        if (isMemberRoute && role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    } else {
        // Not logged in and trying to access protected routes → login
        if (isAdminRoute || isMemberRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/', '/admin/:path*', '/member/:path*'],
}
