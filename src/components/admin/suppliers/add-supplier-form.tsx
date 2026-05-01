'use client'

import { useState, useEffect } from 'react'
import { 
    Building2, 
    User,
    Settings,
    CreditCard,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    PlusCircle
} from 'lucide-react'
import { addSupplier, getUniqueCategories } from '@/actions/suppliers'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AddSupplierForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [phone, setPhone] = useState('')
    const [upiMobile, setUpiMobile] = useState('')
    
    const [categories] = useState<string[]>([
        "Electronics", 
        "Hardware", 
        "Consumables", 
        "Lab Equipment", 
        "IT Services",
        "Office Supplies",
        "Manufacturing",
        "General"
    ])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        const result = await addSupplier(formData)

        if (result.error) {
            toast.error(result.error)
            setIsSubmitting(false)
        } else {
            toast.success('Supplier added successfully!')
            setTimeout(() => {
                router.push('/admin/suppliers')
                router.refresh()
            }, 1000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* General Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Building2 className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">General Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Company Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            name="company_name"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="e.g. Global Logistics Inc."
                            type="text"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Website
                        </label>
                        <input
                            name="website"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="www.company.com"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Contact Name
                        </label>
                        <input
                            name="contact_name"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="John Doe"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Email
                        </label>
                        <input
                            name="email"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="john@company.com"
                            type="email"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Phone
                        </label>
                        <input
                            name="phone"
                            value={phone}
                            onInput={(e) => {
                                const val = e.currentTarget.value.replace(/\D/g, '').slice(0, 10)
                                setPhone(val)
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="9876543210"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            {/* Logistics & Category */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Settings className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">Logistics & Category</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="category"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none appearance-none"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Payment Terms <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="payment_terms"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none appearance-none"
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
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Lead Time (Days)
                        </label>
                        <input
                            name="lead_time"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="7"
                            type="number"
                        />
                    </div>
                </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <CreditCard className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">Billing Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            GST Number
                        </label>
                        <input
                            name="gst_no"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="GSTIN"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Bank Account
                        </label>
                        <input
                            name="bank_account"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="Account Number"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            IFSC Code
                        </label>
                        <input
                            name="ifsc"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none text-sm"
                            placeholder="IFSC Code"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            UPI ID / Mobile
                        </label>
                        <input
                            name="payment_id"
                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none"
                            placeholder="e.g. 9876543210@upi"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 border-t border-slate-100">
                <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-6 h-12 rounded-xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#265136] hover:bg-[#1f422b] text-white h-12 px-10 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#265136]/10 transition-all active:scale-95 disabled:opacity-70"
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
