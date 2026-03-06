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

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Logic
    const isLoginPage = request.nextUrl.pathname === '/'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isMemberRoute = request.nextUrl.pathname.startsWith('/member')

    if (user) {

        // If user is logged in and tries to access login page, redirect to dashboard
        if (isLoginPage) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role?.toUpperCase()
            if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
            if (role === 'MEMBER') return NextResponse.redirect(new URL('/member', request.url))
        }

        // Basic role check (can be enhanced further if needed)
        // If they are logged in but on the wrong dashboard, we could handle that here
    } else {
        // If user is NOT logged in and tries to access protected routes, redirect to login
        if (isAdminRoute || isMemberRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/', '/admin/:path*', '/member/:path*'],
}
