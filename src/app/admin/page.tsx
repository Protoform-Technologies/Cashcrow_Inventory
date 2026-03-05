import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from '@/actions/auth'

export default async function AdminPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role?.toUpperCase() !== 'ADMIN') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-[var(--color-cashcrow-bg-light)] flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-[var(--color-cashcrow-accent)] max-w-md w-full text-center">
                <div className="bg-[var(--color-cashcrow-primary)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    A
                </div>
                <h1 className="text-3xl font-extrabold text-[var(--color-cashcrow-primary)] mb-2">Admin Dashboard</h1>
                <p className="text-[var(--color-cashcrow-textmuted)] mb-8 font-medium">Protoform Technologies Management Portal</p>

                <div className="space-y-4 text-left mb-10">
                    <div className="p-4 bg-[var(--color-cashcrow-secondary)] rounded-xl border border-[var(--color-cashcrow-accent)]">
                        <p className="text-xs uppercase tracking-widest text-[var(--color-cashcrow-textmuted)] font-bold mb-1">Name</p>
                        <p className="text-[var(--color-cashcrow-primary)] font-semibold text-lg">
                            {profile.first_name} {profile.last_name}
                        </p>
                    </div>
                    <div className="p-4 bg-[var(--color-cashcrow-secondary)] rounded-xl border border-[var(--color-cashcrow-accent)]">
                        <p className="text-xs uppercase tracking-widest text-[var(--color-cashcrow-textmuted)] font-bold mb-1">Email</p>
                        <p className="text-[var(--color-cashcrow-primary)] font-semibold text-lg">{profile.email}</p>
                    </div>
                    <div className="p-4 bg-[var(--color-cashcrow-accent)] rounded-xl border border-[var(--color-cashcrow-primary)]/10">
                        <p className="text-xs uppercase tracking-widest text-[var(--color-cashcrow-primary)]/60 font-bold mb-1">Current Role</p>
                        <p className="text-[var(--color-cashcrow-primary)] font-black text-xl tracking-tight">{profile.role}</p>
                    </div>
                </div>

                <form action={logout}>
                    <Button variant="outline" className="w-full py-6">
                        Log Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
