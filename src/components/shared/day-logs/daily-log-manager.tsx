'use client'

import React, { useState } from 'react'
import { FileText, Send, Info, History as HistoryIcon, LayoutGrid, CheckCircle2 } from 'lucide-react'
import { saveDayLogDraft, submitDayLog, deleteDayLog } from '@/actions/day-logs'
import DayLogForm from './day-log-form'
import SubmittedLogsTable from './submitted-logs-table'
import LogDetailModal from './log-detail-modal'
import { Product, Member, DayLog, LogEntry, INITIAL_ENTRY, generateEntryId } from '@/lib/day-logs'

interface DailyLogManagerProps {
    userId: string
    userName: string
    products: Product[]
    members: Member[]
    submittedLogs: DayLog[]
}

export default function DailyLogManager({ userId, userName, products, members, submittedLogs }: DailyLogManagerProps) {
    const [entries, setEntries] = useState<LogEntry[]>([{ ...INITIAL_ENTRY, id: generateEntryId() }])
    const [globalNotes, setGlobalNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentLogId, setCurrentLogId] = useState<string | null>(null)

    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedLog, setSelectedLog] = useState<DayLog | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

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
                return { ...entry, [field]: value }
            }
            return entry
        }))
    }

    const handleSubmit = async () => {
        if (!confirm('Are you sure you want to finalize and submit this log?')) return

        setIsSubmitting(true)
        const validEntries = entries.filter(e => e.productId && e.quantity > 0)

        if (validEntries.length === 0) {
            alert('Please include at least one valid inventory movement.')
            setIsSubmitting(false)
            return
        }

        try {
            const draftResult = await saveDayLogDraft(currentLogId, validEntries, userId, globalNotes)
            if ('error' in draftResult) {
                alert(`Draft save failed: ${draftResult.error}`)
                setIsSubmitting(false)
                return
            }

            const submitResult = await submitDayLog(draftResult.id)
            if ('error' in submitResult) {
                alert(`Submission failed: ${submitResult.error}`)
                setIsSubmitting(false)
                return
            }

            setEntries([{ ...INITIAL_ENTRY, id: generateEntryId() }])
            setGlobalNotes('')
            setCurrentLogId(null)
            window.location.reload()
        } catch (error) {
            console.error('Submission Error:', error)
            alert('A critical error occurred during submission.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveDraft = async () => {
        const validEntries = entries.filter(e => e.productId && e.quantity > 0)
        try {
            const result = await saveDayLogDraft(currentLogId, validEntries, userId, globalNotes)
            if ('error' in result) {
                alert(`Draft Error: ${result.error}`)
                return
            }
            setCurrentLogId(result.id)
            alert('Draft saved successfully.')
        } catch (error) {
            console.error('Draft Error:', error)
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-[var(--color-cashcrow-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-cashcrow-primary)]/20">
                            <LayoutGrid className="size-5" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Daily Log Entry</h2>
                    </div>
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Precision inventory management. Convert whiteboard observations into verified, structure digital ledger transactions for real-time stock accuracy.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleSaveDraft}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-sm transition-all active:scale-95"
                    >
                        <FileText className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-[var(--color-cashcrow-primary)] border border-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[var(--color-cashcrow-primary)]/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2 animate-pulse font-black">
                                Processing...
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

            {/* Instructional Toolbar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-[2rem] p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-1 border border-slate-200 shadow-sm">
                        <div className="px-5 py-3 flex items-center gap-3 text-slate-900 border-r border-slate-100 shrink-0">
                            <Info className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Transaction Guide</span>
                        </div>
                        <div className="flex-1 flex flex-wrap items-center gap-2 p-1">
                            {[
                                { label: 'IN (Restock)', color: 'bg-emerald-500' },
                                { label: 'OUT (Usage)', color: 'bg-slate-400' },
                                { label: 'RETURN (To Shelf)', color: 'bg-sky-400' },
                                { label: 'ADJUST (Audit)', color: 'bg-amber-400' },
                                { label: 'SCRAP (Damage)', color: 'bg-rose-500' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                                    <span className={`w-2 h-2 rounded-full ${item.color} shadow-sm`} />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ledger Input Area */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl">
                                <Send className="w-4 h-4 text-slate-600" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Ledger Active Buffer</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">
                            {entries.length} Line Items
                        </span>
                    </div>

                    <div className="bg-slate-50/50 rounded-[3rem] p-2 sm:p-4 border border-slate-100 overflow-visible">
                        <DayLogForm
                            entries={entries}
                            products={products}
                            members={members}
                            onAddRow={addNewRow}
                            onRemoveRow={removeEntry}
                            onUpdateEntry={updateEntry}
                        />
                    </div>

                    {/* Transaction Annotations */}
                    <div className="px-2">
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Private Log Annotations (Draftable)</h3>
                            </div>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-cashcrow-primary)] focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-2xl p-6 text-sm font-medium transition-all min-h-[120px]"
                                placeholder="Add context, project references, or specific notes for this daily submission..."
                                value={globalNotes}
                                onChange={(e) => setGlobalNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* History Section Area */}
                <div className="lg:col-span-12 mt-12 space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-slate-100 rounded-xl">
                            <HistoryIcon className="size-3 text-slate-400" />
                        </div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Submission Log Archives</h3>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-2">
                        <SubmittedLogsTable
                            logs={submittedLogs}
                            onView={(log) => { setSelectedLog(log); setShowViewModal(true); }}
                            onDelete={async (id) => {
                                if (confirm('Permanently delete this record? This cannot be undone.')) {
                                    setIsDeleting(true);
                                    await deleteDayLog(id);
                                    window.location.reload();
                                }
                            }}
                            isDeleting={isDeleting}
                        />
                    </div>
                </div>
            </div>

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


