"use client"

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HandMetal } from "lucide-react"
import { buttonStyles } from "@/components/ui/button"

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
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Conditional-by-day: once today's log is submitted, the banner disappears.
    if (isLogSubmitted) return null

    const isPrimary = role === 'ADMIN'
    const accent = isPrimary ? 'var(--color-cashcrow-primary)' : 'var(--color-cashcrow-lightgreen)'
    const iconBgClass = isPrimary ? 'bg-[var(--color-cashcrow-primary)]/10' : 'bg-[var(--color-cashcrow-lightgreen)]/10'

    // Admin's `primary` variant is already correct; member swaps the colour pair.
    // Trailing `!` (Tailwind v4 important) guarantees the override wins.
    const memberColorOverride = isPrimary
        ? ''
        : 'bg-[var(--color-cashcrow-lightgreen)]! hover:bg-[var(--color-cashcrow-primary)]!'

    const handleCreateLog = () => {
        // Client-side navigation stays smooth (no full reload); the destination
        // page fades/slides in via `animate-in` for the transition effect.
        startTransition(() => router.push(logPath))
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden gap-4 md:gap-0">
            <div className="absolute top-0 right-0 w-32 h-16 opacity-[0.02] rounded-full -mr-16 -mt-16" style={{ backgroundColor: accent }}></div>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 relative z-10 text-center sm:text-left">
                <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center shadow-inner border border-black/5 shrink-0`} style={{ color: accent }}>
                    <HandMetal className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Welcome back, {firstName}</h2>
                    <p className="text-slate-500 text-xs md:text-sm font-semibold tracking-wide flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                        Inventory overview for <span style={{ color: accent }}>{today}</span>
                    </p>
                </div>
            </div>

            <button
                onClick={handleCreateLog}
                disabled={isPending}
                className={buttonStyles({
                    variant: 'primary',
                    size: 'md',
                    className: `w-full sm:w-auto group relative z-10 ${memberColorOverride}`,
                })}
            >
                Create Today&apos;s Log
            </button>
        </div>
    )
}
