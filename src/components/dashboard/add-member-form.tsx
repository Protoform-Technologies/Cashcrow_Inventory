'use client'

import { Mail, User, Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addMember } from "@/actions/members"

export default function AddMemberForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccessMsg(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const role = formData.get('role') as string
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string

        if (!email || !role || !firstName || !lastName) {
            setError('Please provide all required fields.')
            return
        }

        startTransition(async () => {
            const result = await addMember(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccessMsg(result.success)
                    ; (e.target as HTMLFormElement).reset() // Clear form fields
            }
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-8 md:p-10 w-full max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-8 text-left">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">Add New Member</h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                    Create an account for a new team member. They will receive an email with instructions to login with the default password <span className="text-[var(--color-cashcrow-primary)] font-bold">Cashcrow@123</span> and set their own password upon first login.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{successMsg}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            icon={User}
                            required
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            icon={User}
                            required
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@protoform.com"
                        icon={Mail}
                        required
                        disabled={isPending}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <select
                            id="role"
                            name="role"
                            required
                            disabled={isPending}
                            defaultValue=""
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[var(--color-cashcrow-primary)] focus:ring-1 focus:ring-[var(--color-cashcrow-primary)] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                        >
                            <option value="" disabled>Select a role...</option>
                            <option value="MEMBER">Member (Inventory viewing & logging)</option>
                            <option value="ADMIN">Admin (Full access)</option>
                        </select>
                    </div>
                </div>

                <Button type="submit" className="w-full py-7" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                        <>
                            <span>Add Member</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
