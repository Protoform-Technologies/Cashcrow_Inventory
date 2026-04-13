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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-bold ml-1">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="firstName"
                        name="firstName"
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
                        placeholder="e.g. Jenkins"
                        required
                        disabled={isPending}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#265136] focus:ring-[#265136]/10 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="sarah.j@cashcrowlab.com"
                        required
                        disabled={isPending}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#265136] focus:ring-[#265136]/10 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-700 font-bold ml-1">Access Role <span className="text-red-500">*</span></Label>
                    <select
                        id="role"
                        name="role"
                        required
                        disabled={isPending}
                        defaultValue=""
                        className="w-full h-12 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#265136] focus:ring-1 focus:ring-[#265136] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    >
                        <option value="" disabled>Select access level</option>
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                <Button 
                    type="submit" 
                    className="bg-[#265136] hover:bg-[#1f422b] text-white font-bold h-12 px-10 rounded-full transition-all shadow-lg shadow-[#265136]/10 flex items-center gap-3 active:scale-95 group w-full sm:w-auto" 
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Add to Team</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

