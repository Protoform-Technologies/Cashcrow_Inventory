import { useState } from "react"
import { updateMember, deleteMember } from "@/actions/members"
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
            }, 800)
        }
        setIsPending(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-semibold">{error}</p>
                </div>
            )}
            {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="font-semibold">{successMsg}</p>
                </div>
            )}

            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-slate-700 font-bold ml-1">First Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="e.g. Sarah"
                            required
                            disabled={isPending}
                            className="h-12 rounded-xl border-slate-200 focus:border-[#265136] focus:ring-[#265136]/10 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-slate-700 font-bold ml-1">Last Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="e.g. Jenkins"
                            required
                            disabled={isPending}
                            className="h-12 rounded-xl border-slate-200 focus:border-[#265136] focus:ring-[#265136]/10 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">Email Address</Label>
                    <Input
                        value={member.email}
                        disabled
                        className="h-12 rounded-xl border-slate-100 bg-slate-50 text-slate-500 font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-700 font-bold ml-1">Access Role <span className="text-red-500">*</span></Label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        disabled={isPending}
                        className="w-full h-12 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#265136] focus:ring-1 focus:ring-[#265136] outline-none transition-all font-medium text-slate-700"
                    >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <Button 
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="w-full sm:flex-1 bg-[#265136] text-white font-bold h-12 rounded-full transition-all active:scale-95"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full sm:flex-1 bg-[#265136] text-white font-bold h-12 rounded-full transition-all shadow-lg shadow-[#265136]/10 flex items-center justify-center gap-3 active:scale-95 group"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Save Changes</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

