import { Store, Archive, IndianRupee, DollarSign, Plus } from 'lucide-react'
import SearchableSelect from '@/components/shared/searchable-select'

interface QuoteEntryDetailsProps {
    products: any[]
    suppliers: any[]
    selectedProductId: string
    setSelectedProductId: (id: string) => void
    setSelectedProductName: (name: string) => void
    selectedSupplierId: string
    setSelectedSupplierId: (id: string) => void
    setSelectedSupplierName: (name: string) => void
    quantity: string
    setQuantity: (q: string) => void
    expectedDate: string
    setExpectedDate: (d: string) => void
    estimatedTotal: string
    setEstimatedTotal: (t: string) => void
    notes: string
    setNotes: (n: string) => void
}

export function QuoteEntryDetails({
    products,
    suppliers,
    selectedProductId,
    setSelectedProductId,
    setSelectedProductName,
    selectedSupplierId,
    setSelectedSupplierId,
    setSelectedSupplierName,
    quantity,
    setQuantity,
    expectedDate,
    setExpectedDate,
    estimatedTotal,
    setEstimatedTotal,
    notes,
    setNotes
}: QuoteEntryDetailsProps) {
    return (
        <div className="space-y-6">
            {/* Step 1: Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Store className="size-4 text-emerald-600" />
                        01. Partner & Item Selection
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Select Lab Item</label>
                        <SearchableSelect 
                            options={products.map(p => ({ id: p.id, name: p.name, sub: p.sku }))}
                            value={selectedProductId}
                            onChange={(id, name) => {
                                setSelectedProductId(id)
                                setSelectedProductName(name)
                            }}
                            placeholder="Choose inventory item..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex justify-between">
                            <span>Select Provider</span>
                            <span className="text-[9px] text-emerald-600 font-bold">Type for New Entry</span>
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
            </div>

            {/* Step 2: Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Archive className="size-4 text-emerald-600" />
                        02. Quote Specifications
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Expected Inventory Qty</label>
                            <input 
                                type="number" 
                                placeholder="0"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Target Arrival Date</label>
                            <input 
                                type="date"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                value={expectedDate}
                                onChange={(e) => setExpectedDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Estimated Commitment (₹)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                    <IndianRupee className="size-3" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="0.00"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-black text-emerald-600 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                    value={estimatedTotal}
                                    onChange={(e) => setEstimatedTotal(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Strategic Project Notes</label>
                        <textarea 
                            rows={4}
                            placeholder="Enter internal references, urgent requirements or technical notes..."
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none transition-all"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
    onGmail: () => void
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
    onGmail,
    disabled
}: QuoteFinalSummaryProps) {
    return (
        <div className="space-y-6">
            <div className="bg-[#265136] text-white rounded-xl shadow-xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8 pb-4 border-b border-white/10 text-center">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Establish RFQ Registry</h3>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{requestId || 'RFQ-TRACE'}</p>
                    </div>
                    
                    <div className="flex-1 space-y-8">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Command Item</p>
                            <p className="text-sm font-black tracking-tight leading-tight uppercase blur-none">{selectedProductName || 'Select Item'}</p>
                            {selectedProductSku && <p className="text-[10px] font-bold text-white/30 font-mono tracking-wider">{selectedProductSku}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Target Provider</p>
                            <p className="text-sm font-black tracking-tight leading-tight uppercase">{selectedSupplierName || 'Select Supplier'}</p>
                            {isGuest && <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded text-[8px] font-black text-emerald-200 uppercase tracking-widest">Ad-hoc Entry</span>}
                        </div>

                        <div className="mt-auto pt-8 border-t border-white/10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Projected Commitment (₹)</p>
                                    <div className="flex items-center gap-1 font-black text-3xl tracking-tighter">
                                        <span className="text-xl text-white/50">₹</span>
                                        {estimatedTotal || '0.00'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || disabled}
                        className="w-full bg-white text-emerald-700 font-black py-4 rounded-lg mt-8 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest shadow-lg shadow-black/10"
                    >
                        <Archive className="size-4" />
                        {isSaving ? 'Establishing Trace...' : 'Generate Quote'}
                    </button>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <button 
                onClick={onGmail}
                disabled={disabled}
                className="w-full group flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all disabled:opacity-50"
            >
                <div className="size-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Plus className="size-4" />
                </div>
                <div className="text-left flex-1">
                    <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Communication Link</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Connect via Gmail Service</p>
                </div>
            </button>
        </div>
    )
}
