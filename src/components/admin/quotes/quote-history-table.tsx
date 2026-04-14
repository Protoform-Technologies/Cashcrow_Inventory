'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { 
    IndianRupee, DollarSign, Clock, Archive, Download, ChevronLeft, ChevronRight, 
    Search, Calendar, ChevronDown, Mail, CheckCircle, Loader2, Package, XCircle, AlertCircle 
} from 'lucide-react'
import { generateQuotePDF } from '@/lib/quote-reports'
import { toast } from 'sonner'
import { QuoteStatus } from '@/types/quote'

interface QuoteHistoryTableProps {
    quotes: any[]
    filterQuery?: string
    onStatusUpdate?: (id: string, status: QuoteStatus) => Promise<boolean>
}

export default function QuoteHistoryTable({ quotes, onStatusUpdate }: QuoteHistoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [dateFilter, setDateFilter] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
    const itemsPerPage = 10

    console.log("[DIAGNOSIS] QuoteHistoryTable props:", { 
        hasQuotes: quotes?.length > 0, 
        hasOnStatusUpdate: !!onStatusUpdate 
    });

    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            const matchesQuery = !searchQuery ||
                quote.suppliers?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.request_id?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesDate = !dateFilter ||
                new Date(quote.created_at).toISOString().split('T')[0] === dateFilter

            return matchesQuery && matchesDate
        })
    }, [quotes, searchQuery, dateFilter])

    const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage)
    const paginatedQuotes = filteredQuotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleStatusUpdate = async (id: string, newStatus: string): Promise<boolean> => {
        console.log("[DIAGNOSIS] QuoteHistoryTable.handleStatusUpdate triggered", { id, newStatus });
        if (!onStatusUpdate) {
            console.error("[DIAGNOSIS] onStatusUpdate prop is missing!");
            return false
        }
        
        setUpdatingId(id)
        try {
            console.log("[DIAGNOSIS] Calling onStatusUpdate prop...");
            const success = await onStatusUpdate(id, newStatus as QuoteStatus)
            console.log("[DIAGNOSIS] onStatusUpdate prop returned:", success);
            return success
        } catch (err) {
            console.error('[DIAGNOSIS] Status update failed in component:', err)
            return false
        } finally {
            setUpdatingId(null)
        }
    }

    const handleDownload = (quote: any) => {
        generateQuotePDF({
            requestId: quote.request_id || 'RFQ-TRACE',
            date: quote.created_at,
            productName: quote.products?.name || 'Item',
            sku: quote.products?.sku || 'N/A',
            supplierName: quote.suppliers?.company_name || 'N/A',
            contactName: quote.suppliers?.contact_name,
            email: quote.suppliers?.email,
            quantity: quote.quantity,
            totalAmount: quote.total_amount,
            expectedDate: quote.expected_date,
            notes: quote.notes || ''
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-8 relative">
            {/* Table Header / Filters */}
            <div className="px-4 sm:px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl shadow-sm shrink-0">
                        <Archive className="size-4 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Audit Registry</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Formal Procurement Traces</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {/* Integrated Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search providers..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all uppercase"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative flex-1 sm:flex-none">
                        <Calendar className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="date"
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all uppercase"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    {(dateFilter || searchQuery) && (
                        <button
                            onClick={() => { setDateFilter(''); setSearchQuery('') }}
                            className="px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-all uppercase"
                        >
                            CLEAR
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Table Content - No Scroll */}
            <div className="hidden lg:block relative">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-white border-b border-slate-100">
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Trace Identification</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Provider</th>
                            <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</th>
                            <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Lifecycle Status</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedQuotes.length > 0 ? (
                            paginatedQuotes.map((quote: any) => (
                                <tr key={quote.id} className={`hover:bg-slate-50/50 transition-colors group relative ${openDropdownId === quote.id ? 'z-50' : 'z-auto'}`}>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] font-black text-slate-900 font-mono tracking-tighter">
                                                {quote.request_id || 'RFQ-TRACE'}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                {new Date(quote.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-200 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                                                {quote.suppliers?.company_name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase leading-tight">
                                                    {quote.suppliers?.company_name || 'Anonymous Partner'}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                                    {quote.products?.name || 'Item'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-slate-900">
                                            {quote.total_amount && quote.total_amount > 0 ? (
                                                <span className="flex items-center gap-0.5">
                                                    <span className="text-[11px] text-slate-300 font-bold">₹</span>
                                                    {quote.total_amount}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">Nil</span>
                                            )}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-sm font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                                            {quote.quantity || 0} <span className="text-[10px] text-slate-300 uppercase">Units</span>
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <StatusDropdown 
                                            quote={quote} 
                                            updatingId={updatingId} 
                                            onUpdate={handleStatusUpdate}
                                            isOpen={openDropdownId === quote.id}
                                            setIsOpen={(open) => setOpenDropdownId(open ? quote.id : null)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDownload(quote)}
                                            className="p-2 rounded-xl text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 border border-transparent hover:border-emerald-100"
                                            title="Download Audit Report"
                                        >
                                            <Download className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Separate Cards View */}
            <div className="lg:hidden space-y-4 p-4 bg-slate-50/30 relative">
                {paginatedQuotes.length > 0 ? (
                    paginatedQuotes.map((quote: any) => (
                        <div key={quote.id} className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 transition-all relative ${openDropdownId === quote.id ? 'z-[60] border-emerald-200 ring-4 ring-emerald-500/5' : 'z-auto'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{quote.request_id}</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 transition-colors uppercase leading-tight">
                                        {quote.suppliers?.company_name || 'Anonymous Partner'}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">
                                        {quote.products?.name || 'Item'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 font-mono tracking-tighter">
                                        {new Date(quote.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mb-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Trace</p>
                                    <p className="text-base font-black text-slate-900">
                                        {quote.total_amount && quote.total_amount > 0 ? `₹${quote.total_amount}` : 'Nil'}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Qty</p>
                                    <p className="text-base font-black text-slate-900 uppercase">
                                        {quote.quantity} <span className="text-[11px] text-slate-400 font-bold uppercase">Units</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                <StatusDropdown 
                                    quote={quote} 
                                    updatingId={updatingId} 
                                    onUpdate={handleStatusUpdate}
                                    isOpen={openDropdownId === quote.id}
                                    setIsOpen={(open) => setOpenDropdownId(open ? quote.id : null)}
                                />
                                <button 
                                    onClick={() => handleDownload(quote)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-600 bg-white border border-slate-200 shadow-sm transition-all active:scale-95 hover:border-emerald-200 active:bg-slate-50"
                                >
                                    <Download className="size-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">PDF</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Documenting <span className="text-slate-900">{paginatedQuotes.length}</span> / <span className="text-slate-900">{filteredQuotes.length}</span> Trace Records
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase text-slate-600 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronLeft className="size-3.5" />
                            Previous
                        </button>
                        
                        <div className="flex items-center justify-center min-w-[60px] text-[10px] font-black text-slate-400">
                            PAGE <span className="text-slate-900 ml-1">{currentPage} / {totalPages}</span>
                        </div>
                        
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase text-slate-600 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all shadow-sm active:scale-95"
                        >
                            Next
                            <ChevronRight className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusDropdown({ quote, updatingId, onUpdate, isOpen, setIsOpen }: { 
    quote: any, 
    updatingId: string | null, 
    onUpdate: (id: string, status: QuoteStatus) => Promise<boolean>,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}) {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [direction, setDirection] = useState<'down' | 'up'>('down')
    const [coords, setCoords] = useState<{ top: number, left: number }>({ top: 0, left: 0 })

    // Handle direction and coordinate detection
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const currentDirection = spaceBelow < 160 ? 'up' : 'down'
            setDirection(currentDirection)
            
            // Calculate fixed coordinates relative to viewport
            // This bypasses the table's stacking context
            const dropdownWidth = 144 // w-36 = 144px
            let leftPos = rect.right - dropdownWidth
            
            // Mobile safety: Ensure it doesn't go off-screen to the left
            if (leftPos < 12) leftPos = 12
            // Mobile safety: Ensure it doesn't go off-screen to the right (padding)
            if (leftPos + dropdownWidth > window.innerWidth - 12) {
                leftPos = window.innerWidth - dropdownWidth - 12
            }

            setCoords({
                top: currentDirection === 'down' ? rect.bottom + 4 : rect.top - 165,
                left: leftPos
            })
        }
    }, [isOpen])

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
            // Also close on scroll to prevent "floating" dropdown
            window.addEventListener('scroll', () => setIsOpen(false), { once: true })
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
            window.removeEventListener('scroll', () => setIsOpen(false))
        }
    }, [isOpen, setIsOpen])

    return (
        <div className={`relative inline-block ${isOpen ? 'z-[70]' : 'z-40'}`} ref={dropdownRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all shadow-sm ${
                    quote.status === QuoteStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' :
                    quote.status === QuoteStatus.ORDERED ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' :
                    quote.status === QuoteStatus.DENIED ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' :
                    'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                }`}
            >
                {updatingId === quote.id ? (
                    <Loader2 className="size-3 animate-spin" />
                ) : (
                    <>
                        {quote.status === QuoteStatus.APPROVED && <CheckCircle className="size-3" />}
                        {quote.status === QuoteStatus.ORDERED && <Package className="size-3" />}
                        {quote.status === QuoteStatus.DENIED && <XCircle className="size-3" />}
                        {(quote.status === QuoteStatus.PENDING || !quote.status) && <Clock className="size-3" />}
                    </>
                )}
                {quote.status || QuoteStatus.PENDING}
                <ChevronDown className={`size-3 opacity-50 transition-transform ${isOpen ? (direction === 'down' ? 'rotate-180' : 'rotate-0') : ''}`} />
            </button>
            
            {isOpen && (
                <div 
                    className="fixed w-36 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: `${coords.top}px`,
                        left: `${coords.left}px`
                    }}
                >
                    {[QuoteStatus.PENDING, QuoteStatus.ORDERED, QuoteStatus.APPROVED, QuoteStatus.DENIED].map((label) => (
                        <button 
                            key={label}
                            type="button"
                            onClick={async () => { 
                                console.log("[FIXED] Dropdown item clicked:", label);
                                setIsOpen(false);
                                if (label !== quote.status) {
                                    console.log("[FIXED] Status changed, calling onUpdate...");
                                    const success = await onUpdate(quote.id, label); 
                                    if (!success) {
                                        console.error("[FIXED] Status update via onUpdate failed");
                                    }
                                } else {
                                    console.log("[FIXED] Status is same, skipping update");
                                }
                            }} 
                            className={`w-full px-4 py-2.5 text-left text-[9px] font-black uppercase transition-colors cursor-pointer border-l-4 border-transparent flex items-center gap-2 ${
                                label === QuoteStatus.PENDING ? 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-400' :
                                label === QuoteStatus.ORDERED ? 'border-t border-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400' :
                                label === QuoteStatus.APPROVED ? 'border-t border-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-400' :
                                'border-t border-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400'
                            }`}
                        >
                            {label === QuoteStatus.PENDING && <Clock className="size-2.5" />}
                            {label === QuoteStatus.ORDERED && <Package className="size-2.5" />}
                            {label === QuoteStatus.APPROVED && <CheckCircle className="size-2.5" />}
                            {label === QuoteStatus.DENIED && <XCircle className="size-2.5" />}
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="px-6 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
                <Archive className="size-10 text-slate-100" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-loose">
                    Registry search yielded <br/> no matching records.
                </p>
            </div>
        </div>
    )
}
