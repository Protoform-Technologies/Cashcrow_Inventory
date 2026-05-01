'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, X, Package, Plus } from 'lucide-react'

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
    creatable?: boolean
    className?: string
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    error,
    disabled,
    creatable,
    className = ''
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedOption = options.find(opt => opt.id === value) || (creatable && value ? { id: 'custom', name: value } : null)

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
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all text-left group ${isOpen
                    ? 'border-emerald-600 ring-8 ring-emerald-600/5 bg-white shadow-xl'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md'
                    } ${error ? 'border-rose-400 ring-rose-50' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`size-11 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 transition-all shadow-sm ${selectedOption ? 'ring-4 ring-slate-100' : 'bg-slate-50'}`}>
                        {selectedOption && 'image_url' in selectedOption && selectedOption.image_url ? (
                            <img src={selectedOption.image_url} alt={selectedOption.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className={`size-5 transition-colors ${selectedOption ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                        {selectedOption ? (
                            <>
                                <span className="text-sm font-black text-slate-900 leading-tight break-words">
                                    {selectedOption.name}
                                </span>
                                {('sub' in selectedOption && selectedOption.sub) && (
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 break-words opacity-70">
                                        {selectedOption.sub}
                                    </span>
                                )}
                                {selectedOption.id === 'custom' && (
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none mt-1.5 flex items-center gap-1">
                                        <div className="size-1 rounded-full bg-amber-500" />
                                        Guest Entry
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors">
                                {placeholder}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {selectedOption && !disabled && (
                        <div
                            onClick={clearSelection}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all active:scale-90"
                        >
                            <X className="size-4" />
                        </div>
                    )}
                    <div className={`p-1 rounded-lg transition-colors ${isOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                        <ChevronDown className={`size-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top p-2">
                    {/* Search Input */}
                    <div className="p-2 mb-2 sticky top-0 bg-white z-10">
                        <div className="relative group/search">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within/search:text-emerald-600 transition-colors" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full pl-11 pr-5 py-4 bg-slate-50/50 border border-slate-100 focus:ring-8 focus:ring-emerald-600/5 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-black placeholder:text-slate-400 transition-all outline-none"
                                placeholder={creatable ? "Search or type new name..." : "Filter options..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && creatable && search && filteredOptions.length === 0) {
                                        handleSelect({ id: search, name: search })
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[384px] overflow-y-auto px-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-left transition-all group/opt ${option.id === value
                                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                        : 'hover:bg-slate-50 text-slate-700 active:bg-slate-100'
                                        }`}
                                >
                                    <div className={`size-11 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-all group-hover/opt:scale-105 ${option.id === value ? 'ring-4 ring-emerald-600/10' : ''}`}>
                                        {'image_url' in option && option.image_url ? (
                                            <img src={option.image_url} alt={option.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className={`size-5 transition-colors ${option.id === value ? 'text-emerald-600' : 'text-slate-300'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className={`text-sm font-black transition-colors break-words ${option.id === value ? 'text-emerald-900' : 'text-slate-900'}`}>{option.name}</p>
                                        {'sub' in option && option.sub && (
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 break-words opacity-70">{option.sub}</p>
                                        )}
                                    </div>
                                    {option.id === value && (
                                        <div className="size-7 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-in zoom-in duration-500">
                                            <Check className="size-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : creatable && search ? (
                            <button
                                type="button"
                                onClick={() => handleSelect({ id: search, name: search })}
                                className="w-full flex items-center gap-4 p-5 hover:bg-amber-50/50 rounded-[2rem] border border-transparent hover:border-amber-100 transition-all group"
                            >
                                <div className="size-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Plus className="size-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900 tracking-tight">Add &quot;{search}&quot;</p>
                                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-1">Initialize as New Provider</p>
                                </div>
                            </button>
                        ) : (
                            <div className="py-16 px-10 text-center bg-slate-50/50 rounded-[2rem] mx-1 my-1 border border-slate-100/50">
                                <div className="size-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                    <Search className="size-8 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">No results matched</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose max-w-[200px] mx-auto">
                                    Try adjusting your search filters or add a new entry
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

