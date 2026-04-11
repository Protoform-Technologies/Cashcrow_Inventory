'use client'

import { useState } from 'react'
import { 
    Building2, 
    User,
    Settings,
    CreditCard,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { addSupplier } from '@/actions/suppliers.actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AddSupplierForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus(null)

        const formData = new FormData(e.currentTarget)
        const result = await addSupplier(formData)

        if (result.error) {
            setStatus({ type: 'error', message: result.error })
        } else {
            setStatus({ type: 'success', message: 'Supplier added successfully!' })
            setTimeout(() => {
                router.push('/admin/suppliers')
                router.refresh()
            }, 1500)
        }
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-semibold">{status.message}</p>
                </div>
            )}

            {/* Section 1: General Information */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        General Information
                    </h2>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="company_name"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="e.g. Global Logistics Inc."
                            required
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Website
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-medium">
                                https://
                            </span>
                            <input
                                name="website"
                                className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 pl-16 pr-4 py-3 transition-all outline-none"
                                placeholder="www.company.com"
                                type="text"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Contact Details */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Contact Details
                    </h2>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Primary Contact Name
                        </label>
                        <input
                            name="contact_name"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="John Doe"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Email Address
                        </label>
                        <input
                            name="email"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="john@company.com"
                            type="email"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="+91 98765 43210"
                            type="tel"
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Operational Information */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        Operational Information
                    </h2>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Lead Time (Days)
                        </label>
                        <input
                            name="lead_time"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="7"
                            type="number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Payment Terms <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payment_terms"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none appearance-none"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select Terms</option>
                            <option value="immediate">Immediate</option>
                            <option value="net15">Net 15</option>
                            <option value="net30">Net 30</option>
                            <option value="cod">COD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none appearance-none"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Consumables">Consumables</option>
                            <option value="Lab Equipment">Lab Equipment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 4: Billing Information */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Billing Information
                    </h2>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            GST Number
                        </label>
                        <input
                            name="gst_no"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="GSTIN"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Bank Account
                        </label>
                        <input
                            name="bank_account"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="Account Number"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            IFSC Code
                        </label>
                        <input
                            name="ifsc"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="IFSC Code"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Bank Branch
                        </label>
                        <input
                            name="branch"
                            className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 px-4 py-3 transition-all outline-none"
                            placeholder="Branch Name"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-8 h-12 rounded-xl border-slate-200 font-bold uppercase tracking-widest text-xs"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Supplier
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
