'use client'

import { Building2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import SupplierCard from './supplier-card'

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
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
    created_at: string
}

interface SuppliersGridProps {
    suppliers: Supplier[]
    searchQuery: string
    onSupplierClick: (supplier: Supplier) => void
}

export default function SuppliersGrid({ suppliers, searchQuery, onSupplierClick }: SuppliersGridProps) {
    if (suppliers.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner mx-auto">
                    <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No suppliers found</h3>
                <p className="text-slate-500 max-w-sm mb-6 mx-auto">
                    {searchQuery ? 'No suppliers match your search criteria.' : "You haven't added any suppliers yet."}
                </p>
                {!searchQuery && (
                    <Link href="/admin/add-suppliers" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-slate-200">
                        <PlusCircle className="w-4 h-4" />
                        Add First Supplier
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map(supplier => (
                <SupplierCard 
                    key={supplier.id} 
                    supplier={supplier}
                    onClick={() => onSupplierClick(supplier)}
                />
            ))}
        </div>
    )
}
