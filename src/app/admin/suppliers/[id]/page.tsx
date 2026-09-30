import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getAdminProfileOrRedirect } from '@/actions/auth'
import { getSupplierById, getSupplierProducts } from '@/actions/suppliers'
import SupplierDetailHeader from '@/components/admin/suppliers/supplier-detail-header'
import SupplierDetailStats from '@/components/admin/suppliers/supplier-detail-stats'
import SupplierDetailInfo from '@/components/admin/suppliers/supplier-detail-info'
import SupplierDetailProducts from '@/components/admin/suppliers/supplier-detail-products'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const supplier = await getSupplierById(id)
    return {
        title: supplier ? `${supplier.company_name} | Cashcrow` : 'Supplier Detail | Cashcrow',
        description: supplier ? `Supplier details and products supplied by ${supplier.company_name}.` : 'View supplier details.',
    }
}

export default async function SupplierDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params

    await getAdminProfileOrRedirect()
    const supplier = await getSupplierById(id)

    if (!supplier) {
        notFound()
    }

    const products = await getSupplierProducts(supplier.company_name)

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* 1. Header with Title & Actions */}
            <SupplierDetailHeader supplier={supplier} />

            {/* 2. KPI Cards */}
            <SupplierDetailStats supplier={supplier} />

            {/* 3. Contact & Billing Info Grid */}
            <SupplierDetailInfo supplier={supplier} />

            {/* 4. Products Supplied */}
            <SupplierDetailProducts products={products} />
        </div>
    )
}
