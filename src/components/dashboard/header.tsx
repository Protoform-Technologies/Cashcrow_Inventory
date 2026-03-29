"use client"

import {
    Search, Bell, Menu, X, Loader2, Package, Truck, ArrowRight
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { globalSearch } from "@/actions/dashboard"

interface HeaderProps {
    title: string
    userName: string
    userRole: string
    onMenuClick: () => void
}

export default function Header({ title, userName, userRole, onMenuClick }: HeaderProps) {

    const router = useRouter()

    // 🔍 SEARCH STATES
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 🔔 NOTIFICATION STATES
    const [showNotifications, setShowNotifications] = useState(false)
    const notifications = [
        "New inventory item added",
        "Low stock alert",
        "System backup completed"
    ]

    // 👤 INITIALS
    const initials = userName
        ?.split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()

    // CLOSE DROPDOWN OUTSIDE CLICK
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // 🔍 SEARCH API CALL
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setShowDropdown(false)
            return
        }

        const timeout = setTimeout(async () => {
            setIsSearching(true)
            setShowDropdown(true)

            try {
                const data = await globalSearch(query)
                setResults(data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [query])

    const handleResultClick = (item: any) => {
        setShowDropdown(false)
        setQuery('')

        const path = item.type === 'product'
            ? '/admin/parts'
            : '/admin/suppliers'

        router.push(`${path}?q=${item.name}`)
    }

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">

            {/* LEFT */}
            <div className="flex items-center gap-4">

                <button onClick={onMenuClick} className="p-2 lg:hidden">
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-lg font-bold">{title}</h1>

                {/* SEARCH */}
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-xl text-sm"
                        placeholder="Search inventory..."
                    />

                    {/* DROPDOWN */}
                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full mt-2 w-96 bg-white border rounded-xl shadow-lg z-50"
                        >
                            {isSearching ? (
                                <div className="p-4 flex justify-center">
                                    <Loader2 className="animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                results.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleResultClick(item)}
                                        className="p-3 hover:bg-gray-50 cursor-pointer flex gap-3"
                                    >
                                        {item.type === 'product'
                                            ? <Package />
                                            : <Truck />}
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.sub}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-sm text-gray-400">
                                    No results
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* 🔔 NOTIFICATIONS */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-3">
                            <p className="font-semibold mb-2">Notifications</p>

                            {notifications.map((n, i) => (
                                <div key={i} className="text-sm py-1">
                                    {n}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* USER */}
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{initials}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>

                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center font-bold">
                        {initials}
                    </div>
                </div>

            </div>
        </header>
    )
}