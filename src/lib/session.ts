import { cache } from 'react'
import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

/**
 * Request-scoped session helpers.
 *
 * `getUser()` makes a network round-trip to Supabase to validate the JWT, and it
 * was being called many times per page render (middleware → layout → page →
 * actions), stacking latency. React's `cache()` memoizes per request, so no
 * matter how many server-side callers ask for the user/profile during a single
 * render, we hit the network at most once. Security is unchanged — the token is
 * still validated server-side, just once instead of N times.
 *
 * NOTE: this file intentionally has no 'use server' directive so it can export
 * cached (non-action) helpers. Import it from server components and actions.
 */

// Validates the current JWT with Supabase. At most one /auth/v1/user call per request.
export const getCurrentUser = cache(async () => {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
})

// Loads a profile row via the service-role client. At most one query per (request, userId).
export const getCurrentProfile = cache(async (userId: string) => {
    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    return profile
})
