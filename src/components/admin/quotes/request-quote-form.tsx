'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createQuote, getNextRequestId, updateQuoteStatus } from '@/actions/quotes'
import { getOrCreateSupplierByName } from '@/actions/suppliers'
import { QuoteStatus } from '@/types/quote'
import { RFQDetails } from '@/types/rfq-details'
import QuoteHistoryTable from './quote-history-table'
import QuotesHeader from './quotes-header'
import { QuoteEntryDetails, QuoteFinalSummary } from './quote-form-sections'
import { generateQuotePDF } from '@/lib/quote-reports'
import { toast } from 'sonner'
import { Layers, Store, Settings, IndianRupee, ShieldCheck, Plus } from 'lucide-react'

interface Product {
    id: string
    name: string
    sku: string
    category: string
}

interface Supplier {
    id: string
    company_name: string
    contact_name: string
    email: string
    phone: string
    gst_no?: string
    address?: string
}

interface RequestQuoteFormProps {
    products: Product[]
    suppliers: Supplier[]
    members: any[]
    initialRecentQuotes: any[]
}

const rfqSchema = z.object({
    quantity: z.number().positive('Quantity must be greater than 0'),
    estimatedTotal: z.number().positive('Target Total must be greater than 0'),
    gstPercentage: z.number().nonnegative('GST cannot be negative'),
    selectedProductId: z.string().min(1, 'Please select a lab item'),
    selectedSupplierId: z.string().min(1, 'Please select a provider'),
    expectedDate: z.string().min(1, 'Please select an expected delivery date')
})

export default function RequestQuoteForm({ 
    products, 
    suppliers, 
    members,
    initialRecentQuotes
}: RequestQuoteFormProps) {
    const router = useRouter()
    
    // Core selection state
    const [selectedProductId, setSelectedProductId] = useState('')
    const [selectedProductName, setSelectedProductName] = useState('')
    const [selectedSupplierId, setSelectedSupplierId] = useState('')
    const [selectedSupplierName, setSelectedSupplierName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [expectedDate, setExpectedDate] = useState('')
    const [estimatedTotal, setEstimatedTotal] = useState('')
    const [notes, setNotes] = useState('')
    
    // RFQ Extended Details
    const [details, setDetails] = useState<RFQDetails>({
        vertical: 'PF',
        documentName: '',
        scopeOfRequirement: '',
        projectDetails: '',
        createdBy: '',
        department: 'Operations',
        priority: 'Medium',
        responseDeadline: '',
        technicalSpecs: {
            material: '',
            thickness: '',
            dimensions: '',
            finish: '',
            tolerance: '',
            standards: '',
            notes: ''
        },
        costBreakdown: [],
        totalQuoteValue: '',
        gstPercentage: '18',
        paymentTerms: '',
        validity: '30 Days',
        delivery: {
            location: 'Factory Floor, Pune',
            packaging: '',
            transport: '',
            expectedDate: ''
        },
        quality: {
            assurance: '',
            inspection: '',
            warranty: '',
            replacement: ''
        },
        attachments: [],
        reference: ''
    })

    const [requestId, setRequestId] = useState<string>('')
    const [recentQuotes, setRecentQuotes] = useState(initialRecentQuotes)
    const [isSaving, setIsSaving] = useState(false)

    const refreshRequestId = async (vertical: string) => {
        const id = await getNextRequestId(vertical)
        setRequestId(id)
    }

    // Effect to update RFQ ID when vertical changes
    useEffect(() => {
        refreshRequestId(details.vertical)
    }, [details.vertical])

    const selectedProduct = products.find(p => p.id === selectedProductId)
    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) ||
        (selectedSupplierId === 'custom' ? { company_name: selectedSupplierName, email: '', phone: '', contact_name: '', gst_no: '', address: '' } : null)

    const handleSaveAndGenerate = async () => {
        // Prepare data for validation
        const formData = {
            quantity: parseFloat(quantity?.toString() || '0'),
            estimatedTotal: parseFloat(estimatedTotal?.toString() || '0'),
            gstPercentage: parseFloat(details.gstPercentage?.toString() || '0'),
            selectedProductId,
            selectedSupplierId,
            expectedDate
        }

        const validation = rfqSchema.safeParse(formData)

        if (!validation.success) {
            const firstError = validation.error.issues[0].message
            toast.error(firstError)
            return
        }

        setIsSaving(true)
        try {
            let finalSupplierId = selectedSupplierId
            const isKnownSupplier = suppliers.some(s => s.id === selectedSupplierId)
            
            if (!isKnownSupplier) {
                finalSupplierId = await getOrCreateSupplierByName(selectedSupplierName)
            }

            // Sync some basic fields with details
            const finalDetails = {
                ...details,
                totalQuoteValue: estimatedTotal || '0',
                delivery: { ...details.delivery, expectedDate: expectedDate }
            }

            const result = await createQuote({
                product_id: selectedProductId,
                supplier_id: finalSupplierId,
                quantity: parseFloat(quantity),
                total_amount: estimatedTotal ? parseFloat(estimatedTotal) : 0,
                expected_date: expectedDate,
                notes: notes,
                status: QuoteStatus.PENDING,
                request_id: requestId,
                details: finalDetails // Store structured details
            })

            if (result.success) {
                // Generate PDF using the new template logic
                generateQuotePDF({
                    requestId: requestId,
                    date: new Date().toISOString(),
                    productName: selectedProductName,
                    sku: selectedProduct?.sku || 'N/A',
                    supplierName: selectedSupplierName || selectedSupplier?.company_name || 'N/A',
                    contactName: selectedSupplier?.contact_name,
                    email: selectedSupplier?.email,
                    phone: selectedSupplier?.phone,
                    gstin: selectedSupplier?.gst_no,
                    address: selectedSupplier?.address,
                    quantity: quantity,
                    totalAmount: estimatedTotal || '0.00',
                    expectedDate: expectedDate,
                    notes: notes,
                    details: finalDetails
                })

                const newQuote = {
                    ...result.data,
                    suppliers: { company_name: selectedSupplierName || selectedSupplier?.company_name },
                    products: { name: selectedProductName, sku: selectedProduct?.sku }
                }
                setRecentQuotes([newQuote, ...recentQuotes].slice(0, 10))
                toast.success('Quote generated and PDF ready!')

                // Reset form
                setQuantity('')
                setEstimatedTotal('')
                setNotes('')
                setSelectedProductId('')
                setSelectedProductName('')
                setSelectedSupplierId('')
                setSelectedSupplierName('')
                refreshRequestId(details.vertical)
            } else {
                toast.error('Error saving quote: ' + result.error)
            }
        } catch (error) {
            console.error('Failed to create quote:', error)
            toast.error('An unexpected error occurred.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string): Promise<boolean> => {
        const previousQuotes = [...recentQuotes]
        setRecentQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))

        try {
            const result = await updateQuoteStatus(id, newStatus as QuoteStatus)
            if (result.success) {
                toast.success(`Quote status updated to ${newStatus}`)
                router.refresh()
                return true
            } else {
                setRecentQuotes(previousQuotes)
                toast.error('Failed to update quote status: ' + result.error)
                return false
            }
        } catch (error) {
            setRecentQuotes(previousQuotes)
            toast.error('An unexpected error occurred during status update')
            return false
        }
    }


    const isStep1Complete = !!details.vertical;
    const isStep2Complete = !!selectedProductId && !!selectedSupplierId;
    const isStep3Complete = !!details.technicalSpecs.material || !!details.technicalSpecs.dimensions || !!details.documentName;
    const isStep4Complete = !!quantity && parseFloat(estimatedTotal || '0') > 0;
    const isAllComplete = isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete;

    return (
        <div className="space-y-6 md:space-y-8 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-2 sm:px-4 md:px-8">
            <QuotesHeader />

            {/* Progress Journey Indicator */}
            <div className="bg-white p-3 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-12 overflow-x-auto no-scrollbar">
                {[
                    { label: 'Vertical', icon: Layers, done: isStep1Complete },
                    { label: 'Selection', icon: Store, done: isStep2Complete },
                    { label: 'Specifications', icon: Settings, done: isStep3Complete },
                    { label: 'Commercials', icon: IndianRupee, done: isStep4Complete },
                    { label: 'Review', icon: ShieldCheck, done: isAllComplete }
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-4 shrink-0">
                        <div className={`size-8 md:size-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                            step.done ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'
                        }`}>
                            {step.done && i < 4 ? <ShieldCheck className="size-4 md:size-5" /> : <step.icon className="size-4 md:size-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                                step.done ? 'text-slate-900' : 'text-slate-400'
                            }`}>{step.label}</span>
                            <span className="text-[7px] md:text-[8px] font-bold text-slate-400/60 uppercase tracking-tighter hidden xs:block">
                                {step.done ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                        {i < 4 && (
                            <div className="flex items-center gap-1 mx-2 md:mx-4">
                                <div className={`w-6 md:w-12 h-[2px] rounded-full transition-all duration-700 ${
                                    step.done ? 'bg-emerald-600' : 'bg-slate-100'
                                }`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-10">
                <QuoteEntryDetails
                    products={products}
                    suppliers={suppliers}
                    members={members}
                    details={details}
                    setDetails={setDetails}
                    selectedProductId={selectedProductId}
                    setSelectedProductId={setSelectedProductId}
                    setSelectedProductName={setSelectedProductName}
                    selectedSupplierId={selectedSupplierId}
                    setSelectedSupplierId={setSelectedSupplierId}
                    setSelectedSupplierName={setSelectedSupplierName}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    expectedDate={expectedDate}
                    setExpectedDate={setExpectedDate}
                    estimatedTotal={estimatedTotal}
                    setEstimatedTotal={setEstimatedTotal}
                    notes={notes}
                    setNotes={setNotes}
                />

                {/* Final Action Section - Moved to Bottom */}
                <div className="pt-12 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <QuoteFinalSummary
                                isSaving={isSaving}
                                estimatedTotal={estimatedTotal}
                                selectedProductName={selectedProductName}
                                selectedProductSku={selectedProduct?.sku || ''}
                                selectedSupplierName={selectedSupplierName || selectedSupplier?.company_name || ''}
                                requestId={requestId}
                                isGuest={!suppliers.some(s => s.id === selectedSupplierId) && selectedSupplierId !== ''}
                                onSave={handleSaveAndGenerate}
                                disabled={!selectedProductId || !selectedSupplierId || !quantity}
                            />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="bg-emerald-50/50 border border-emerald-100 p-6 md:p-8 rounded-[2rem] h-full flex flex-col justify-center">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800 mb-6 flex items-center gap-3">
                                    <div className="p-1.5 bg-emerald-600 rounded-lg">
                                        <ShieldCheck className="size-3.5 text-white" />
                                    </div>
                                    Procurement Policy
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        'Official RFQ sequence generated',
                                        'Terms mapping applied from config',
                                        'Technical Annexure ready for print',
                                        'GST calculation integrated',
                                        'Member accountability logged'
                                    ].map((p, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[12px] font-bold text-emerald-800/60">
                                            <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16">
                <QuoteHistoryTable
                    quotes={recentQuotes}
                    onStatusUpdate={handleStatusUpdate}
                />
            </div>
        </div>
    )
}
