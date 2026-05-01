'use client'

import { useState, useRef, useEffect } from "react"
import { updateProduct } from "@/actions/products"
import { getAllSupplierNames } from "@/actions/suppliers"
import { PlusCircle, Image as ImageIcon, CheckCircle2, AlertCircle, Store, Trash2, Loader2, Info, MapPin, BarChart3, StickyNote, ScanBarcode, HelpCircle, Globe } from "lucide-react"
import { toast } from "sonner"

interface Vendor {
    mode?: 'online' | 'offline'
    name: string
    fund: string
    link: string
}

interface Product {
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

interface EditProductFormProps {
    product: Product
    onSuccess: () => void
    onCancel: () => void
}

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null)

    const [vendors, setVendors] = useState<Vendor[]>(product.vendors?.length ? product.vendors.map(v => ({...v, mode: v.mode || 'online'})) : [{ mode: 'online', name: '', fund: '', link: '' }])

    const [supplierNames, setSupplierNames] = useState<string[]>([])

    useEffect(() => {
        if (product.vendors && product.vendors.length > 0) {
            setVendors(product.vendors.map(v => ({...v, mode: v.mode || 'online'})))
        }

        const fetchSuppliers = async () => {
            const names = await getAllSupplierNames()
            setSupplierNames(names)
        }
        fetchSuppliers()
    }, [product.vendors])

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
        setVendors([...vendors, { mode: 'online', name: '', fund: '', link: '' }])
    }

    const removeVendor = (index: number) => {
        const newVendors = [...vendors]
        newVendors.splice(index, 1)
        setVendors(newVendors)
    }

    const updateVendor = (index: number, field: keyof Vendor, value: any) => {
        const newVendors = [...vendors]
        newVendors[index][field] = value
        setVendors(newVendors)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('existing_image_url', product.image_url || '')
        formData.append('vendors', JSON.stringify(vendors.filter(v => v.name.trim() !== '')))

        const result = await updateProduct(product.id, formData)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success('Product updated successfully!')
            setTimeout(() => {
                onSuccess()
            }, 1000)
        }
        setIsLoading(false)
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-12">

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
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
                                id="photo_upload"
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">Update Photo</h4>
                            <p className="text-slate-500 text-xs mb-3">Upload a clear photo of the product. PNG, JPG up to 5MB.</p>
                            <label htmlFor="photo_upload" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer inline-block">
                                Browse Files
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 1: General Info */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">General Information</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Product Name<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input 
                                required 
                                name="name" 
                                defaultValue={product.name}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" 
                                placeholder="e.g. Micro-Centrifuge Tubes" 
                                type="text" 
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                SKU / Item Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <div className="relative">
                                <input 
                                    required 
                                    name="sku" 
                                    defaultValue={product.sku}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] pl-4 pr-10 py-2.5 text-sm transition-all outline-none" 
                                    placeholder="Scan or enter code" 
                                    type="text" 
                                />
                                <ScanBarcode className="absolute right-3 top-2.5 text-slate-400 cursor-pointer hover:text-[var(--color-cashcrow-primary)] w-5 h-5" />
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Category<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <select 
                                required 
                                name="category" 
                                defaultValue={product.category}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none bg-white"
                            >
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
                        <MapPin className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Storage Location</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Shelf Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input 
                                required 
                                name="shelf_code" 
                                defaultValue={product.shelf_code}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" 
                                placeholder="e.g. S2" 
                                type="text" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Box Code<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input 
                                required 
                                name="box_code" 
                                defaultValue={product.box_code}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" 
                                placeholder="e.g. B12" 
                                type="text" 
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Inventory Details */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Inventory Details</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Quantity<span className="text-red-500 ml-1 font-bold">*</span>
                            </label>
                            <input 
                                required 
                                name="quantity" 
                                min="0" 
                                defaultValue={product.quantity}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" 
                                placeholder="0" 
                                type="number" 
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                Min. Stock Level (Alert)<span className="text-red-500 ml-1 font-bold">*</span>
                                <span title="System will alert you when stock falls below this number">
                                    <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                                </span>
                            </label>
                            <input 
                                required 
                                name="min_stock_level" 
                                min="0" 
                                defaultValue={product.min_stock_level}
                                className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none" 
                                placeholder="10" 
                                type="number" 
                            />
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">Mode</label>
                                    <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => updateVendor(index, 'mode', 'online')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[10px] font-bold transition-all ${vendor.mode === 'online' ? 'bg-[var(--color-cashcrow-primary)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Globe className="w-3 h-3" /> Online
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateVendor(index, 'mode', 'offline')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[10px] font-bold transition-all ${vendor.mode === 'offline' ? 'bg-[var(--color-cashcrow-primary)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <MapPin className="w-3 h-3" /> Offline
                                        </button>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                        Vendor Name
                                    </label>
                                    <input
                                        value={vendor.name}
                                        onChange={(e) => updateVendor(index, 'name', e.target.value)}
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-3 py-2 text-sm transition-all outline-none bg-white"
                                        placeholder="e.g. Thermo Fisher"
                                        type="text"
                                        list="supplier-names"
                                    />
                                    <datalist id="supplier-names">
                                        {supplierNames.map(name => (
                                            <option key={name} value={name} />
                                        ))}
                                    </datalist>
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
                                <div className={vendor.mode === 'offline' ? 'opacity-30 pointer-events-none' : ''}>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">
                                        Vendor Link
                                    </label>
                                    <input
                                        value={vendor.link}
                                        onChange={(e) => updateVendor(index, 'link', e.target.value)}
                                        disabled={vendor.mode === 'offline'}
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-3 py-2 text-sm transition-all outline-none bg-white disabled:bg-slate-50"
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
                    <StickyNote className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Additional Notes</h3>
                </div>
                <div className="p-6">
                    <textarea 
                        name="notes" 
                        defaultValue={product.notes || ''}
                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] px-4 py-2.5 text-sm transition-all outline-none resize-none" 
                        placeholder="Enter any additional product specifications, supplier details, or handling instructions..." 
                        rows={5}
                    ></textarea>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 mt-10">
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
                    className="px-8 py-2.5 rounded-lg bg-[var(--color-cashcrow-primary)] text-white font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-cashcrow-lightgreen)] transition-all shadow-lg shadow-[var(--color-cashcrow-primary)]/25 flex items-center justify-center gap-2.5 disabled:opacity-70 whitespace-nowrap"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="w-5 h-5" />
                            Update Product
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

