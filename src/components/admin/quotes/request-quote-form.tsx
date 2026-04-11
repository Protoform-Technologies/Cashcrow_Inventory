'use client'

import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { Plus, Info, FileText, Mail, History, Store, Phone, Clock, Archive } from 'lucide-react'
import { createQuote } from '@/actions/quotes.actions'
import QuoteHistoryTable from './quote-history-table'

interface Part {
    id: string
    name: string
    sku: string
    category: string
    quantity: number
}

interface Supplier {
    id: string
    company_name: string
    contact_name: string
    email: string
    phone: string
}

interface RequestQuoteFormProps {
    parts: Part[]
    suppliers: Supplier[]
    initialRecentQuotes: any[]
}

export default function RequestQuoteForm({ parts, suppliers, initialRecentQuotes }: RequestQuoteFormProps) {
    const [selectedPartId, setSelectedPartId] = useState('')
    const [selectedSupplierId, setSelectedSupplierId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [expectedDate, setExpectedDate] = useState('')
    const [estimatedTotal, setEstimatedTotal] = useState('')
    const [notes, setNotes] = useState('')
    // Generate a more unique Request ID (uses Year-Random-Timestamp)
    const generateUniqueId = () => `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
    
    const [requestId, setRequestId] = useState<string>('')
    const [recentQuotes, setRecentQuotes] = useState(initialRecentQuotes)
    const [isSaving, setIsSaving] = useState(false)

    // Hydration fix: Generate ID on client side after initial render
    useEffect(() => {
        setRequestId(generateUniqueId())
    }, [])

    const selectedPart = parts.find(p => p.id === selectedPartId)
    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId)

    const handleSaveAndGenerate = async () => {
        if (!selectedPartId || !selectedSupplierId || !quantity || !estimatedTotal) {
            alert('Please fill in all required fields.')
            return
        }

        setIsSaving(true)
        try {
            // 1. Save to Database
            const result = await createQuote({
                part_id: selectedPartId,
                supplier_id: selectedSupplierId,
                quantity: parseFloat(quantity),
                total_amount: parseFloat(estimatedTotal),
                expected_date: expectedDate,
                notes: notes,
                status: 'Approved',
                request_id: requestId
            })

            if (result.success) {
                // 2. Download PDF
                handleGeneratePdf()
                
                // 3. Update local history list
                const newQuote = {
                    ...result.data,
                    suppliers: { company_name: selectedSupplier?.company_name }
                }
                setRecentQuotes([newQuote, ...recentQuotes].slice(0, 5))
                
                // 4. Reset Form & Generate NEW ID for next quote
                setQuantity('')
                setEstimatedTotal('')
                setNotes('')
                setSelectedPartId('')
                setSelectedSupplierId('')
                setRequestId(generateUniqueId()) // VERY IMPORTANT: Generate new ID for next entry
            } else {
                alert('Error saving quote: ' + result.error)
            }
        } catch (error) {
            console.error('Failed to create quote:', error)
            alert('An unexpected error occurred.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleGeneratePdf = () => {
        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text('Request for Quote', 20, 20)
        
        doc.setFontSize(12)
        doc.text(`Request ID: ${requestId}`, 20, 35)
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42)
        
        doc.text(`Part: ${selectedPart?.name || 'N/A'} (${selectedPart?.sku || 'N/A'})`, 20, 55)
        doc.text(`Supplier: ${selectedSupplier?.company_name || 'N/A'}`, 20, 62)
        doc.text(`Quantity: ${quantity}`, 20, 69)
        doc.text(`Expected Delivery: ${expectedDate}`, 20, 76)
        doc.text(`Estimated Total: $${estimatedTotal}`, 20, 83)
        
        doc.text('Notes:', 20, 95)
        doc.text(notes, 20, 102, { maxWidth: 170 })
        
        doc.save(`${requestId}.pdf`)
    }

    const handleSendEmail = () => {
        const email = selectedSupplier?.email
        if (!email) {
            alert('No supplier email found')
            return
        }
        const subject = `Quote Request: ${selectedPart?.name || 'Parts'} (${requestId})`
        const body = `Hello ${selectedSupplier.contact_name || selectedSupplier.company_name},\n\nWe would like to request a quote for the following part:\n\nRequest ID: ${requestId}\nPart: ${selectedPart?.name}\nSKU: ${selectedPart?.sku}\nQuantity: ${quantity}\nExpected Delivery: ${expectedDate}\n\nNotes: ${notes}\n\nThank you.`
        
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* Page Title & ID Section - Responsive Column-to-Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Request New Quote</h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">Initiate a formal procurement request for laboratory inventory items.</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-200 md:border-0">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Request ID</p>
                    <p className="text-sm md:text-base font-mono font-bold text-[var(--color-cashcrow-primary)]">{requestId}</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-cashcrow-primary)] flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                1. Selection Details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Part</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none transition-all"
                                    value={selectedPartId}
                                    onChange={(e) => setSelectedPartId(e.target.value)}
                                >
                                    <option value="">Select a part...</option>
                                    {parts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Supplier</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none transition-all"
                                        value={selectedSupplierId}
                                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                                    >
                                        <option value="">Select a supplier...</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.company_name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="button"
                                        onClick={() => window.location.href = '/admin/add-suppliers'}
                                        className="bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)] p-3 rounded-xl hover:bg-[var(--color-cashcrow-primary)]/20 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-cashcrow-primary)] flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                2. Quote Specifications
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantity Required</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expected Delivery</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none"
                                        value={expectedDate}
                                        onChange={(e) => setExpectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated Total ($)</label>
                                    <input 
                                        type="text" 
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none"
                                        value={estimatedTotal}
                                        onChange={(e) => setEstimatedTotal(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internal Project Notes</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Mention project codes or specific packaging requirements..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)] outline-none resize-none"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-[var(--color-cashcrow-primary)] text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Request Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-white/70">Part Reference</span>
                                <span className="text-sm font-bold text-right">
                                    {selectedPart ? selectedPart.sku : '---'}<br/>
                                    <span className="text-[10px] font-normal text-white/50">{selectedPart ? selectedPart.name : 'No part selected'}</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/70">Supplier</span>
                                <span className="text-sm font-bold">{selectedSupplier ? selectedSupplier.company_name : '---'}</span>
                            </div>
                            <div className="h-px bg-white/20 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Estimated Budget</span>
                                <span className="text-xl font-black text-white">${estimatedTotal || '0.00'}</span>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={handleSaveAndGenerate}
                            disabled={isSaving}
                            className="w-full bg-white text-[var(--color-cashcrow-primary)] font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <FileText className="w-5 h-5" />
                            {isSaving ? 'Processing...' : 'Generate Quote'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <button 
                            onClick={handleGeneratePdf}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-white hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] transition-all"
                        >
                            <FileText className="w-4 h-4" />
                            Draft PDF
                        </button>
                        <button 
                            onClick={handleSendEmail}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-white hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Email Supplier
                        </button>
                    </div>

                    {selectedSupplier && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--color-cashcrow-primary)] border border-slate-100">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Contact</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSupplier.contact_name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <Phone className="w-4 h-4 text-slate-300" />
                                    {selectedSupplier.phone || 'N/A'}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <Clock className="w-4 h-4 text-slate-300" />
                                    Avg. Response: 4.5 hours
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <QuoteHistoryTable quotes={recentQuotes} />
        </div>
    )
}
