import { useState, useEffect } from 'react'
import { Store, Archive, IndianRupee, Plus, Layers, Settings, Truck, ShieldCheck, Paperclip, FileText, User } from 'lucide-react'
import SearchableSelect from '@/components/shared/searchable-select'
import { updateSupplier } from '@/actions/suppliers'
import { toast } from 'sonner'
import { RFQ_VERTICALS } from '@/config/rfq-config'
import { RFQDetails, CostBreakdownItem, RFQAttachment } from '@/types/rfq-details'

interface QuoteEntryDetailsProps {
    products: any[]
    suppliers: any[]
    members: any[]
    details: RFQDetails
    setDetails: (details: RFQDetails) => void
    selectedProductId: string
    setSelectedProductId: (id: string) => void
    setSelectedProductName: (name: string) => void
    selectedSupplierId: string
    setSelectedSupplierId: (id: string) => void
    setSelectedSupplierName: (name: string) => void
    quantity: string
    setQuantity: (q: string) => void
    unit: string
    setUnit: (u: string) => void
    expectedDate: string
    setExpectedDate: (d: string) => void
    estimatedTotal: string
    setEstimatedTotal: (t: string) => void
    notes: string
    setNotes: (n: string) => void
    supplierPatch: {
        contact_name: string
        email: string
        gst_no: string
        address: string
    }
    setSupplierPatch: (patch: any) => void
}

export function QuoteEntryDetails({
    products,
    suppliers,
    members,
    details,
    setDetails,
    selectedProductId,
    setSelectedProductId,
    setSelectedProductName,
    selectedSupplierId,
    setSelectedSupplierId,
    setSelectedSupplierName,
    quantity,
    setQuantity,
    unit,
    setUnit,
    expectedDate,
    setExpectedDate,
    estimatedTotal,
    setEstimatedTotal,
    notes,
    setNotes,
    supplierPatch,
    setSupplierPatch
}: QuoteEntryDetailsProps) {
    const [isEditingSupplier, setIsEditingSupplier] = useState(false)

    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId)

    const handleSupplierUpdate = async () => {
        if (!selectedSupplierId) return
        
        const currentSupplier = suppliers.find(s => s.id === selectedSupplierId)
        if (!currentSupplier) return

        const formData = new FormData()
        formData.append('company_name', currentSupplier.company_name)
        formData.append('contact_name', supplierPatch.contact_name)
        formData.append('email', supplierPatch.email)
        formData.append('gst_no', supplierPatch.gst_no)
        formData.append('address', supplierPatch.address)
        
        try {
            const promise = updateSupplier(selectedSupplierId, formData)
            
            toast.promise(promise, {
                loading: 'Updating Partner Profile...',
                success: () => {
                    setIsEditingSupplier(false)
                    return 'Partner Profile Updated'
                },
                error: 'Failed to update partner'
            })
        } catch (e) {
            toast.error('Failed to update supplier')
        }
    }

    const updateDetails = (updates: Partial<RFQDetails>) => {
        setDetails({ ...details, ...updates })
    }

    const updateTechSpecs = (updates: Partial<RFQDetails['technicalSpecs']>) => {
        setDetails({
            ...details,
            technicalSpecs: { ...details.technicalSpecs, ...updates }
        })
    }

    const updateDelivery = (updates: Partial<RFQDetails['delivery']>) => {
        setDetails({
            ...details,
            delivery: { ...details.delivery, ...updates }
        })
    }

    const updateQuality = (updates: Partial<RFQDetails['quality']>) => {
        setDetails({
            ...details,
            quality: { ...details.quality, ...updates }
        })
    }

    return (
        <div className="space-y-6">
            {/* Vertical Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Layers className="size-3.5 text-emerald-600" />
                        </div>
                        00. Brand Vertical
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Selection Required</span>
                </div>
                <div className="p-4 md:p-8 flex flex-col sm:flex-row gap-4 md:gap-6">
                    {RFQ_VERTICALS.map((v) => (
                        <button
                            key={v.value}
                            type="button"
                            onClick={() => updateDetails({ vertical: v.value as any })}
                            className={`flex-1 py-5 md:py-7 px-4 rounded-3xl border-2 transition-all flex flex-row sm:flex-col items-center gap-4 sm:gap-3 relative group ${
                                details.vertical === v.value 
                                ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-xl shadow-emerald-600/10 ring-4 ring-emerald-600/5' 
                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50/30'
                            }`}
                        >
                            {details.vertical === v.value && (
                                <div className="absolute top-3 right-3 md:top-4 md:right-4">
                                    <div className="size-4 md:size-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                        <ShieldCheck className="size-2.5 md:size-3 text-white" />
                                    </div>
                                </div>
                            )}
                            <div className={`size-10 md:size-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-sm ${
                                details.vertical === v.value ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}>
                                <User className="size-5 md:size-6" />
                            </div>
                            <div className="text-left sm:text-center">
                                <span className="block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-1">{v.label}</span>
                                <span className="block text-[8px] md:text-[9px] font-bold opacity-60 uppercase tracking-widest leading-none">
                                    {v.value === 'PF' ? 'Advanced Engineering' : 'Supply Chain Solutions'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 1: Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Store className="size-3.5 text-emerald-600" />
                        </div>
                        01. Partner & Item Selection
                    </h3>
                </div>
                <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                            <Archive className="size-3" />
                            Select Lab Item
                        </label>
                        <SearchableSelect 
                            options={products.map(p => ({ id: p.id, name: p.name, sub: p.sku, image_url: p.image_url }))}
                            value={selectedProductId}
                            onChange={(id, name) => {
                                setSelectedProductId(id)
                                setSelectedProductName(name)
                            }}
                            placeholder="Choose inventory item..."
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex justify-between items-center">
                            <span className="flex items-center gap-2">
                                <User className="size-3" />
                                Select Provider
                            </span>
                            <span className="text-[9px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded uppercase">New Entry Mode</span>
                        </label>
                        <SearchableSelect 
                            options={suppliers.map(s => ({ id: s.id, name: s.company_name, sub: s.contact_name }))}
                            value={selectedSupplierId}
                            onChange={(id, name) => {
                                setSelectedSupplierId(id)
                                setSelectedSupplierName(name)
                            }}
                            creatable
                            placeholder="Search or add supplier..."
                        />
                    </div>
                </div>

                {/* Premium Supplier Details Trace */}
                {selectedSupplierId && (
                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="bg-slate-50/50 border border-slate-200 rounded-[1.5rem] p-8 shadow-inner">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cashcrow-primary/10 rounded-lg">
                                            <Settings className="size-4 text-cashcrow-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
                                                Verify & Patch Partner Data
                                            </h4>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Operational Trace Verification</p>
                                        </div>
                                    </div>
                                    {!selectedSupplier?.gst_no && (
                                        <span className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase italic">
                                            <div className="size-1.5 bg-amber-500 rounded-full animate-pulse" />
                                            Incomplete Registry
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Reference</label>
                                        <input 
                                            type="text"
                                            value={supplierPatch.contact_name}
                                            onChange={(e) => setSupplierPatch((prev: any) => ({ ...prev, contact_name: e.target.value }))}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                                            placeholder="Enter contact person..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Partner Email</label>
                                        <input 
                                            type="email"
                                            value={supplierPatch.email}
                                            onChange={(e) => setSupplierPatch((prev: any) => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                                            placeholder="partner@company.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GST Identification</label>
                                        <input 
                                            type="text"
                                            value={supplierPatch.gst_no}
                                            onChange={(e) => setSupplierPatch((prev: any) => ({ ...prev, gst_no: e.target.value.toUpperCase() }))}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black tracking-[0.1em] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                                            placeholder="Enter GSTIN..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Address</label>
                                    <input 
                                        type="text"
                                        value={supplierPatch.address}
                                        onChange={(e) => setSupplierPatch((prev: any) => ({ ...prev, address: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                                        placeholder="Full legal business address..."
                                    />
                                </div>
                                <div className="flex justify-end pt-6 border-t border-slate-200/60">
                                    <button 
                                        type="button"
                                        onClick={handleSupplierUpdate}
                                        className="bg-emerald-700 text-white text-[11px] font-black px-12 py-5 rounded-2xl uppercase tracking-[0.25em] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-700/20 active:scale-95 flex items-center gap-4 group"
                                    >
                                        <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                            <ShieldCheck className="size-4 text-emerald-100" />
                                        </div>
                                        Sync with Master Registry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Step 2: Basic Info & Project */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <FileText className="size-3.5 text-emerald-600" />
                        </div>
                        02. Project Details
                    </h3>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Document Name / Reference</label>
                            <input 
                                type="text"
                                placeholder="e.g. Q1 Lab Supplies RFQ"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={details.documentName}
                                onChange={(e) => updateDetails({ documentName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Created By (Internal)</label>
                            <SearchableSelect 
                                options={members.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}`, sub: m.role }))}
                                value={details.createdBy}
                                onChange={(id, name) => updateDetails({ createdBy: name })}
                                placeholder="Select team member..."
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Department</label>
                            <select 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={details.department}
                                onChange={(e) => updateDetails({ department: e.target.value })}
                            >
                                <option value="Operations">Operations</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Procurement">Procurement</option>
                                <option value="Quality">Quality</option>
                                <option value="Logistics">Logistics</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Priority Level</label>
                            <select 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={details.priority}
                                onChange={(e) => updateDetails({ priority: e.target.value as any })}
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                                <option value="Critical">Critical Priority</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Scope of Requirement</label>
                            <textarea 
                                rows={3}
                                placeholder="Describe the high-level requirement..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all shadow-inner"
                                value={details.scopeOfRequirement}
                                onChange={(e) => updateDetails({ scopeOfRequirement: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Project Details</label>
                            <textarea 
                                rows={3}
                                placeholder="Specific project context or internal reference..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all shadow-inner"
                                value={details.projectDetails}
                                onChange={(e) => updateDetails({ projectDetails: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 3: Technical Specifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Settings className="size-3.5 text-emerald-600" />
                        </div>
                        03. Technical Specifications
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Material</label>
                            <input 
                                type="text" 
                                placeholder="Stainless Steel, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.material}
                                onChange={(e) => updateTechSpecs({ material: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Thickness</label>
                            <input 
                                type="text"
                                placeholder="5mm, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.thickness}
                                onChange={(e) => updateTechSpecs({ thickness: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Dimensions</label>
                            <input 
                                type="text"
                                placeholder="100x200mm, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.dimensions}
                                onChange={(e) => updateTechSpecs({ dimensions: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Finish / Color</label>
                            <input 
                                type="text"
                                placeholder="Matte, RAL 9005, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.finish}
                                onChange={(e) => updateTechSpecs({ finish: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tolerance</label>
                            <input 
                                type="text"
                                placeholder="+/- 0.1mm, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.tolerance}
                                onChange={(e) => updateTechSpecs({ tolerance: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Required Standards / Certifications</label>
                            <input 
                                type="text"
                                placeholder="ISO 9001, CE, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.standards}
                                onChange={(e) => updateTechSpecs({ standards: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Technical Notes</label>
                            <input 
                                type="text"
                                placeholder="Additional constraints..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.technicalSpecs.notes}
                                onChange={(e) => updateTechSpecs({ notes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 4: Quantities & Commercials */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <IndianRupee className="size-3.5 text-emerald-600" />
                        </div>
                        04. Commercial Requirements
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Required Qty</label>
                            <input 
                                type="number" 
                                min="1"
                                placeholder="0"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Unit</label>
                            <select 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option value="Units">Units</option>
                                <option value="Pcs">Pcs</option>
                                <option value="Kg">Kg</option>
                                <option value="Mtrs">Mtrs</option>
                                <option value="Sets">Sets</option>
                                <option value="Nos">Nos</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">GST %</label>
                            <input 
                                type="number"
                                min="0"
                                placeholder="18"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={details.gstPercentage}
                                onChange={(e) => updateDetails({ gstPercentage: e.target.value })}
                                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Target Total (₹)</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                    <IndianRupee className="size-3.5" />
                                </div>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-black text-emerald-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                    value={estimatedTotal}
                                    onChange={(e) => setEstimatedTotal(e.target.value)}
                                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Payment Terms</label>
                            <input 
                                type="text"
                                placeholder="100% advance, Net 30, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.paymentTerms}
                                onChange={(e) => updateDetails({ paymentTerms: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Quote Validity</label>
                            <input 
                                type="text"
                                placeholder="30 Days, 6 Months, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.validity}
                                onChange={(e) => updateDetails({ validity: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 5: Logistics & Delivery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Truck className="size-3.5 text-emerald-600" />
                        </div>
                        05. Logistics & Delivery
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Delivery Location</label>
                            <input 
                                type="text"
                                placeholder="Factory Address, Office, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.delivery.location}
                                onChange={(e) => updateDelivery({ location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Required Arrival Date</label>
                            <input 
                                type="date"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                value={expectedDate}
                                onChange={(e) => setExpectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Packaging Requirements</label>
                            <input 
                                type="text"
                                placeholder="ESD Safe, Palletized, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.delivery.packaging}
                                onChange={(e) => updateDelivery({ packaging: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Transport Responsibility</label>
                            <input 
                                type="text"
                                placeholder="Vendor Paid, Ex-Works, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.delivery.transport}
                                onChange={(e) => updateDelivery({ transport: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 6: Quality & Warranty */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <ShieldCheck className="size-3.5 text-emerald-600" />
                        </div>
                        06. Quality & Warranty
                    </h3>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">QA Process Required</label>
                            <input 
                                type="text"
                                placeholder="In-process inspection, PDI, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.quality.assurance}
                                onChange={(e) => updateQuality({ assurance: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Warranty Period</label>
                            <input 
                                type="text"
                                placeholder="12 Months, 2 Years, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-inner"
                                value={details.quality.warranty}
                                onChange={(e) => updateQuality({ warranty: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Inspection Method</label>
                            <textarea 
                                rows={2}
                                placeholder="Visual, Functional Testing, Sampling plan..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all shadow-inner"
                                value={details.quality.inspection}
                                onChange={(e) => updateQuality({ inspection: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Replacement Terms</label>
                            <textarea 
                                rows={2}
                                placeholder="Within 7 days of delivery, etc."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all shadow-inner"
                                value={details.quality.replacement}
                                onChange={(e) => updateQuality({ replacement: e.target.value })}
                            />
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Step 7: Attachments & References */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Paperclip className="size-3.5 text-emerald-600" />
                        </div>
                        07. Attachments & References
                    </h3>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 font-mono">Reference Links / Notes</label>
                        <textarea 
                            rows={2}
                            placeholder="URLs to datasheets, internal drive folders, etc."
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all shadow-inner"
                            value={details.reference}
                            onChange={(e) => updateDetails({ reference: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface QuoteFinalSummaryProps {
    isSaving: boolean
    estimatedTotal: string
    selectedProductName: string
    selectedProductSku: string
    selectedSupplierName: string
    requestId: string
    isGuest: boolean
    onSave: () => void
    disabled: boolean
}

export function QuoteFinalSummary({
    isSaving,
    estimatedTotal,
    selectedProductName,
    selectedProductSku,
    selectedSupplierName,
    requestId,
    isGuest,
    onSave,
    disabled
}: QuoteFinalSummaryProps) {
    return (
        <div className="bg-cashcrow-primary text-white rounded-[2rem] shadow-2xl p-6 md:p-10 relative overflow-hidden flex flex-col group transition-all hover:translate-y-[-4px]">
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10 pb-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400 mb-2">Establish RFQ Registry</h3>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">{requestId || 'RFQ-TRACE-ID'}</p>
                    </div>
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="size-6 text-emerald-500" />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12">
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">Command Item</p>
                        <p className="text-base font-black tracking-tight leading-tight uppercase text-white/90">{selectedProductName || 'Awaiting Selection...'}</p>
                        {selectedProductSku && <p className="text-[10px] font-bold text-emerald-500/50 font-mono tracking-widest">{selectedProductSku}</p>}
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">Target Provider</p>
                        <p className="text-base font-black tracking-tight leading-tight uppercase text-white/90">{selectedSupplierName || 'Awaiting Selection...'}</p>
                        {isGuest && <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-widest">Guest Entry</span>}
                    </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">Projected Commitment (₹)</p>
                            <div className="flex items-center gap-2 font-black text-4xl md:text-5xl tracking-tighter text-emerald-500">
                                <span className="text-2xl text-emerald-500/40">₹</span>
                                {estimatedTotal || '0.00'}
                            </div>
                        </div>
                        
                        <button 
                            type="button"
                            onClick={onSave}
                            disabled={isSaving || disabled}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-12 py-5 rounded-2xl flex items-center justify-center gap-5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-emerald-600/30 group/btn"
                        >
                            <div className="p-2.5 bg-white/15 rounded-xl group-hover/btn:bg-white/25 transition-colors shadow-inner">
                                <Archive className="size-5 text-emerald-50" />
                            </div>
                            {isSaving ? 'Establishing Trace...' : 'Generate Quote & Save'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 size-64 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-600/20 transition-all"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 size-64 bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    )
}
