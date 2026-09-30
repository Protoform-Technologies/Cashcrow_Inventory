'use client'

import React, { useState, useRef } from 'react'
import { Edit3, Download, Trash2, Loader2, AlertTriangle, FileText, Upload, ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { Product } from '@/types/product'
import { deleteProduct, updateProduct } from '@/actions/products'
import EditProductForm from '@/components/admin/inventory/edit-product-form'
import { getStockStatus } from '@/components/shared/inventory/product-card'
import DropdownMenu from '@/components/ui/dropdown-menu'
import Modal from '@/components/ui/modal'
import { addReportHeader, drawSectionTitle, drawTable, ensureSpace } from '@/lib/pdf'

interface ProductDetailActionsProps {
    product: Product
    logs: any[]
    userName: string
    isAdmin?: boolean
}

export default function ProductDetailActions({ product, logs, userName, isAdmin = false }: ProductDetailActionsProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const handleDataSheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('data_sheet', file)
        formData.append('name', product.name) // Required for updateProduct validation
        
        try {
            const result = await updateProduct(product.id, formData)
            if (result.success) {
                toast.success('Data sheet uploaded successfully')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to upload data sheet')
            }
        } catch (err) {
            console.error('Data sheet upload error:', err)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDownloadPDF = async () => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const marginX = 20
        const contentW = pageWidth - marginX * 2

        // Branded header (logo + generated-by + timestamp)
        let y = await addReportHeader(doc, { pageWidth, marginX, userName })

        // Product info
        y += 12
        doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20)
        doc.text(product.name, marginX, y)
        y += 7
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
        doc.text(`SKU: ${product.sku}   |   Category: ${product.category}`, marginX, y)

        // 4. Current Metrics table
        y += 12
        y = drawSectionTitle(doc, 'CURRENT METRICS', marginX, y)
        const status = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
        y = drawTable(doc, {
            startY: y,
            head: ['Metric', 'Value'],
            rows: [
                ['Current Stock', `${product.quantity} ${product.unit_of_measurement || 'units'}`],
                ['Location', `Shelf ${product.shelf_code}, Box ${product.box_code}`],
                ['Reorder Level', `${product.min_stock_level} units`],
                ['Status', status.label],
            ],
            colWidths: [contentW * 0.4, contentW * 0.6],
            marginX,
        })

        // 5. Suppliers table
        y = ensureSpace(doc, y + 12, 30)
        y = drawSectionTitle(doc, 'SUPPLIERS', marginX, y)
        const vendorRows = (product.vendors || [])
            .filter((v: any) => v?.name)
            .map((v: any) => [v.name, `Rs. ${v.fund || '-'}`, v.link ? 'Online' : 'Offline'])
        if (vendorRows.length) {
            y = drawTable(doc, {
                startY: y,
                head: ['Supplier', 'Price', 'Availability'],
                rows: vendorRows,
                colWidths: [contentW * 0.5, contentW * 0.25, contentW * 0.25],
                marginX,
            })
        } else {
            doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
            doc.text('No suppliers linked.', marginX, y + 6); y += 10
        }

        // 6. Movement History table — shown LAST
        y = ensureSpace(doc, y + 12, 30)
        y = drawSectionTitle(doc, 'MOVEMENT HISTORY', marginX, y)
        const sign = (t: string) => (t === 'IN' || t === 'RETURN') ? '+' : t === 'ADJUST' ? '±' : '-'
        const moveRows = (logs || []).map((l: any) => [
            l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            l.type || '-',
            `${sign(l.type)}${l.qty}`,
            l.purpose || 'Stock update',
            l.taken_by_name || l.author || 'System',
        ])
        if (moveRows.length) {
            y = drawTable(doc, {
                startY: y,
                head: ['Date', 'Type', 'Qty', 'Purpose', 'By'],
                rows: moveRows,
                colWidths: [contentW * 0.2, contentW * 0.14, contentW * 0.1, contentW * 0.36, contentW * 0.2],
                marginX,
            })
        } else {
            doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120)
            doc.text('No movements recorded.', marginX, y + 6)
        }

        doc.save(`Cashcrow_Report_${product.sku}.pdf`)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        setDeleteError('')
        try {
            const result = await deleteProduct(product.id)
            if (result.success) {
                toast.success('Part deleted successfully')
                const basePath = window.location.pathname.includes('/admin') ? '/admin/parts' : '/member/parts'
                router.push(basePath)
            } else {
                setDeleteError(result.error || 'Failed to delete product')
                toast.error(result.error || 'Failed to delete product')
            }
        } catch (err) {
            setDeleteError('An unexpected error occurred during deletion.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
                {isAdmin && (
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-[#265035] border border-[#2f6443] text-white rounded-xl text-sm font-bold hover:bg-[#2f6443] transition-all shadow-sm active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Details
                    </button>
                )}

                {product.data_sheet_url ? (
                    <DropdownMenu
                        label="Data Sheet"
                        icon={FileText}
                        align="right"
                        triggerClassName="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-[var(--color-cashcrow-lightgreen)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                        items={[
                            { label: 'Show Current', icon: ExternalLinkIcon, onClick: () => window.open(product.data_sheet_url as string, '_blank') },
                            ...(isAdmin ? [{ label: 'Upload New', icon: Upload, onClick: () => fileInputRef.current?.click() }] : []),
                        ]}
                    />
                ) : (
                    isAdmin && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-[var(--color-cashcrow-lightgreen)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            Upload Data Sheet
                        </button>
                    )
                )}

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleDataSheetUpload} 
                    className="hidden" 
                    accept=".pdf,image/*" 
                />

                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>

                {isAdmin && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 hover:border-red-200 transition-all shadow-sm active:scale-95"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Part
                    </button>
                )}
            </div>

            {/* Edit Modal */}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)} size="xl" showCloseButton>
                <div className="p-8">
                    <EditProductForm
                        product={{ ...product, image_url: product?.image_url || undefined } as any}
                        onSuccess={() => {
                            setShowEditModal(false)
                            router.refresh()
                        }}
                        onCancel={() => setShowEditModal(false)}
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setDeleteError('') }}
                size="sm"
            >
                <div className="p-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete this part?</h3>
                    <p className="text-slate-500 text-center text-sm mb-8">
                        This action is permanent and will remove <span className="font-bold text-slate-800">{product.name}</span> from the system.
                    </p>

                    {deleteError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                            {deleteError}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deletion'}
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteError('')
                            }}
                            disabled={isDeleting}
                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
