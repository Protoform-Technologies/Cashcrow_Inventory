import { getMemberProfileOrRedirect } from '@/actions/auth'
import DashboardLayout from '@/components/shared/dashboard/layout'
import { getProducts } from '@/actions/products'
import PartsClient from '@/app/admin/parts/parts-client'

export default async function PartsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 9

    const profile = await getMemberProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`
    const resolvedSearchParams = searchParams as any
    const query = resolvedSearchParams.q
    const { products, count } = await getProducts(page, limit, query)
    const totalPages = Math.ceil(count / limit)

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Member" 
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            title="Inventory Parts"
        >
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
