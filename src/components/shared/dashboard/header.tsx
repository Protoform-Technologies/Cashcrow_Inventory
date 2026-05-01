"use client"

import {
    Search, Bell, Menu, X, Loader2, Package, Truck, ArrowRight
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { globalSearch } from "@/actions/dashboard"
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllAsRead, 
    deleteNotification 
} from "@/actions/notifications"
import Link from "next/link"

interface HeaderProps {
    title: string
    userName: string
    userRole: string
    userId: string
    avatarUrl?: string
    onMenuClick: () => void
}

export default function Header({ title, userName, userRole, userId, avatarUrl, onMenuClick }: HeaderProps) {

    const router = useRouter()

    // 🔍 SEARCH STATES
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 🔔 NOTIFICATION STATES
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const notificationRef = useRef<HTMLDivElement>(null)

    // 📱 MOBILE SEARCH STATE
    const [showMobileSearch, setShowMobileSearch] = useState(false)

    // FETCH NOTIFICATIONS
    useEffect(() => {
        if (!userId || userId === "") return;
        
        async function fetchNotifs() {
            try {
                const data = await getNotifications(userRole, userId) 
                setNotifications(data || [])
            } catch (err) {
                console.error("Failed to fetch notifications:", err)
            }
        }
        fetchNotifs()
        const interval = setInterval(fetchNotifs, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [userRole, userId])

    const unreadCount = notifications.filter(n => !n.is_read).length

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        await markNotificationAsRead(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    const handleMarkAllRead = async () => {
        await markAllAsRead(userRole, userId)
        setNotifications([])
    }

    const handleDeleteNotif = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        await deleteNotification(id)
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const isAdmin = userRole.toLowerCase().includes('director') || userRole.toLowerCase().includes('admin');
    const displayedRole = isAdmin ? 'Admin' : 'Member';
    const roleColor = isAdmin ? 'text-emerald-600' : 'text-blue-600';

    // 👤 INITIALS
    const initials = userName
        ?.split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()

    // CLOSE DROPDOWNS OUTSIDE CLICK
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
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

        const rolePath = isAdmin ? 'admin' : 'member';
        
        if (item.type === 'product') {
            router.push(`/${rolePath}/parts/${item.id}`)
        } else {
            router.push(`/${rolePath}/suppliers?q=${encodeURIComponent(item.name)}`)
        }
    }

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 w-full max-w-full">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-2 md:gap-4 flex-none shrink-0">
                <button onClick={onMenuClick} className="p-2 lg:hidden shrink-0">
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="hidden sm:block text-sm md:text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis sm:max-w-none">
                    {title}
                </h1>
            </div>

            {/* RIGHT SECTION: Relocated Search next to Notifications */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end px-2 sm:px-0">
                
                {/* SEARCH COMPONENT (Relocated to Right) */}
                <div className={`relative flex-1 max-w-xs transition-all duration-300 ${showMobileSearch ? 'block' : 'hidden lg:block'}`}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 pr-8 py-1.5 border rounded-lg text-xs w-full bg-slate-50 focus:bg-white transition-all ring-0 border-slate-200 focus:border-emerald-500/50"
                        placeholder="Search inventory..."
                        autoFocus={showMobileSearch}
                    />
                    
                    {(query || showMobileSearch) && (
                        <button 
                            onClick={() => {setShowMobileSearch(false); setQuery('')}}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}

                    {/* SEARCH DROPDOWN - Fixed positioning on mobile to prevent clipping */}
                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className="fixed sm:absolute top-16 sm:top-full left-4 sm:left-0 right-4 sm:right-auto mt-2 sm:w-[400px] bg-white border rounded-xl shadow-2xl z-40 overflow-hidden"
                        >
                            {isSearching ? (
                                <div className="p-6 flex justify-center">
                                    <Loader2 className="animate-spin text-[#265136]" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="max-h-[70vh] overflow-y-auto">
                                    {results.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleResultClick(item)}
                                            className="p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                                        >
                                            <div className={`p-1 w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border ${item.type === 'product' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {item.type === 'product' ? (
                                                    item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                                    ) : <Package size={18} />
                                                ) : <Truck size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{item.sub}</p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <Search className="mx-auto w-8 h-8 opacity-20 mb-2" />
                                    <p className="text-sm">No results found for &quot;{query}&quot;</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Search Toggle Icon */}
                {!showMobileSearch && (
                    <button 
                        onClick={() => setShowMobileSearch(true)}
                        className="p-2 lg:hidden text-slate-600 shrink-0 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}

                {/* 🔔 NOTIFICATIONS - z-index is 50 */}
                <div className="relative z-50" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 relative hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Bell className="w-5 h-5 text-slate-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="fixed sm:absolute top-16 sm:top-full left-4 sm:left-auto right-4 sm:right-0 mt-3 sm:w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0">
                                <p className="font-bold text-slate-800">Notifications</p>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllRead}
                                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => {
                                                setShowNotifications(false);
                                                router.push(n.link || '/admin');
                                                markNotificationAsRead(n.id);
                                            }}
                                            className={`p-4 border-b border-slate-50 last:border-0 cursor-pointer transition-all hover:bg-slate-50 relative group flex gap-3 ${!n.is_read ? 'bg-emerald-50/30' : ''}`}
                                        >
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.is_read ? 'font-bold' : 'font-medium'} text-slate-800`}>{n.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                    {new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteNotif(n.id, e)}
                                                className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-all text-rose-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-slate-400">
                                        <Bell className="mx-auto w-8 h-8 opacity-20 mb-2" />
                                        <p className="text-sm">Stay tuned! Notifications will appear here.</p>
                                    </div>
                                )}
                            </div>
                            
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-slate-50 text-center bg-slate-50/50">
                                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                                        View All Activity
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* USER PROFILE */}
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{userName}</p>
                        <p className={`text-[10px] ${roleColor} font-bold uppercase tracking-wider`}>{displayedRole}</p>
                    </div>

                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center font-bold overflow-hidden border border-slate-100">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt={userName} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            initials
                        )}
                    </div>
                </div>

            </div>
        </header>
    )
}