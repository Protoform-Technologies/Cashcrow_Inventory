<<<<<<< HEAD
"use client"

import { Search, Bell, User, Menu } from "lucide-react"
import { useState } from "react"
=======
import { Search, Bell, User, Menu, X, Loader2, Package, Truck, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { globalSearch } from "@/actions/dashboard"
>>>>>>> 035d27b3603d29cd2529a197c8d1249b1d79d13b

interface HeaderProps {
    title: string
    userName: string
    userRole: string
    onMenuClick: () => void
}

export default function Header({ title, userName, userRole, onMenuClick }: HeaderProps) {
<<<<<<< HEAD

    const [showNotifications, setShowNotifications] = useState(false)

    const notifications = [
        "New inventory item added",
        "Low stock alert",
        "System backup completed"
    ]

    const initials = userName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm/5">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-2 md:gap-8">

                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-lg md:text-xl font-bold text-slate-800">
                    {title}
                </h1>
=======
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch global search results
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setShowDropdown(false)
            return
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true)
            setShowDropdown(true)
            try {
                const data = await globalSearch(query)
                setResults(data || [])
            } catch (err) {
                console.error("Global search failed:", err)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query])

    // Focus mobile search input when opened
    useEffect(() => {
        if (isMobileSearchOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isMobileSearchOpen])

    const handleResultClick = (item: any) => {
        // First hide everything to ensure clean state
        setShowDropdown(false)
        setIsMobileSearchOpen(false)
        setQuery('')
        
        const path = item.type === 'product' ? '/admin/parts' : '/admin/suppliers'
        const params = new URLSearchParams()
        params.set('q', item.name)
        
        // Use window.location as a fallback if router is inconsistent on mobile, or just use router.push
        router.push(`${path}?${params.toString()}`)
    }

    const renderResultsDropdown = () => {
        if (!showDropdown || !query.trim()) return null

        return (
            <div 
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 md:w-[450px]"
            >
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Search Results</span>
                    {isSearching && <Loader2 className="w-3 h-3 text-[var(--color-cashcrow-primary)] animate-spin" />}
                </div>

                <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto p-2 space-y-1">
                    {results.length > 0 ? (
                        results.map((item) => (
                            <div
                                key={`${item.type}-${item.id}`}
                                onClick={() => handleResultClick(item)}
                                className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-3 group cursor-pointer"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    item.type === 'product' 
                                    ? 'bg-slate-100 text-slate-400 group-hover:bg-[var(--color-cashcrow-primary)]/10 group-hover:text-[var(--color-cashcrow-primary)]' 
                                    : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                }`}>
                                    {item.type === 'product' ? <Package className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center gap-2 mb-0.5">
                                        <p className="font-bold text-slate-800 group-hover:text-[var(--color-cashcrow-primary)] transition-colors text-sm truncate">
                                            {item.name}
                                        </p>
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest shrink-0">{item.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[11px] text-slate-400 font-medium truncate">{item.sub}</p>
                                        {item.type === 'product' && (
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                                                item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                                                item.status === 'Low Stock' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {item.info}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
                            </div>
                        ))
                    ) : !isSearching ? (
                        <div className="p-8 text-center text-slate-400">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">No results for "{query}"</p>
                        </div>
                    ) : null}
                </div>
                
                {results.length > 0 && (
                    <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Select a result to view details</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm/5">
            <div className={`flex items-center gap-2 md:gap-8 ${isMobileSearchOpen ? 'w-full' : ''}`}>
                
                {/* Mobile View: Search Toggle and Back */}
                {!isMobileSearchOpen ? (
                    <>
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={onMenuClick}
                            className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[150px] md:max-w-none">
                            {title}
                        </h1>

                        {/* Mobile Search Icon Toggle */}
                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="p-2 lg:hidden text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 ml-auto"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center w-full gap-2 pr-2 relative">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    setShowDropdown(true)
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-cashcrow-primary)] focus:border-transparent transition-all outline-none"
                                placeholder="Search inventory..."
                                type="text"
                                onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                            />
                            {renderResultsDropdown()}
                        </div>
                        <button 
                            onClick={() => {
                                setIsMobileSearchOpen(false)
                                setQuery('')
                                setShowDropdown(false)
                            }}
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}
>>>>>>> 035d27b3603d29cd2529a197c8d1249b1d79d13b

                {/* Desktop Search Bar */}
                <div className="relative w-96 hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
<<<<<<< HEAD
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
                        placeholder="Search SKU, item name, or category..."
=======
                        value={query || ''}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setShowDropdown(true)
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-cashcrow-primary)] focus:border-transparent transition-all outline-none font-medium"
                        placeholder="Quick search inventory..."
>>>>>>> 035d27b3603d29cd2529a197c8d1249b1d79d13b
                        type="text"
                        onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                        onFocus={() => query.trim() && setShowDropdown(true)}
                    />
                    {renderResultsDropdown()}
                </div>
            </div>

<<<<<<< HEAD
            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
=======
            {/* User Actions - Hide on mobile if search is open to save space */}
            <div className={`flex items-center gap-2 md:gap-4 ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                <button className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative group border border-transparent hover:border-slate-200">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
>>>>>>> 035d27b3603d29cd2529a197c8d1249b1d79d13b

                {/* 🔔 NOTIFICATION BUTTON */}
                <div className="relative">

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* DROPDOWN */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl shadow-lg p-3 z-50">
                            <p className="text-sm font-semibold mb-2">Notifications</p>

                            {notifications.map((note, index) => (
                                <div
                                    key={index}
                                    className="text-sm text-slate-600 py-2 border-b last:border-none"
                                >
                                    {note}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

                {/* USER */}
                <div className="flex items-center gap-3">

                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{initials}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{userRole}</p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold">
                        {initials}
                    </div>

                </div>

            </div>

        </header>
    )
}