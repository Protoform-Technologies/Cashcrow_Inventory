import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import { getSuppliers } from '@/actions/suppliers'
import SuppliersClient from './suppliers-client'

export default async function SuppliersPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 6

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
    const resolvedSearchParams = searchParams as any
    const query = resolvedSearchParams.q
    const { suppliers, count } = await getSuppliers(page, limit, query)
    const totalPages = Math.ceil(count / limit)

    return (
        <DashboardLayout userName={fullName} userRole="Lab Admin" title="Suppliers">
            <SuppliersClient 
                suppliers={suppliers || []} 
                totalCount={count || 0}
                currentPage={page}
                totalPages={totalPages}
                userName={fullName}
            />
        </DashboardLayout>
    )
}

