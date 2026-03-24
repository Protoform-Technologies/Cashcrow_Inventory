'use client'

import { useState, useRef, useEffect } from "react"
import { updateSupplier } from "@/actions/suppliers"
import { CheckCircle2, AlertCircle, Loader2, Building2, User, Settings } from "lucide-react"

interface Supplier {
    id: string
    company_name: string
    website?: string | null
    contact_name?: string | null
    email?: string | null
    phone?: string | null
    lead_time?: number
    payment_terms?: string
    category?: string
}

interface EditSupplierFormProps {
    supplier: Supplier
    onSuccess: () => void
    onCancel: () => void
}

export default function EditSupplierForm({ supplier, onSuccess, onCancel }: EditSupplierFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const [formData, setFormData] = useState({
        company_name: supplier.company_name || '',
        website: supplier.website || '',
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        lead_time: supplier.lead_time?.toString() || '7',
        payment_terms: supplier.payment_terms || '',
        category: supplier.category || ''
    })

    useEffect(() => {
        setFormData({
            company_name: supplier.company_name || '',
            website: supplier.website || '',
            contact_name: supplier.contact_name || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            lead_time: supplier.lead_time?.toString() || '7',
            payment_terms: supplier.payment_terms || '',
            category: supplier.category || ''
        })
    }, [supplier])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)

        const formDataObj = new FormData()
        formDataObj.append('company_name', formData.company_name)
        formDataObj.append('website', formData.website)
        formDataObj.append('contact_name', formData.contact_name)
        formDataObj.append('email', formData.email)
        formDataObj.append('phone', formData.phone)
        formDataObj.append('lead_time', formData.lead_time || '7')
        formDataObj.append('payment_terms', formData.payment_terms)
        formDataObj.append('category', formData.category)

        const result = await updateSupplier(supplier.id, formDataObj)

        if (result?.error) {
            setStatus({ type: 'error', message: result.error })
        } else if (result?.success) {
            setStatus({ type: 'success', message: 'Supplier updated successfully!' })
            setTimeout(() => {
                onSuccess()
            }, 1000)
        }
        setIsLoading(false)
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-12">

            {status && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-semibold">{status.message}</p>
                </div>
            )}

            {/* Section 1: General Information */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 md:mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">General Information</h3>
                </div>
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="e.g. Global Logistics Inc."
                                required
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Website
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">
                                    https://
                                </span>
                                <input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-16 pr-4 py-3 transition-all"
                                    placeholder="www.company.com"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Contact Details */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 md:mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">Contact Details</h3>
                </div>
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Primary Contact Name
                            </label>
                            <input
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="John Doe"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="john@company.com"
                                type="email"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Operational Information */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">Operational Information</h3>
                </div>
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Typical Lead Time
                            </label>
                            <div className="relative">
                                <input
                                    name="lead_time"
                                    value={formData.lead_time}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-4 pr-12 py-3 transition-all"
                                    placeholder="7"
                                    type="number"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-sm">
                                    Days
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Payment Terms <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="payment_terms"
                                value={formData.payment_terms}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                required
                            >
                                <option disabled value="">Select Terms</option>
                                <option value="immediate">Immediate</option>
                                <option value="net15">Net 15</option>
                                <option value="net30">Net 30</option>
                                <option value="net45">Net 45</option>
                                <option value="net60">Net 60</option>
                                <option value="net90">Net 90</option>
                                <option value="cod">COD (Cash on Delivery)</option>
                                <option value="due_on_receipt">Due on Receipt</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                required
                            >
                                <option disabled value="">Select Category</option>
                                <option value="logistics">Logistics</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="it_services">IT Services</option>
                                <option value="office_supplies">Office Supplies</option>
                                <option value="electronics">Electronics</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-10">
                <button 
                    type="button" 
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-10 py-2.5 rounded-lg bg-[var(--color-cashcrow-primary)] text-white font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-cashcrow-lightgreen)] transition-all shadow-lg shadow-[var(--color-cashcrow-primary)]/25 flex items-center gap-2.5 disabled:opacity-70"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Update Supplier
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

