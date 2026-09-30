'use server'

import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

/**
 * Returns a list of existing project names (ordered A-Z).
 * Fails gracefully (returns []) if the projects table doesn't exist yet.
 */
export async function getProjects(): Promise<string[]> {
    try {
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase
            .from('projects')
            .select('name')
            .order('name', { ascending: true })

        if (error) {
            console.error('getProjects error:', error.message)
            return []
        }

        return (data || []).map(row => row.name as string)
    } catch (e) {
        console.error('getProjects unexpected error:', e)
        return []
    }
}

/**
 * Look up a project by name (case-insensitive), inserting it if missing.
 * Handles the unique-constraint race by re-selecting on conflict.
 * Returns the project id, or null on failure.
 */
export async function getOrCreateProjectId(name: string): Promise<string | null> {
    const trimmed = name.trim()
    if (!trimmed) return null

    try {
        const admin = getSupabaseAdmin()

        // 1. Try to find an existing project (case-insensitive).
        const { data: existing, error: selectError } = await admin
            .from('projects')
            .select('id')
            .ilike('name', trimmed)
            .maybeSingle()

        if (selectError) {
            console.error('getOrCreateProjectId select error:', selectError.message)
            return null
        }
        if (existing?.id) return existing.id as string

        // 2. Insert a new project.
        const { data: inserted, error: insertError } = await admin
            .from('projects')
            .insert({ name: trimmed })
            .select('id')
            .single()

        if (insertError) {
            // Likely a unique-constraint race — re-select and return the winner.
            const { data: retry } = await admin
                .from('projects')
                .select('id')
                .ilike('name', trimmed)
                .maybeSingle()
            if (retry?.id) return retry.id as string

            console.error('getOrCreateProjectId insert error:', insertError.message)
            return null
        }

        return inserted?.id as string
    } catch (e) {
        console.error('getOrCreateProjectId unexpected error:', e)
        return null
    }
}
