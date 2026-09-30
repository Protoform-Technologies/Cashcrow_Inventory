import React from 'react'
import { User, Mail, Phone, Globe, FileText, Landmark, Hash, MapPin, Wallet, type LucideIcon } from 'lucide-react'
import CopyButton from '@/components/ui/copy-button'

interface Supplier {
    contact_name: string | null
    email: string | null
    phone: string | null
    website: string | null
    gst_no: string | null
    bank_account: string | null
    ifsc: string | null
    branch: string | null
    payment_id: string | null
}

interface SupplierDetailInfoProps {
    supplier: Supplier
}

interface FieldCardProps {
    icon: LucideIcon
    label: string
    value: string | null
    href?: string | null
    mono?: boolean
}

function FieldCard({ icon: Icon, label, value, href, mono }: FieldCardProps) {
    const hasValue = Boolean(value && value.trim())
    const valueClass = `text-sm font-semibold break-words ${mono ? 'font-mono' : ''} ${hasValue ? 'text-slate-900' : 'text-slate-400'}`

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)]">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</span>
                </div>
                {hasValue && <CopyButton value={value!.trim()} label={label} />}
            </div>
            {hasValue && href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[var(--color-cashcrow-primary)] hover:underline break-all block"
                >
                    {value}
                </a>
            ) : (
                <p className={valueClass}>{hasValue ? value : 'Not specified'}</p>
            )}
        </div>
    )
}

export default function SupplierDetailInfo({ supplier }: SupplierDetailInfoProps) {
    const websiteHref = supplier.website
        ? (supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`)
        : null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldCard icon={User} label="Contact Person" value={supplier.contact_name} />
            <FieldCard icon={Mail} label="Email" value={supplier.email} href={supplier.email ? `mailto:${supplier.email}` : null} />
            <FieldCard icon={Phone} label="Phone" value={supplier.phone} />
            <FieldCard icon={Globe} label="Website" value={supplier.website} href={websiteHref} />
            <FieldCard icon={FileText} label="GST No" value={supplier.gst_no} mono />
            <FieldCard icon={Landmark} label="Bank Account" value={supplier.bank_account} mono />
            <FieldCard icon={Hash} label="IFSC" value={supplier.ifsc} mono />
            <FieldCard icon={MapPin} label="Branch" value={supplier.branch} />
            <FieldCard icon={Wallet} label="Payment ID" value={supplier.payment_id} mono />
        </div>
    )
}
