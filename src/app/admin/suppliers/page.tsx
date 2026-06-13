import { getSuppliers } from '@/actions/suppliers'
import SuppliersView from '@/components/admin/suppliers/suppliers-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Suppliers | Cashcrow',
    description: 'Manage and track your inventory source partners from the suppliers command center.',
}

export default async function SuppliersPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 6
    const query = searchParams.q
    const { suppliers, count } = await getSuppliers(page, limit, query)
    const totalPages = Math.ceil(count / limit)

    return (
        <>
            <SuppliersView
                suppliers={suppliers || []}
                totalCount={count || 0}
                currentPage={page}
                totalPages={totalPages}
            />
        </>
    )
}
