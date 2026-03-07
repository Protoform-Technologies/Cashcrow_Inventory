'use client'

import { useState, useRef } from "react"
import { addProduct } from "@/actions/products"
import { PlusCircle, Image as ImageIcon, CheckCircle2, AlertCircle, Store, Trash2 } from "lucide-react"

export default function AddProductForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [vendors, setVendors] = useState([{ name: '', fund: '', link: '' }])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addVendor = () => {
        setVendors([...vendors, { name: '', fund: '', link: '' }])
    }

    const removeVendor = (index: number) => {
        const newVendors = [...vendors]
        newVendors.splice(index, 1)
        setVendors(newVendors)
    }

    const updateVendor = (index: number, field: keyof typeof vendors[0], value: string) => {
        const newVendors = [...vendors]
        newVendors[index][field] = value
        setVendors(newVendors)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus(null)

        const formData = new FormData(e.currentTarget)
        // Ensure vendors is submitted as JSON
        formData.append('vendors', JSON.stringify(vendors.filter(v => v.name.trim() !== '')))

        const result = await addProduct(formData)

        if (result.error) {
            setStatus({ type: 'error', message: result.error })
        } else {
            setStatus({ type: 'success', message: 'Product added successfully!' })
            formRef.current?.reset()
            setImagePreview(null)
            setVendors([{ name: '', fund: '', link: '' }])
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

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-cashcrow-primary)] text-[20px]">image</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Product Photo</h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-32 h-32 rounded-xl border-2 border-dashed ${imagePreview ? 'border-[var(--color-cashcrow-primary)]' : 'border-slate-300'} bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden shrink-0 group`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                            )}
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Upload Photo</h4>
                            <p className="text-slate-500 text-xs mb-3">Upload a clear photo of the product. PNG, JPG up to 5MB.</p>
                            <label className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer inline-block">
                                Browse Files
                                <input type="file" name="photo" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 1: General Info */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-cashcrow-primary)] text-[20px]">info</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">General Information</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Product Name<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input required name="name" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" placeholder="e.g. Micro-Centrifuge Tubes" type="text" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                SKU / Item Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <div className="relative">
                                <input required name="sku" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] pl-4 pr-10 py-2.5 text-sm transition-all outline-none" placeholder="Scan or enter code" type="text" />
                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 cursor-pointer hover:text-[var(--color-cashcrow-primary)]">barcode_scanner</span>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Category<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <select required name="category" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none bg-white">
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Consumables">Consumables</option>
                                <option value="Lab Equipment">Lab Equipment</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Section 2: Storage Location */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-cashcrow-primary)] text-[20px]">location_on</span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Storage Location</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Shelf Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input required name="shelf_code" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" placeholder="e.g. S2" type="text" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Box Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input required name="box_code" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" placeholder="e.g. B12" type="text" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Inventory Details */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-cashcrow-primary)] text-[20px]">inventory</span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Inventory Details</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Initial Quantity<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input required name="initial_quantity" min="0" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" placeholder="0" type="number" />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Min. Stock Level (Alert)<span className="text-red-500 ml-1 font-bold">*</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400 cursor-help" title="System will alert you when stock falls below this number">help</span>
                            </label>
                            <input required name="min_stock_level" min="0" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" placeholder="10" type="number" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Vendors */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Vendors Information</h3>
                    </div>
                    <button
                        type="button"
                        onClick={addVendor}
                        className="text-xs font-bold text-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-lightgreen)] flex items-center gap-1 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add Vendor
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {vendors.map((vendor, index) => (
                        <div key={index} className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative group">
                            {vendors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVendor(index)}
                                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 shadow-sm"
                                    title="Remove Vendor"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                        Vendor Name
                                    </label>
                                    <input
                                        value={vendor.name}
                                        onChange={(e) => updateVendor(index, 'name', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-3 py-2 text-sm transition-all outline-none bg-white"
                                        placeholder="e.g. Thermo Fisher"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                        Vendor Fund
                                    </label>
                                    <input
                                        value={vendor.fund}
                                        onChange={(e) => updateVendor(index, 'fund', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-3 py-2 text-sm transition-all outline-none bg-white"
                                        placeholder="e.g. Grant NIH-2026"
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                        Vendor Link
                                    </label>
                                    <input
                                        value={vendor.link}
                                        onChange={(e) => updateVendor(index, 'link', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-3 py-2 text-sm transition-all outline-none bg-white"
                                        placeholder="https://..."
                                        type="url"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 5: Notes */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-cashcrow-primary)] text-[20px]">notes</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Additional Notes</h3>
                </div>
                <div className="p-6">
                    <textarea name="notes" className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none resize-none" placeholder="Enter any additional product specifications, supplier details, or handling instructions..." rows={5}></textarea>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-10">
                <button type="button" className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-10 py-2.5 rounded-lg bg-[var(--color-cashcrow-primary)] text-white font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-cashcrow-lightgreen)] transition-all shadow-lg shadow-[var(--color-cashcrow-primary)]/25 flex items-center gap-2.5 disabled:opacity-70">
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="w-5 h-5" />
                            Save Product
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
