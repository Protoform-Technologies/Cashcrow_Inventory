'use client'

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

interface DashboardLayoutProps {
    children: React.ReactNode
    userName: string
    userRole: string
    title?: string
}

export default function DashboardLayout({ children, userName, userRole, title = "Dashboard" }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[var(--color-cashcrow-bg-light)]">
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar role={userRole} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                <Header
                    title={title}
                    userName={userName}
                    userRole={userRole}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="p-4 md:p-8 space-y-8 flex-1 w-full max-w-[1600px] overflow-hidden">
                    {children}
                </div>

                <footer className="px-8 py-6 border-t border-slate-200 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-slate-400 font-bold">
                        Powered by Protoform Technologies • Cashcrow Lab Inventory v1.0
                    </p>
                </footer>
            </main>
        </div>
    )
}
