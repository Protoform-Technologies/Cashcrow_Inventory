'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface FilterOption {
    id: string
    label: string
    icon?: LucideIcon
}

interface FilterSelectProps {
    value: string
    options: FilterOption[]
    onChange: (id: string) => void
    className?: string
    /** Shown (muted) when `value` matches no option — e.g. "Select Category". */
    placeholder?: string
}

/**
 * A lightweight single-select dropdown for toolbar filters (no search, no clear).
 * Matches the design system: h-12 trigger, primary-green accents, subtle menu.
 * Reusable across the app wherever a simple filter/select is needed.
 */
export default function FilterSelect({ value, options, onChange, className = '', placeholder }: FilterSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const matched = options.find(o => o.id === value)
    // With a placeholder, show it (muted) when nothing is matched; otherwise fall
    // back to the first option (the filter-toolbar behaviour).
    const selected = matched ?? (placeholder ? undefined : options[0])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const SelectedIcon = selected?.icon

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                className={`w-full h-12 flex items-center justify-between gap-2 px-4 rounded-xl border bg-white text-left text-sm font-semibold transition-all ${isOpen
                    ? 'border-[var(--color-cashcrow-primary)] ring-2 ring-[var(--color-cashcrow-primary)]/15'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
            >
                <span className="flex items-center gap-2 min-w-0">
                    {SelectedIcon && <SelectedIcon className="w-4 h-4 text-[var(--color-cashcrow-primary)] shrink-0" />}
                    <span className={`truncate ${selected ? 'text-slate-800' : 'text-slate-400'}`}>
                        {selected ? selected.label : placeholder}
                    </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top">
                    {options.map(opt => {
                        const Icon = opt.icon
                        const active = opt.id === value
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => { onChange(opt.id); setIsOpen(false) }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors ${active
                                    ? 'bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)]'
                                    : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {Icon && <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--color-cashcrow-primary)]' : 'text-slate-400'}`} />}
                                <span className="flex-1 truncate">{opt.label}</span>
                                {active && <Check className="w-4 h-4 shrink-0" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
