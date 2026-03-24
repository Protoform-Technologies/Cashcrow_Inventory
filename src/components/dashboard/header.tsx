"use client"

import { Search, Bell, User, Menu } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
    title: string
    userName: string
    userRole: string
    onMenuClick: () => void
}

export default function Header({ title, userName, userRole, onMenuClick }: HeaderProps) {

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

                <div className="relative w-96 hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
                        placeholder="Search SKU, item name, or category..."
                        type="text"
                    />
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

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