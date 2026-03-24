import { createClient } from "@/lib/supabase/server"

export async function getUserProfile() {
    const supabase = createClient()

    const { data: user } = await supabase.auth.getUser()

    if (!user?.user) return null

    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.user.email)
        .single()

    return data
}