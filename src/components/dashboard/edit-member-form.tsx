'use client'

import { useState } from "react"
import { updateMember } from "@/actions/members"
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Profile {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
}

interface EditMemberFormProps {
    member: Profile
    onSuccess: () => void
    onCancel: () => void
}

export default function EditMemberForm({ member, onSuccess, onCancel }: EditMemberFormProps) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        firstName: member.first_name,
        lastName: member.last_name,
        role: member.role,
        isActive: member.is_active
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccessMsg(null)

        if (!formData.firstName || !formData.lastName) {
            setError('Please provide all required fields.')
            return
        }

        setIsPending(true)
        
        const data = new FormData()
        data.append('firstName', formData.firstName)
        data.append('lastName', formData.lastName)
        data.append('role', formData.role)
        data.append('isActive', formData.isActive.toString())

        const result = await updateMember(member.id, data)
        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccessMsg('Member updated successfully!')
            setTimeout(() => {
                onSuccess()
            }, 1000)
        }
        setIsPending(false)
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
                <div className="bg-red-50 border text-red-600 border-red-200 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
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

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Sarah"
                        required
                        disabled={isPending}
                        className="h-12 text-base"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Jenkins"
                        required
                        disabled={isPending}
                        className="h-12 text-base"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <Input
                        value={member.email}
                        disabled
                        className="h-12 text-base bg-slate-50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role <span className="text-red-500">*</span></Label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        disabled={isPending}
                        className="w-full h-12 px-4 py-2 text-base bg-slate-50 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    >
                        <option value="MEMBER">Member (Edit Access)</option>
                        <option value="ADMIN">Admin (Full Access)</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t bg-white/80 backdrop-blur-sm">
                <Button 
                    type="button"
                    onClick={onCancel}
                    className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all text-sm"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <span>Save Changes</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

