import { getProducts } from '@/actions/products'
import InventoryGrid from '@/components/admin/inventory/inventory-grid'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Inventory Parts | Cashcrow',
    description: 'Manage and track laboratory inventory with real-time stock levels and detailed part history.',
}

export default async function PartsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>
}) {
    const resolvedParams = await searchParams
    const page = parseInt(resolvedParams.page || '1', 10)
    const query = resolvedParams.q || ''
    const limit = 6

    const { products, count } = await getProducts(page, limit, query)
    const totalPages = Math.ceil(count / limit)

    return (
        <InventoryGrid
            products={products || []}
            totalCount={count || 0}
            currentPage={page}
            totalPages={totalPages}
            query={query}
        />
    )
}
