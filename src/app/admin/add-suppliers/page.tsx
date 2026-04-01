import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import AddSuppliersClient from './add-suppliers-client'

interface Supplier {
    id: string
    company_name: string
    website: string | null
    contact_name: string | null
    email: string | null
    phone: string | null
    lead_time: number
    payment_terms: string
    category: string
    created_at: string
}

export default async function AddSuppliersPage() {
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

    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch suppliers from the database
    const { data: suppliers } = await adminClient
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Lab Admin" 
            avatarUrl={profile.avatar_url}
            title="Add Suppliers"
        >
            <AddSuppliersClient userName={fullName} suppliers={suppliers || []} />
        </DashboardLayout>
    )
}

