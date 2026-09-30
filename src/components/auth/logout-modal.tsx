"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"

interface LogoutModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold mb-2 text-center">Confirm Logout</h3>
                <p className="text-slate-500 text-center mb-6">Are you sure you want to sign out of your account?</p>
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isLoggingOut}
                        className="flex-1 py-2.5 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={async () => {
                            setIsLoggingOut(true)
                            const supabase = createBrowserSupabaseClient()
                            await supabase.auth.signOut()
                            router.push('/')
                            router.refresh()
                        }}
                        disabled={isLoggingOut}
                        className="flex-1 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoggingOut ? (
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Logout"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
