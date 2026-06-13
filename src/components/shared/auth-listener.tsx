'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthListener({ userId }: { userId: string }) {
    useEffect(() => {
        if (!userId) return

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Poll the user's auth state every 3 seconds.
        // This guarantees we instantly catch the server-side force_logout flag
        // even if Postgres Realtime is disabled on the profiles table.
        const intervalId = setInterval(async () => {
            const { data: { user }, error } = await supabase.auth.getUser()

            // If the user's app_metadata was flagged for force_logout by an admin,
            // or if their session is no longer valid, hard reload the page.
            if (user?.app_metadata?.force_logout || error) {
                window.location.href = window.location.pathname
            }
        }, 2000)

        return () => clearInterval(intervalId)
    }, [userId])

    return null
}
