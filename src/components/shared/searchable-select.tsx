'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, X, Package } from 'lucide-react'

export interface Option {
    id: string
    name: string
    sub?: string
    image_url?: string | null
}

interface SearchableSelectProps {
    options: Option[]
    value: string
    onChange: (id: string, name: string) => void
    placeholder?: string
    error?: boolean
    disabled?: boolean
    className?: string
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    error,
    disabled,
    className = ''
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedOption = options.find(opt => opt.id === value)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase()) ||
        (opt.sub && opt.sub.toLowerCase().includes(search.toLowerCase()))
    )

    const handleSelect = (option: Option) => {
        onChange(option.id, option.name)
        setIsOpen(false)
        setSearch('')
    }

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('', '')
        setSearch('')
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            {/* Display Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all text-left group ${isOpen
                        ? 'border-[var(--color-cashcrow-primary)] ring-4 ring-[var(--color-cashcrow-primary)]/10 bg-white shadow-lg'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                    } ${error ? 'border-rose-400 ring-rose-50' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 transition-all ${selectedOption ? 'ring-2 ring-slate-100' : 'bg-slate-100'}`}>
                        {selectedOption?.image_url ? (
                            <img src={selectedOption.image_url} alt={selectedOption.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className={`w-4 h-4 ${selectedOption ? 'text-slate-400' : 'text-slate-300'}`} />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        {selectedOption ? (
                            <>
                                <span className="text-sm font-bold text-slate-900 truncate leading-tight">
                                    {selectedOption.name}
                                </span>
                                {selectedOption.sub && (
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate leading-none mt-0.5">
                                        {selectedOption.sub}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-sm font-semibold text-slate-400 truncate">
                                {placeholder}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {selectedOption && !disabled && (
                        <div 
                            onClick={clearSelection}
                            className="p-1 rounded-md hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all active:scale-90"
                        >
                            <X className="w-3.5 h-3.5" />
                        </div>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-cashcrow-primary)]' : 'group-hover:text-slate-600'}`} />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                    {/* Search Input */}
                    <div className="p-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-xl text-sm font-bold placeholder:text-slate-400 transition-all"
                                placeholder="Filter options..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options List - Height tuned for ~8 items */}
                    <div className="max-h-[440px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group/opt ${option.id === value
                                            ? 'bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)] shadow-sm'
                                            : 'hover:bg-slate-50 text-slate-700 active:bg-slate-100'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/opt:scale-105">
                                        {option.image_url ? (
                                            <img src={option.image_url} alt={option.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className={`w-5 h-5 ${option.id === value ? 'text-[var(--color-cashcrow-primary)]' : 'text-slate-300'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-black truncate transition-colors ${option.id === value ? 'text-[var(--color-cashcrow-primary)]' : 'text-slate-900'}`}>{option.name}</p>
                                        {option.sub && (
                                            <p className="text-[10px] text-slate-400 font-black truncate uppercase tracking-widest mt-0.5">{option.sub}</p>
                                        )}
                                    </div>
                                    {option.id === value && (
                                        <div className="size-6 rounded-full bg-[var(--color-cashcrow-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-cashcrow-primary)]/20 animate-in zoom-in duration-300">
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="p-10 text-center bg-slate-50/50 rounded-2xl mx-1 my-1">
                                <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">
                                    No findings for<br />
                                    <span className="text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm inline-block mt-2 font-black">
                                        &quot;{search}&quot;
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

