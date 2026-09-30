'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface DropdownItem {
    label: string
    icon?: LucideIcon
    onClick: () => void
    danger?: boolean
}

interface DropdownMenuProps {
    label: string
    icon?: LucideIcon
    items: DropdownItem[]
    /** Classes for the trigger button (so callers keep their own button styling). */
    triggerClassName?: string
    align?: 'left' | 'right'
}

/**
 * A reusable action-menu dropdown (a button that opens a menu of actions).
 * Menu styling matches the design system's FilterSelect. Use for action menus;
 * use FilterSelect for value selection.
 */
export default function DropdownMenu({ label, icon: Icon, items, triggerClassName = '', align = 'left' }: DropdownMenuProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(o => !o)} className={triggerClassName}>
                {Icon && <Icon className="w-4 h-4" />}
                {label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className={`absolute top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top ${align === 'right' ? 'right-0' : 'left-0'}`}>
                    {items.map((item, i) => {
                        const ItemIcon = item.icon
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { item.onClick(); setOpen(false) }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                {ItemIcon && <ItemIcon className={`w-4 h-4 shrink-0 ${item.danger ? 'text-red-500' : 'text-[var(--color-cashcrow-primary)]'}`} />}
                                <span className="flex-1 truncate">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
