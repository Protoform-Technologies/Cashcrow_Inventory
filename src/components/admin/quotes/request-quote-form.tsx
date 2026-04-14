'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Archive, IndianRupee } from 'lucide-react'
import { createQuote, getNextRequestId, updateQuoteStatus } from '@/actions/quotes'
import { getOrCreateSupplierByName } from '@/actions/suppliers'
import { QuoteStatus } from '@/types/quote'
import QuoteHistoryTable from './quote-history-table'
import QuotesHeader from './quotes-header'
import { QuoteEntryDetails, QuoteFinalSummary } from './quote-form-sections'
import { generateQuotePDF } from '@/lib/quote-reports'
import { toast } from 'sonner'

interface Product {
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
    products: Product[]
    suppliers: Supplier[]
    initialRecentQuotes: any[]
}

export default function RequestQuoteForm({ 
    products, 
    suppliers, 
    initialRecentQuotes
}: RequestQuoteFormProps) {
    const router = useRouter()
    const [selectedProductId, setSelectedProductId] = useState('')
    const [selectedProductName, setSelectedProductName] = useState('')
    const [selectedSupplierId, setSelectedSupplierId] = useState('')
    const [selectedSupplierName, setSelectedSupplierName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [expectedDate, setExpectedDate] = useState('')
    const [estimatedTotal, setEstimatedTotal] = useState('')
    const [notes, setNotes] = useState('')

    const refreshRequestId = async () => {
        const id = await getNextRequestId()
        setRequestId(id)
    }

    const [requestId, setRequestId] = useState<string>('')
    const [recentQuotes, setRecentQuotes] = useState(initialRecentQuotes)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        refreshRequestId()
    }, [])

    const selectedProduct = products.find(p => p.id === selectedProductId)
    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) ||
        (selectedSupplierId === 'custom' ? { company_name: selectedSupplierName, email: '', phone: '', contact_name: '' } : null)

    const handleSaveAndGenerate = async () => {
        if (!selectedProductId || !selectedSupplierId || !quantity) {
            toast.error('Please fill in required fields (Item, Provider, Qty).')
            return
        }

        setIsSaving(true)
        try {
            let finalSupplierId = selectedSupplierId

            // If the ID isn't in our suppliers list, it's a "custom" (new) supplier name
            const isKnownSupplier = suppliers.some(s => s.id === selectedSupplierId)
            
            if (!isKnownSupplier) {
                console.log('[CLIENT DIAGNOSIS] Creating new supplier for:', selectedSupplierName);
                finalSupplierId = await getOrCreateSupplierByName(selectedSupplierName)
            }

            const result = await createQuote({
                product_id: selectedProductId,
                supplier_id: finalSupplierId,
                quantity: parseFloat(quantity),
                total_amount: estimatedTotal ? parseFloat(estimatedTotal) : 0,
                expected_date: expectedDate,
                notes: notes,
                status: QuoteStatus.PENDING,
                request_id: requestId
            })

            if (result.success) {
                generateQuotePDF({
                    requestId: requestId,
                    date: new Date().toISOString(),
                    productName: selectedProductName,
                    sku: selectedProduct?.sku || 'N/A',
                    supplierName: selectedSupplierName || selectedSupplier?.company_name || 'N/A',
                    contactName: selectedSupplier?.contact_name,
                    email: selectedSupplier?.email,
                    quantity: quantity,
                    totalAmount: estimatedTotal || '0.00',
                    expectedDate: expectedDate,
                    notes: notes
                })

                const newQuote = {
                    ...result.data,
                    suppliers: { company_name: selectedSupplierName || selectedSupplier?.company_name },
                    products: { name: selectedProductName, sku: selectedProduct?.sku }
                }
                setRecentQuotes([newQuote, ...recentQuotes].slice(0, 10))
                toast.success('Quote generated and PDF ready!')

                setQuantity('')
                setEstimatedTotal('')
                setNotes('')
                setSelectedProductId('')
                setSelectedProductName('')
                setSelectedSupplierId('')
                setSelectedSupplierName('')
                refreshRequestId()
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
        console.log('[CLIENT DIAGNOSIS] RequestQuoteForm.handleStatusUpdate triggered', { id, newStatus });

        // Optimistic Update
        const previousQuotes = [...recentQuotes]
        setRecentQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))

        try {
            console.log('[CLIENT DIAGNOSIS] Invoking server action: updateQuoteStatus...');
            const result = await updateQuoteStatus(id, newStatus as QuoteStatus)
            console.log('[CLIENT DIAGNOSIS] Server action updateQuoteStatus result:', result);

            if (result.success) {
                toast.success(`Quote status updated to ${newStatus}`)
                console.log('[CLIENT DIAGNOSIS] Refreshing router...');
                router.refresh() // Sync with server state
                return true
            } else {
                console.error('[CLIENT DIAGNOSIS] Server update failed:', result.error);
                // Rollback
                setRecentQuotes(previousQuotes)
                toast.error('Failed to update quote status: ' + result.error)
                return false
            }
        } catch (error) {
            console.error('[CLIENT DIAGNOSIS] Status update caught exception:', error);
            // Rollback
            setRecentQuotes(previousQuotes)
            toast.error('An unexpected error occurred during status update')
            return false
        }
    }

    const handleGmailCompose = () => {
        const email = selectedSupplier?.email || ''
        const subject = `Quote Request: ${selectedProductName || 'Parts'} (${requestId})`
        const bodyValue = `Hello ${selectedSupplier?.contact_name || selectedSupplier?.company_name || 'Team'},\n\nWe would like to request a quote for the following item:\n\nRequest ID: ${requestId}\nItem: ${selectedProductName}\nQuantity Required: ${quantity}\nExpected Delivery: ${expectedDate}\n\nNotes: ${notes}\n\nThank you.`

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyValue)}`
        window.open(gmailUrl, '_blank')
    }

    return (
        <div className="space-y-6">
            <QuotesHeader />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                    <QuoteEntryDetails
                        products={products}
                        suppliers={suppliers}
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
                </div>

                <div className="md:col-span-4">
                    <QuoteFinalSummary
                        isSaving={isSaving}
                        estimatedTotal={estimatedTotal}
                        selectedProductName={selectedProductName}
                        selectedProductSku={selectedProduct?.sku || ''}
                        selectedSupplierName={selectedSupplierName || selectedSupplier?.company_name || ''}
                        requestId={requestId}
                        isGuest={!suppliers.some(s => s.id === selectedSupplierId) && selectedSupplierId !== ''}
                        onSave={handleSaveAndGenerate}
                        onGmail={handleGmailCompose}
                        disabled={!selectedProductId || !selectedSupplierId || !quantity}
                    />
                </div>
            </div>

            <QuoteHistoryTable
                quotes={recentQuotes}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    )
}
