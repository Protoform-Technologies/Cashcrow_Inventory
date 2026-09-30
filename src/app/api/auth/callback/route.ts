import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Handles the redirect from Supabase auth emails (password recovery, invites).
// Exchanges the one-time `code` for a session (setting the auth cookies) and
// then forwards the user to the `next` destination.
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')

    // Only allow same-site relative redirects to avoid open-redirect abuse.
    const nextParam = searchParams.get('next') ?? '/reset-password'
    const next = nextParam.startsWith('/') ? nextParam : '/reset-password'

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.search = ''

    if (code) {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            redirectUrl.pathname = next
            return NextResponse.redirect(redirectUrl)
        }

        console.error('Auth callback error:', error.message)
    }

    // Missing/invalid code, or the exchange failed — send the user back to
    // request a fresh link rather than landing on a broken reset page.
    redirectUrl.pathname = '/forgot-password'
    redirectUrl.searchParams.set('error', 'auth_callback_failed')
    return NextResponse.redirect(redirectUrl)
}
