'use client'

import { 
    Building2, 
    User,
    Settings,
    Save,
    X,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { addSupplier } from '@/actions/suppliers'
import { Button } from '@/components/ui/button'

interface SupplierFormData {
    company_name: string
    website: string
    contact_name: string
    email: string
    phone: string
    lead_time: string
    payment_terms: string
    category: string
}

interface AddSupplierFormProps {
    formData: SupplierFormData
    setFormData: React.Dispatch<React.SetStateAction<SupplierFormData>>
    isSubmitting: boolean
    formStatus: { type: 'success' | 'error', message: string } | null
    setFormStatus: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error', message: string } | null>>
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
}

export default function AddSupplierForm({
    formData,
    setFormData,
    isSubmitting,
    formStatus,
    setFormStatus,
    onSubmit,
    onCancel
}: AddSupplierFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Add New Supplier</h3>
                    <p className="text-slate-500 text-sm">Fill in the details to add a new supplier.</p>
                </div>
                <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {formStatus && (
                <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${formStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {formStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-semibold">{formStatus.message}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="p-6">
                {/* Section 1: General Information */}
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                            General Information
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="e.g. Global Logistics Inc."
                                required
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-16 pr-4 py-3 transition-all"
                                    placeholder="www.company.com"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Contact Details */}
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                            Contact Details
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Primary Contact Name
                            </label>
                            <input
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="John Doe"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="john@company.com"
                                type="email"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Operational Information */}
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                            Operational Information
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Typical Lead Time
                            </label>
                            <div className="relative">
                                <input
                                    name="lead_time"
                                    value={formData.lead_time}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] pl-4 pr-12 py-3 transition-all"
                                    placeholder="7"
                                    type="number"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-sm">
                                    Days
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Payment Terms <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="payment_terms"
                                value={formData.payment_terms}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
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
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-[var(--color-cashcrow-primary)] focus:border-[var(--color-cashcrow-primary)] px-4 py-3 transition-all"
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
                </section>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 rounded-lg bg-[var(--color-cashcrow-primary)] text-white font-semibold shadow-lg shadow-[var(--color-cashcrow-primary)]/20 hover:bg-[var(--color-cashcrow-primary)]/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-[18px] h-[18px]" />
                                Save Supplier
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    )
}

