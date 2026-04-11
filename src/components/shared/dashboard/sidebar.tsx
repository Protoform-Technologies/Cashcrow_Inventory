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
    List,
    FileText
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/auth"

const adminNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Parts', icon: Package, href: '/admin/parts' },
    { name: 'Suppliers', icon: List, href: '/admin/suppliers' },
    { name: 'Quotes', icon: FileText, href: '/admin/quotes' },
    { name: 'Add Suppliers', icon: Truck, href: '/admin/add-suppliers' },
    { name: 'Add Product', icon: PlusSquare, href: '/admin/add-product' },
    { name: 'Add Members', icon: UserPlus, href: '/admin/add-members' },
    { name: 'Daily Log', icon: History, href: '/admin/daily-log' },
    { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
]

const memberMainNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/member' },
    { name: 'Parts', icon: Package, href: '/member/parts' },
    { name: 'Daily Log', icon: History, href: '/member/daily-log' },
]

const accountItems = [
    { name: 'User Profile', icon: UserCircle, href: '/profile' },
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
        <aside className={`w-64 border-r flex flex-col fixed h-full z-[60] bg-[#265136] border-white/10 text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* LOGO */}
            <div className="pt-3 pb-4 px-6 flex items-center justify-center border-b border-white/5 mx-2">
                <div className="relative w-full h-24">
                    <Image
                        src="/Cashcrow_Logo_Branding.png"
                        alt="Cashcrow Logo"
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 240px"
                    />
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden">

                {(isAdmin ? adminNavItems : memberMainNavItems)
                    .map((item) => {
                        const href = item.name === 'Dashboard' ? dashboardHref : item.href
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

                <Link
                    href={isAdmin ? "/admin/profile" : "/member/profile"}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group duration-200 ${pathname.includes("/profile")
                        ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                        : "text-[#d0e8d6] hover:bg-white/5 hover:text-white"
                        }`}
                >
                    <UserCircle className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${pathname.includes("/profile") ? "text-white" : "text-[#d0e8d6]/70 group-hover:text-white"
                        }`} />
                    User Profile
                </Link>

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