'use client'

import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendResetPasswordEmail } from "@/actions/auth"
import Link from "next/link"
import Image from "next/image"

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

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <Link href="/">
                            <Button variant="secondary" className="w-full py-6">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                        </Link>
                    </div>
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
                    <h1 className="text-slate-900 text-3xl font-bold mb-2">Forgot Password?</h1>
                    <p className="text-[var(--color-cashcrow-textmuted)]">
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

                    <Button type="submit" className="w-full relative py-6" disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <>
                                <span>Send Reset Link</span>
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

import { ArrowRight } from "lucide-react"
