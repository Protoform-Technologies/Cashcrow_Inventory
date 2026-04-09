'use client'

import { Lock, Eye, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/actions/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function ResetPasswordSection() {
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!password || !confirmPassword) {
            setError('Please fill in all fields.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        startTransition(async () => {
            const result = await updatePassword(password)
            if (result?.error) {
                setError(result.error)
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            }
        })
    }

    if (success) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--color-cashcrow-bg-light)]">
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Password Updated</h2>
                    <p className="text-slate-500 mb-8 font-medium">
                        Your password has been successfully reset. Redirecting you to the login page...
                    </p>
                    <Link href="/" className="text-[var(--color-cashcrow-primary)] font-bold hover:underline">
                        Click here if not redirected
                    </Link>
                </div>
            </div>
        )
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
                    <h1 className="text-slate-900 text-3xl font-bold mb-2">Setup New Password</h1>
                    <p className="text-[var(--color-cashcrow-textmuted)]">
                        Please choose a strong password that you haven&apos;t used before.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            icon={Lock}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <Button type="submit" className="w-full relative py-6" disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <>
                                <span>Update Password</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/">
                        <Button variant="secondary" className="w-full py-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </Link>
                </div>

                <footer className="mt-16 text-center">
                    <p className="text-[11px] uppercase tracking-widest text-[var(--color-cashcrow-textmuted)]/50 font-bold">
                        Powered by Protoform Technologies
                    </p>
                </footer>
            </div>
        </div>
    )
}
