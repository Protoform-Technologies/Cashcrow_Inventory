import { createServerSupabaseClient } from "@/lib/supabase"

export async function getUserProfile() {
    const supabase = await createServerSupabaseClient()

    const { data: user } = await supabase.auth.getUser()

    if (!user?.user) return null

    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.user.email)
        .single()

    return data
}