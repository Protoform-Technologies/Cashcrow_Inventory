'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, Plus } from 'lucide-react'

interface ComboboxProps {
    value: string
    onChange: (value: string) => void
    /** Existing option names (plain strings). */
    options: string[]
    placeholder?: string
    className?: string
}

/**
 * A creatable single-select combobox that works with plain string values (names).
 * Visually consistent with FilterSelect: h-12 trigger, primary-green accents.
 * If the typed search doesn't match an existing option, the user can "create" it
 * by selecting the typed name (persistence happens on form submit).
 */
export default function Combobox({ value, onChange, options, placeholder = 'Select...', className = '' }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus()
    }, [isOpen])

    const trimmed = search.trim()
    const filtered = options.filter(opt => opt.toLowerCase().includes(trimmed.toLowerCase()))
    const exactMatch = options.some(opt => opt.toLowerCase() === trimmed.toLowerCase())
    const showCreate = trimmed.length > 0 && !exactMatch

    const select = (val: string) => {
        onChange(val)
        setIsOpen(false)
        setSearch('')
    }

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
                <span className={`truncate ${value ? 'text-slate-800' : 'text-slate-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top">
                    <div className="relative mb-1.5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search or type new..."
                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/15 focus:border-[var(--color-cashcrow-primary)] focus:bg-white outline-none transition-all"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                        {showCreate && (
                            <button
                                type="button"
                                onClick={() => select(trimmed)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/10 transition-colors"
                            >
                                <Plus className="w-4 h-4 shrink-0" />
                                <span className="flex-1 truncate">Add &quot;{trimmed}&quot;</span>
                            </button>
                        )}

                        {filtered.map(opt => {
                            const active = opt === value
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => select(opt)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors ${active
                                        ? 'bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)]'
                                        : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="flex-1 truncate">{opt}</span>
                                    {active && <Check className="w-4 h-4 shrink-0" />}
                                </button>
                            )
                        })}

                        {filtered.length === 0 && !showCreate && (
                            <div className="px-3 py-6 text-center text-sm font-medium text-slate-400">
                                No projects found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
