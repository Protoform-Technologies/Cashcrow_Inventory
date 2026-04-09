"use client"

import Link from 'next/link'
import { PlusCircle, HandMetal } from "lucide-react"

interface WelcomeBannerProps {
    firstName: string
    today: string
    role: 'ADMIN' | 'MEMBER'
    logPath: string
    isLogSubmitted: boolean
}

export default function WelcomeBanner({ 
    firstName, 
    today, 
    role, 
    logPath,
    isLogSubmitted 
}: WelcomeBannerProps) {
    
    // If log is already submitted, hide the banner as requested
    if (isLogSubmitted) return null

    const isPrimary = role === 'ADMIN'
    const colorClass = isPrimary ? 'var(--color-cashcrow-primary)' : 'var(--color-cashcrow-lightgreen)'
    const bgOpacityClass = isPrimary ? 'bg-[var(--color-cashcrow-primary)]/10' : 'bg-[var(--color-cashcrow-lightgreen)]/10'
    const shadowClass = isPrimary ? 'shadow-[var(--color-cashcrow-primary)]/20' : 'shadow-[var(--color-cashcrow-lightgreen)]/20'
    const hoverBgClass = isPrimary ? 'hover:bg-[var(--color-cashcrow-lightgreen)]' : 'hover:bg-[var(--color-cashcrow-primary)]'

    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden gap-6 md:gap-0 mt-2">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.02] rounded-full -mr-16 -mt-16`} style={{ backgroundColor: colorClass }}></div>

            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 text-center sm:text-left">
                <div className={`w-16 h-16 rounded-2xl ${bgOpacityClass} flex items-center justify-center shadow-inner border border-black/5 shrink-0`} style={{ color: colorClass }}>
                    <HandMetal className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Welcome back, {firstName}</h2>
                    <p className="text-slate-500 text-sm md:text-base font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                        Inventory overview for <span style={{ color: colorClass }}>{today}</span>
                    </p>
                </div>
            </div>

            <Link 
                href={logPath} 
                className={`w-full sm:w-auto text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group relative z-10 ${hoverBgClass} ${shadowClass}`}
                style={{ backgroundColor: colorClass }}
            >
                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Today&apos;s Log
            </Link>
        </div>
    )
}
