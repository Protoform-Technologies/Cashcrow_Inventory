import React from 'react'
import { notFound } from 'next/navigation'
import { getMemberProfileOrRedirect } from '@/actions/auth'
import { fetchProductById } from '@/lib/inventory'
import { getProductFullHistory } from '@/actions/day-logs'
import ProductDetailHeader from '@/components/shared/inventory/product-detail-header'
import ProductDetailStats from '@/components/shared/inventory/product-detail-stats'
import ProductDetailHistory from '@/components/shared/inventory/product-detail-history'
import ProductDetailSidebar from '@/components/shared/inventory/product-detail-sidebar'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await fetchProductById(id)
    return {
        title: product ? `${product.name} | Cashcrow Lab` : 'Product Detail | Cashcrow Lab',
        description: product ? `Detailed inventory statistics and history for ${product.name}.` : 'View product details.'
    }
}

export default async function ProductDetailPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ p?: string }> }) {
    const { id } = await props.params
    const searchParams = await props.searchParams
    const page = parseInt(searchParams.p || '1', 10)
    const limit = 7

    const profile = await getMemberProfileOrRedirect()
    const product = await fetchProductById(id)
    const fullName = `${profile.first_name} ${profile.last_name}`

    if (!product) {
        notFound()
    }

    const { logs, total } = await getProductFullHistory(id, page, limit)

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">

            {/* 1. Header with Title (Actions hidden for Members) */}
            <ProductDetailHeader
                product={product}
                basePath="/member/parts"
                logs={logs}
                userName={fullName}
                isAdmin={false}
            />

            {/* 2. Central Statistics Grid */}
            <ProductDetailStats product={product} />

            {/* 3. Main Content Grid (Suppliers/DS first on Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <ProductDetailSidebar product={product} isAdmin={false} />
                </div>
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <ProductDetailHistory
                        product={product}
                        logs={logs}
                        totalItems={total}
                        currentPage={page}
                        isAdmin={false}
                    />
                </div>
            </div>
        </div>
    )
}
