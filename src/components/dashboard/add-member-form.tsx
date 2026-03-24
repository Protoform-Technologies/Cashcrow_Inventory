'use client'

import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addMember } from "@/actions/members"

interface AddMemberFormProps {
    onSuccess?: () => void
}

export default function AddMemberForm({ onSuccess }: AddMemberFormProps) {
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
                ;(e.target as HTMLFormElement).reset()
                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess()
                }
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
            {successMsg && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{successMsg}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        placeholder="e.g. Sarah"
                        required
                        disabled={isPending}
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        placeholder="e.g. Jenkins"
                        required
                        disabled={isPending}
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="sarah.j@cashcrowlab.com"
                        required
                        disabled={isPending}
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                    <select
                        id="role"
                        name="role"
                        required
                        disabled={isPending}
                        defaultValue=""
                        className="w-full h-11 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:border-[var(--color-cashcrow-primary)] focus:ring-1 focus:ring-[var(--color-cashcrow-primary)] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="MEMBER">Member (Edit Access)</option>
                        <option value="ADMIN">Admin (Full Access)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white font-semibold py-2 px-8 rounded-lg transition-all shadow-md flex items-center gap-2" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Add Member</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

