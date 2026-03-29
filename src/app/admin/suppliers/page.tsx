import { getAdminProfileOrRedirect } from '@/actions/auth'
import DashboardLayout from '@/components/dashboard/layout'
import { getSuppliers } from '@/actions/suppliers'
import SuppliersClient from './suppliers-client'

export default async function SuppliersPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 6

    const profile = await getAdminProfileOrRedirect()
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

