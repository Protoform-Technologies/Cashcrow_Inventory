import React from 'react'
import { Clock, CreditCard, Tags } from 'lucide-react'
import { KPICard, type KPICardProps } from '@/components/ui/kpi-card'

interface Supplier {
    lead_time: number
    payment_terms: string
    category: string
}

interface SupplierDetailStatsProps {
    supplier: Supplier
}

function getPaymentTermsLabel(value: string) {
    const labels: Record<string, string> = {
        'immediate': 'Immediate',
        'net15': 'Net 15',
        'net30': 'Net 30',
        'net45': 'Net 45',
        'net60': 'Net 60',
        'net90': 'Net 90',
        'cod': 'COD',
        'due_on_receipt': 'Due on Receipt'
    }
    return labels[value] || value || 'N/A'
}

function getLeadTimeStatus(days: number) {
    if (days <= 5) return { label: 'Fast Delivery', tone: 'primary' as const }
    if (days <= 10) return { label: 'Standard', tone: 'info' as const }
    return { label: 'Slow Turnaround', tone: 'warning' as const }
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
    return labels[value] || value || 'N/A'
}

export default function SupplierDetailStats({ supplier }: SupplierDetailStatsProps) {
    const leadStatus = getLeadTimeStatus(supplier.lead_time || 0)

    const cards: KPICardProps[] = [
        {
            label: 'Lead Time',
            value: `${supplier.lead_time} Days`,
            icon: Clock,
            tone: leadStatus.tone,
            badge: leadStatus.label,
            subtext: 'Estimated delivery window',
        },
        {
            label: 'Payment Terms',
            value: getPaymentTermsLabel(supplier.payment_terms),
            icon: CreditCard,
            tone: 'info',
            subtext: 'Billing arrangement',
            valueClassName: 'text-lg truncate',
        },
        {
            label: 'Category',
            value: getCategoryLabel(supplier.category),
            icon: Tags,
            tone: 'primary',
            subtext: 'Supplier category',
            valueClassName: 'text-lg truncate',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card, idx) => (
                <KPICard key={idx} {...card} />
            ))}
        </div>
    )
}
