'use client'

import React, { useState, useMemo } from 'react'
import { FileText, Send, Info, History as HistoryIcon, LayoutGrid, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { submitAtomicLogs, deleteDayLog } from '@/actions/day-logs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import DayLogForm from './day-log-form'
import SubmittedLogsTable from './submitted-logs-table'
import LogDetailModal from './log-detail-modal'
import FinalizeModal from './finalize-modal'
import DeleteModal from './delete-modal'
import LogFilters from './log-filters'
import { Product, Member, DayLog, LogEntry, INITIAL_ENTRY, generateEntryId } from '@/types/day-logs'

interface DailyLogManagerProps {
    userId: string
    userName: string
    userRole: string
    products: Product[]
    members: Member[]
    submittedLogs: DayLog[]
}

const ITEMS_PER_PAGE = 10

export default function DailyLogManager({ userId, userName, userRole, products, members, submittedLogs }: DailyLogManagerProps) {
    const [entries, setEntries] = useState<LogEntry[]>([{ ...INITIAL_ENTRY, id: generateEntryId() }])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [validEntriesToSubmit, setValidEntriesToSubmit] = useState<LogEntry[]>([])

    // Filtering & Pagination State
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedLog, setSelectedLog] = useState<DayLog | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [logToDelete, setLogToDelete] = useState<string | null>(null)

    const addNewRow = () => {
        setEntries([...entries, { ...INITIAL_ENTRY, id: generateEntryId() }])
    }

    const removeEntry = (id: string) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id))
        }
    }

    const updateEntry = (id: string, field: keyof LogEntry, value: string | number) => {
        setEntries(prevEntries => prevEntries.map(entry => {
            if (entry.id === id) {
                const updatedEntry = { ...entry, [field]: value }

                // Stock Validation logic
                if (updatedEntry.productId && updatedEntry.quantity > 0) {
                    const product = products.find(p => p.id === updatedEntry.productId)
                    const isOutbound = ['OUT', 'SCRAP', 'ADJUST'].includes(updatedEntry.transactionType)

                    if (isOutbound && product && updatedEntry.quantity > product.quantity) {
                        toast.error(`Logical Error: Only ${product.quantity} ${product.name} available. Adjusting to max.`, {
                            id: `stock-warn-${id}` 
                        })
                        updatedEntry.quantity = product.quantity
                    }
                }

                return updatedEntry
            }
            return entry
        }))
    }

    const handleSubmit = async () => {
        const validEntries = entries.filter(e => e.productId && e.quantity > 0)
        if (validEntries.length === 0) {
            toast.error('Please include at least one valid inventory movement.')
            return
        }

        // Validate stock levels for outbound transactions
        const stockViolation = validEntries.find(e => {
            const product = products.find(p => p.id === e.productId)
            const isOutbound = ['OUT', 'SCRAP', 'ADJUST'].includes(e.transactionType)
            return isOutbound && product && e.quantity > product.quantity
        })

        if (stockViolation) {
            const product = products.find(p => p.id === stockViolation.productId)
            toast.error(`Transaction for ${product?.name} exceeds available stock (${product?.quantity}).`)
            return
        }

        setValidEntriesToSubmit(validEntries)
        setShowConfirmModal(true)
    }

    const executeSubmit = async () => {
        setIsSubmitting(true)
        // Keep modal open to show loading state
        try {
            const result = await submitAtomicLogs(validEntriesToSubmit, userId)

            if ('error' in result) {
                toast.error(`Submission Error: ${result.error}`)
            } else {
                toast.success('Daily logs finalized and inventory updated!')
                setEntries([{ ...INITIAL_ENTRY, id: generateEntryId() }])
                router.refresh()
            }
        } catch (error) {
            console.error('Submission Error:', error)
            toast.error('A critical error occurred during submission.')
        } finally {
            setIsSubmitting(false)
            setShowConfirmModal(false)
        }
    }

    const executeDelete = async () => {
        if (!logToDelete) return
        setIsDeleting(true)
        try {
            const result = await deleteDayLog(logToDelete)
            if ('error' in result) {
                toast.error(result.error)
            } else {
                toast.success('Record deleted successfully')
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to delete log')
        } finally {
            setIsDeleting(false)
            setLogToDelete(null)
        }
    }

    // Client-side Filtering Logic
    const filteredLogs = useMemo(() => {
        return submittedLogs.filter(log => {
            const matchesDate = !dateFilter || log.created_at.startsWith(dateFilter)

            // Search in Creator Name or individual Item details (Product/TakenBy)
            const creatorName = `${log.profiles?.first_name} ${log.profiles?.last_name}`.toLowerCase()
            const matchesSearch = !searchTerm ||
                creatorName.includes(searchTerm.toLowerCase()) ||
                log.day_log_items.some(item =>
                    item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.products?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.taken_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
                )

            return matchesDate && matchesSearch
        })
    }, [submittedLogs, searchTerm, dateFilter])

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredLogs.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredLogs, currentPage])

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Reduced Padding Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Daily Log Entry</h2>
                    <p className="text-slate-500 font-medium mt-1 leading-relaxed max-w-2xl">
                        Verify and record whiteboard observations as independent ledger transactions.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-[var(--color-cashcrow-primary)] border border-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[var(--color-cashcrow-primary)]/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying...
                            </span>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 text-white" />
                                Finalize Record
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Standardized Transaction Guide with Detailed Logic */}
            <div className="bg-white rounded-xl p-1.5 flex flex-col items-stretch gap-1 border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-3 text-slate-900 bg-slate-50/50 rounded-t-[1.5rem] border-b border-slate-100">
                    <Info className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory Transaction Guide</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 p-2">
                    {[
                        { label: 'IN (Restock)', color: 'bg-emerald-500', desc: 'New inventory arrives. Stock Increases (+).' },
                        { label: 'RETURN (To Shelf)', color: 'bg-sky-400', desc: 'Unused parts returned. Stock Increases (+).' },
                        { label: 'OUT (Usage)', color: 'bg-slate-400', desc: 'Parts taken for projects. Stock Decreases (-).' },
                        { label: 'SCRAP (Damage)', color: 'bg-rose-500', desc: 'Broken or lost items. Stock Decreases (-).' },
                        { label: 'ADJUST (Audit)', color: 'bg-amber-400', desc: 'Audit corrections. Stock Decreases (-).' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:border-[var(--color-cashcrow-primary)]/30 group">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.color} shadow-sm group-hover:scale-125 transition-transform`} />
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{item.label}</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Send className="w-4 h-4 text-slate-600" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Daily Logs</h3>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest">{entries.length} Atomic Items</span>
                        </div>
                    </div>

                    <div className="bg-slate-50/20 rounded-xl p-2 sm:p-4 border border-slate-100 overflow-visible">
                        <DayLogForm
                            entries={entries}
                            products={products}
                            members={members}
                            onAddRow={addNewRow}
                            onRemoveRow={removeEntry}
                            onUpdateEntry={updateEntry}
                        />
                    </div>
                </div>

                {/* History Section Area */}
                <div className="lg:col-span-12 mt-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl">
                                <HistoryIcon className="size-3 text-slate-400" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Submission Log Archives</h3>
                        </div>
                    </div>

                    {/* Integrated Filters */}
                    <LogFilters
                        search={searchTerm}
                        onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                        dateFilter={dateFilter}
                        onDateChange={(v) => { setDateFilter(v); setCurrentPage(1); }}
                        onClear={() => { setSearchTerm(''); setDateFilter(''); setCurrentPage(1); }}
                    />

                    <div className="overflow-visible">
                        <SubmittedLogsTable 
                            logs={paginatedLogs} 
                            onView={(log) => { setSelectedLog(log); setShowViewModal(true); }}
                            onDelete={(id) => setLogToDelete(id)}
                            isDeleting={isDeleting}
                            userRole={userRole}
                        />

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between py-6 border-t border-slate-200/60 mt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages} &bull; {filteredLogs.length} Total Records
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FinalizeModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={executeSubmit}
                isSubmitting={isSubmitting}
                entryCount={validEntriesToSubmit.length}
            />

            <DeleteModal
                isOpen={!!logToDelete}
                onClose={() => setLogToDelete(null)}
                onConfirm={executeDelete}
                isDeleting={isDeleting}
            />

            {/* Modals */}
            {showViewModal && selectedLog && (
                <LogDetailModal
                    log={selectedLog}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div>
    )
}


