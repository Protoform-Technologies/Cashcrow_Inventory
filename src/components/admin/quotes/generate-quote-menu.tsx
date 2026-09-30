'use client'

import { FilePlus, Building2 } from 'lucide-react'
import DropdownMenu from '@/components/ui/dropdown-menu'
import { RFQ_VERTICALS } from '@/config/rfq-config'
import { toast } from 'sonner'

/**
 * Top-right "Generate Quote" split button. Opens a dropdown of verticals
 * (Cashcrow / Protoform) sourced from RFQ_VERTICALS.
 *
 * Phase 1 (read-only registry): the vertical items are wired but the creation
 * flow does not exist yet, so selecting one surfaces a toast. Phase 2 will route
 * to /admin/quotes/new?vertical=<value> to open the creation form.
 */
export default function GenerateQuoteMenu() {
    const items = RFQ_VERTICALS.map((v) => ({
        label: v.label,
        icon: Building2,
        onClick: () => {
            toast.info(`${v.label} quote creation is coming soon.`)
        },
    }))

    return (
        <DropdownMenu
            label="Generate Quote"
            icon={FilePlus}
            items={items}
            align="right"
            triggerClassName="flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap"
        />
    )
}
