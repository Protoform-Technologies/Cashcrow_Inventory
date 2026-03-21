import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import { getProducts } from '@/actions/products'
import PartsClient from './parts-client'

export default async function PartsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 9

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
    const { products, count } = await getProducts(page, limit, query)
    const totalPages = Math.ceil(count / limit)

    return (
        <DashboardLayout userName={fullName} userRole="Lab Admin" title="Inventory Parts">
            <PartsClient 
                products={products || []} 
                totalCount={count || 0}
                currentPage={page}
                totalPages={totalPages}
                userName={fullName}
            />
        </DashboardLayout>
    )
}
