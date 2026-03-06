import { Search, Bell, User, Menu } from "lucide-react"

interface HeaderProps {
    title: string
    userName: string
    userRole: string
    onMenuClick: () => void
}

export default function Header({ title, userName, userRole, onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm/5">
            <div className="flex items-center gap-2 md:gap-8">

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

                <div className="relative w-96 hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-cashcrow-primary)] focus:border-transparent transition-all outline-none"
                        placeholder="Search SKU, item name, or category..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative group border border-transparent hover:border-slate-200">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 md:h-8 w-[1px] bg-slate-200 mx-1 md:mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{userName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">{userRole}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden ring-2 ring-[var(--color-cashcrow-primary)]/10 shadow-md">
                        <User className="w-full h-full p-1.5 md:p-2 bg-slate-100 text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    )
}
