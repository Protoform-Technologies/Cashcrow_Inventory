import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import SupplierDetailActions from './supplier-detail-actions'

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

interface SupplierDetailHeaderProps {
    supplier: Supplier
}

function getCategoryLabel(value: string) {
    const labels: Record<string, string> = {
        'logistics': 'Logistics',
        'manufacturing': 'Manufacturing',
        'it_services': 'IT Services',
        'office_supplies': 'Office Supplies',
        'electronics': 'Electronics',
        'other': 'Other'
    }
    return labels[value] || value
}

export default function SupplierDetailHeader({ supplier }: SupplierDetailHeaderProps) {
    const initial = supplier.company_name?.trim().charAt(0).toUpperCase() || '?'

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-bold">
                    <Link
                        href="/admin/suppliers"
                        className="text-slate-400 hover:text-[var(--color-cashcrow-primary)] transition-colors"
                    >
                        Suppliers
                    </Link>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    <span className="text-slate-700 truncate max-w-[160px] sm:max-w-[280px]">{supplier.company_name}</span>
                </nav>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center shrink-0">
                        <span className="text-[var(--color-cashcrow-primary)] font-black text-xl">{initial}</span>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight break-words leading-tight">{supplier.company_name}</h1>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold mt-1 bg-slate-100 text-slate-600">
                            {getCategoryLabel(supplier.category)}
                        </span>
                    </div>
                </div>
            </div>

            <SupplierDetailActions supplier={supplier} />
        </div>
    )
}
