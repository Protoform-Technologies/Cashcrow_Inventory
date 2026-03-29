"use client"

import {
    LayoutDashboard,
    Package,
    PlusSquare,
    History,
    UserCircle,
    Settings,
    LogOut,
    Beaker,
    UserPlus,
    BarChart3,
    Truck,
    List
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/auth"

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Parts', icon: Package, href: '/admin/parts' },
    { name: 'Suppliers', icon: List, href: '/admin/suppliers' },
    { name: 'Add Suppliers', icon: Truck, href: '/admin/add-suppliers' },
    { name: 'Add Product', icon: PlusSquare, href: '/admin/add-product' },
    { name: 'Add Members', icon: UserPlus, href: '/admin/add-members' },

    // ✅ FIXED (use correct route from team)
    { name: 'Daily Log', icon: History, href: '/admin/daily-log' },

    // ✅ KEEP YOUR FEATURE
    { name: 'Reports', icon: BarChart3, href: '/reports' },
]

const accountItems = [
    { name: 'User Profile', icon: UserCircle, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '#' },
]

interface SidebarProps {
    role: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ role, isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()

    const isAdmin =
        role.toLowerCase().includes('admin') ||
        role.toLowerCase().includes('director')

    const dashboardHref = isAdmin ? '/admin' : '/member'

    return (
        <aside className={`w-64 border-r flex flex-col fixed h-full z-50 bg-[#265136] border-white/10 text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* LOGO */}
            <div className="p-6 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                        <Beaker className="w-6 h-6 text-[#d0e8d6]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl tracking-tight">Cashcrow</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#d0e8d6]/60 font-black">
                            Lab Inventory
                        </span>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto overflow-x-hidden">

                {navItems
                    .filter(item => isAdmin || item.name === 'Dashboard')
                    .map((item) => {

                        const href =
                            item.name === 'Dashboard'
                                ? dashboardHref
                                : item.href

                        const isActive = pathname === href

                        return (
                            <Link
                                key={item.name}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group duration-200 ${isActive
                                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                                    : "text-[#d0e8d6] hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive
                                        ? "text-white"
                                        : "text-[#d0e8d6]/70 group-hover:text-white"
                                        }`}
                                />
                                {item.name}
                            </Link>
                        )
                    })}

                {/* ACCOUNT SECTION */}
                <div className="pt-8 pb-2 px-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                        Account Management
                    </p>
                </div>

                {accountItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[#d0e8d6] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-all group"
                    >
                        <item.icon className="w-5 h-5 text-[#d0e8d6]/70 group-hover:text-white transition-transform group-hover:scale-110" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* LOGOUT */}
            <div className="p-6 border-t border-white/10">
                <button
                    onClick={async () => await logout()}
                    className="flex w-full items-center gap-3 px-4 py-3 text-[#d0e8d6] hover:bg-red-500/20 hover:text-red-300 rounded-xl font-medium transition-all group"
                >
                    <LogOut className="w-5 h-5 text-[#d0e8d6]/70 group-hover:text-red-300" />
                    Logout
                </button>
            </div>
        </aside>
    )
}