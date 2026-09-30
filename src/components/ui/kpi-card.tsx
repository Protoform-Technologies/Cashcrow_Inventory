import * as React from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

export type KPITone = 'primary' | 'info' | 'warning' | 'danger'

// One place that controls the icon-chip + badge colour per tone, so every KPI
// card looks consistent (same icon size, same chip, same badge treatment).
const toneStyles: Record<KPITone, string> = {
    primary: "bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)]",
    info: "bg-blue-50 text-blue-600",
    warning: "bg-orange-50 text-orange-600",
    danger: "bg-red-50 text-red-600",
}

export interface KPICardProps {
    label: string
    value: string | number
    icon: LucideIcon
    tone?: KPITone
    /** Small pill in the top-right, e.g. "Attention" / "This week". */
    badge?: string
    subtext?: string
    /** If provided, the whole card becomes a link. */
    href?: string
    /** Override the value text style (defaults to text-3xl). Use for text values. */
    valueClassName?: string
}

export function KPICard({
    label,
    value,
    icon: Icon,
    tone = 'primary',
    badge,
    subtext,
    href,
    valueClassName,
}: KPICardProps) {
    const content = (
        <>
            <div className="flex justify-between items-start mb-5">
                <div className={`p-2 rounded-xl ${toneStyles[tone]} group-hover:scale-110 transition-transform`}>
                    {/* Fixed icon size — the single source of icon consistency for KPIs. */}
                    <Icon className="w-5 h-5" />
                </div>
                {badge && (
                    <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${toneStyles[tone]}`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-sm font-semibold tracking-tight">{label}</p>
            <h3 className={`font-bold mt-1 text-slate-900 ${valueClassName ?? 'text-3xl'}`}>{value}</h3>
            {subtext && <p className="text-[11px] text-slate-400 mt-2 font-medium">{subtext}</p>}
        </>
    )

    const cardClass =
        "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group block"

    return href ? (
        <Link href={href} className={cardClass}>
            {content}
        </Link>
    ) : (
        <div className={cardClass}>{content}</div>
    )
}
