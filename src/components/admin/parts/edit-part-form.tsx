'use client'

import { useState, useRef, useEffect } from "react"
import { updateProduct } from "@/actions/products"
import { 
    Save, 
    Image as ImageIcon, 
    CheckCircle2, 
    AlertCircle, 
    Store, 
    Info, 
    MapPin, 
    BarChart3, 
    StickyNote,
    Loader2,
    Trash2,
    Globe,
    UserCircle2,
    PlusCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Vendor {
    mode: 'online' | 'offline'
    name: string
    fund: string
    link?: string
}

interface Part {
    id: string
    name: string
    sku: string
    category: string
    shelf_code: string
    box_code: string
    quantity: number
    min_stock_level: number
    notes?: string
    image_url?: string
    vendors?: Vendor[]
}

interface EditPartFormProps {
    part: Part
    onSuccess: () => void
    onCancel: () => void
    suppliers?: { id: string, company_name: string }[]
}

export default function EditPartForm({ part, onSuccess, onCancel, suppliers = [] }: EditPartFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(part.image_url || null)

    // Vendor Management State (Initialized from part.vendors)
    const [vendors, setVendors] = useState<Vendor[]>(
        (part.vendors && part.vendors.length > 0) 
            ? part.vendors.map(v => ({ ...v, mode: v.mode || 'online' })) 
            : [{ mode: 'online', name: '', fund: '', link: '' }]
    )

    const categories = [
        "Electronics", 
        "Hardware", 
        "Consumables", 
        "Lab Equipment", 
        "IT Services",
        "Office Supplies",
        "Manufacturing",
        "General"
    ]

    const addVendor = () => {
        setVendors([...vendors, { mode: 'online', name: '', fund: '', link: '' }])
    }

    const removeVendor = (index: number) => {
        setVendors(vendors.filter((_, i) => i !== index))
    }

    const updateVendor = (index: number, updates: Partial<Vendor>) => {
        const newVendors = [...vendors]
        newVendors[index] = { ...newVendors[index], ...updates }
        setVendors(newVendors)
    }

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('existing_image_url', part.image_url || '')
        
        // Filter out empty vendors and parse current state
        const formattedVendors = vendors.filter(v => v.name.trim() !== '')
        formData.append('vendors', JSON.stringify(formattedVendors))

        const result = await updateProduct(part.id, formData)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success('Part updated successfully!')
            setTimeout(() => {
                onSuccess()
            }, 1000)
        }
        setIsLoading(false)
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 p-1">

            {/* General Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Info className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">General Information</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Photo Update - Centered on mobile */}
                    <div className="flex flex-col items-center md:items-start shrink-0">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Part Photo</label>
                        <div className={`w-36 h-36 rounded-2xl border-2 border-dashed ${imagePreview ? 'border-[#265136]' : 'border-slate-200'} bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-slate-400">UPLOAD</span>
                                </div>
                            )}
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Part Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                name="name"
                                defaultValue={part.name}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="e.g. Micro-Centrifuge Tubes"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                SKU / Item Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                name="sku"
                                defaultValue={part.sku}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="Scan or enter code"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Category <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                name="category"
                                defaultValue={part.category}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none appearance-none"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Storage & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <MapPin className="w-5 h-5 text-[#265136]" />
                        <h3 className="font-bold text-slate-800">Storage Location</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Shelf Code</label>
                            <input
                                required
                                name="shelf_code"
                                defaultValue={part.shelf_code}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="e.g. S2"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Box Code</label>
                            <input
                                required
                                name="box_code"
                                defaultValue={part.box_code}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="e.g. B12"
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <BarChart3 className="w-5 h-5 text-[#265136]" />
                        <h3 className="font-bold text-slate-800">Inventory Management</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity</label>
                            <input
                                required
                                name="quantity"
                                min="0"
                                defaultValue={part.quantity}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="0"
                                type="number"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Stock</label>
                            <input
                                required
                                name="min_stock_level"
                                min="0"
                                defaultValue={part.min_stock_level}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 transition-all outline-none"
                                placeholder="10"
                                type="number"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Details - Multi-Vendor Restoration */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-[#265136]" />
                        <h3 className="font-bold text-slate-800">Purchase Details (Vendors)</h3>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addVendor}
                        className="h-10 border-[#265136] text-[#265136] hover:bg-[#265136] hover:text-white transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add New Vendor
                    </Button>
                </div>

                <div className="space-y-6">
                    {vendors.map((vendor, index) => (
                        <div key={index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 relative group animate-in slide-in-from-top-2 duration-300">
                            {vendors.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVendor(index)}
                                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-100 transition-all shadow-sm z-10"
                                    title="Remove Vendor"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Mode Toggle */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mode</label>
                                    <div className="flex bg-white rounded-xl p-1 border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => updateVendor(index, { mode: 'online' })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${vendor.mode === 'online' ? 'bg-[#265136] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Globe className="w-3 h-3" />
                                            Online
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateVendor(index, { mode: 'offline' })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${vendor.mode === 'offline' ? 'bg-[#265136] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <MapPin className="w-3 h-3" />
                                            Offline
                                        </button>
                                    </div>
                                </div>

                                {/* Vendor Name */}
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Shop Name</label>
                                    <div className="relative">
                                        <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            value={vendor.name}
                                            onChange={(e) => updateVendor(index, { name: e.target.value })}
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] outline-none transition-all"
                                            placeholder="Supplier name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* MRP / Amount */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">MRP / Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input
                                            value={vendor.fund}
                                            onChange={(e) => updateVendor(index, { fund: e.target.value })}
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] outline-none transition-all"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Link (Online Only) */}
                                <div className={vendor.mode === 'online' ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vendor Link</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            value={vendor.link}
                                            onChange={(e) => updateVendor(index, { link: e.target.value })}
                                            disabled={vendor.mode !== 'online'}
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] outline-none transition-all disabled:bg-slate-50"
                                            placeholder="https://..."
                                            type="url"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <StickyNote className="w-5 h-5 text-[#265136]" />
                    <h3 className="font-bold text-slate-800">Additional Notes</h3>
                </div>
                <textarea
                    name="notes"
                    defaultValue={part.notes}
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#265136]/10 focus:border-[#265136] px-4 py-3 transition-all outline-none resize-none"
                    placeholder="Enter technical specifications, special handling instructions, or other details..."
                    rows={4}
                />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 border-t border-slate-100">
                <Button 
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-6 h-12 rounded-xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-[#265136] hover:bg-[#1f422b] text-white h-12 px-10 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#265136]/10 transition-all active:scale-95 disabled:opacity-70"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Update Part
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
