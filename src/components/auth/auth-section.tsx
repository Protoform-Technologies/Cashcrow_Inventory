'use client'

import { Mail, Lock, Eye, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { login } from "@/actions/auth"
import Image from "next/image"
import Link from "next/link"

export default function AuthSection() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            setError('Please enter both email and password.')
            return
        }

        startTransition(async () => {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--color-cashcrow-bg-light)]">
            <div className="w-full max-w-[440px]">

                {/* Mobile Branding */}
                <div className="lg:hidden flex flex-col items-center justify-center mb-4">
                    <div className="relative w-48 h-16 mb-2">
                        <Image
                            src="/Cashcrow_Logo_Mobile.png"
                            alt="Cashcrow Logo"
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <span className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Protoform Technologies</span>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-slate-900 text-3xl font-bold mb-2">Welcome back </h1>
                    <p className="text-[var(--color-cashcrow-textmuted)]">Please enter your credentials to access your dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Error Feedback */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@protoform.com"
                            icon={Mail}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <Label htmlFor="password">Password</Label>
                            <Link className="text-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-lightgreen)] text-sm font-semibold transition-colors" href="/forgot-password">Forgot Password?</Link>
                        </div>
                        <div className="relative group">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                icon={Lock}
                                required
                                className="pr-12"
                                disabled={isPending}
                            />
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-cashcrow-textmuted)] hover:text-[var(--color-cashcrow-primary)] transition-colors"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isPending}
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full relative py-6" disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <>
                                <span>Login to Dashboard</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </form>

                <footer className="mt-16 text-center">
                    <p className="text-[11px] uppercase tracking-widest text-[var(--color-cashcrow-textmuted)]/50 font-bold">
                        Powered by Protoform Technologies
                    </p>
                </footer>
            </div >
        </div >
    )
}
