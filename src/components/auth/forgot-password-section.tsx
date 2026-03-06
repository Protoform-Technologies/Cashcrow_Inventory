'use client'

import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendResetPasswordEmail } from "@/actions/auth"
import Link from "next/link"

export default function ForgotPasswordSection() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const emailValue = formData.get('email') as string

        if (!emailValue) {
            setError('Please enter your email address.')
            return
        }

        setEmail(emailValue)

        startTransition(async () => {
            const result = await sendResetPasswordEmail(emailValue)
            if (result?.error) {
                setError(result.error)
            } else {
                setSuccess(true)
            }
        })
    }

    if (success) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--color-cashcrow-bg-light)]">
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-primary/5 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-[var(--color-cashcrow-primary)]/10 rounded-full flex items-center justify-center mb-8 mx-auto ring-8 ring-[var(--color-cashcrow-primary)]/5">
                        <Mail className="w-10 h-10 text-[var(--color-cashcrow-primary)]" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Check your inbox</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        We&apos;ve sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your email to continue.
                    </p>

                    <div className="space-y-4">
                        <Button
                            className="w-full py-6 group"
                            onClick={() => window.location.href = 'mailto:' + email}
                        >
                            Open Email App
                        </Button>
                        <p className="text-sm text-slate-400 font-medium">
                            Didn&apos;t receive the email?
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-[var(--color-cashcrow-primary)] font-bold hover:underline ml-1"
                            >
                                Try again
                            </button>
                        </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 italic">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-lightgreen)] transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--color-cashcrow-bg-light)]">
            <div className="w-full max-w-[440px]">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-primary/5 p-8 sm:p-10">
                    <div className="mb-10 text-center sm:text-left">
                        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Forgot Password?</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Enter your email address and we&apos;ll send you a link to reset your password.
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
                            <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="technician@cashcrow.lab"
                                icon={Mail}
                                required
                                disabled={isPending}
                                className="py-6"
                            />
                        </div>

                        <Button type="submit" className="w-full py-7 text-base font-black relative overflow-hidden group" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="relative z-10 flex items-center gap-2">
                                    Send Reset Link
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center italic">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-lightgreen)] transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center px-4">
                    <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-widest opacity-60">
                        Need help? Contact <span className="text-[var(--color-cashcrow-primary)]">support@cashcrow.lab</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

import { ArrowRight } from "lucide-react"
