'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Search, Send, FileText } from 'lucide-react'
import { saveDayLogDraft, submitDayLog, deleteDayLog } from '@/actions/day-logs'
import DayLogForm from '@/components/dashboard/day-log-form'
import SubmittedLogsTable from '@/components/dashboard/submitted-logs-table'
import LogDetailModal from '@/components/dashboard/log-detail-modal'

interface Product {
    id: string
    name: string
    sku: string
    category: string
    quantity: number
}

interface Member {
    id: string
    first_name: string
    last_name: string
}

interface DayLogItem {
    id: string
    part_id: string
    type: string
    qty: number
    taken_by: string
    purpose: string
    notes: string
    created_at: string
    products: {
        name: string
        sku: string
        quantity: number
    }
    taken_by_name?: string | null
}

interface SubmittedLog {
    id: string
    created_by: string
    status: string
    notes: string
    created_at: string
    day_log_items: DayLogItem[]
    profiles: {
        first_name: string
        last_name: string
        email: string
    }
}

type TransactionType = 'IN' | 'OUT' | 'RETURN' | 'ADJUST' | 'SCRAP'

interface LogEntry {
    id: string
    productId: string
    productName: string
    productSku: string
    quantity: number
    transactionType: TransactionType
    takenBy: string
    takenByName: string
    purpose: string
}

interface DailyLogClientProps {
    userName: string
    userId: string
    products: Product[]
    members: Member[]
    submittedLogs: SubmittedLog[]
}

const initialEntry: LogEntry = {
    id: '1',
    productId: '',
    productName: '',
    productSku: '',
    quantity: 0,
    transactionType: 'OUT',
    takenBy: '',
    takenByName: '',
    purpose: ''
}

export default function DailyLogClient({ userName, userId, products, members, submittedLogs }: DailyLogClientProps) {
    const [entries, setEntries] = useState<LogEntry[]>([initialEntry])
    const [globalNotes, setGlobalNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentLogId, setCurrentLogId] = useState<string | null>(null)
    
    // For submitted logs
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedLog, setSelectedLog] = useState<SubmittedLog | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const generateId = () => Math.random().toString(36).substr(2, 9)

    const addNewRow = () => {
        setEntries([...entries, {
            id: generateId(),
            productId: '',
            productName: '',
            productSku: '',
            quantity: 0,
            transactionType: 'OUT',
            takenBy: '',
            takenByName: '',
            purpose: ''
        }])
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
        setIsSubmitting(true)
        
        const validEntries = entries.filter(e => e.productId && e.quantity > 0)

        if (validEntries.length === 0) {
            alert('Please add at least one valid log entry')
            setIsSubmitting(false)
            return
        }

        try {
            // First save as draft
            const draftResult = await saveDayLogDraft(
                currentLogId,
                validEntries,
                userId,
                globalNotes
            )

            if ('error' in draftResult) {
                alert(`Error saving draft: ${draftResult.error}`)
                setIsSubmitting(false)
                return
            }

            setCurrentLogId(draftResult.id)

            // Then submit
            const submitResult = await submitDayLog(draftResult.id)

            if ('error' in submitResult) {
                alert(`Error submitting log: ${submitResult.error}`)
                setIsSubmitting(false)
                return
            }

            // Reset form after successful submission
            setEntries([initialEntry])
            setGlobalNotes('')
            setCurrentLogId(null)
            
            alert('Log submitted successfully!')
            // Reload to get updated list
            window.location.reload()
        } catch (error) {
            console.error('Error submitting log:', error)
            alert('An error occurred while submitting the log')
        }
        
        setIsSubmitting(false)
    }

    const handleSaveDraft = async () => {
        const validEntries = entries.filter(e => e.productId && e.quantity > 0)

        try {
            const result = await saveDayLogDraft(
                currentLogId,
                validEntries,
                userId,
                globalNotes
            )

            if ('error' in result) {
                alert(`Error saving draft: ${result.error}`)
                return
            }

            setCurrentLogId(result.id)
            alert('Draft saved!')
        } catch (error) {
            console.error('Error saving draft:', error)
            alert('An error occurred while saving the draft')
        }
    }

    const handleViewLog = (log: SubmittedLog) => {
        setSelectedLog(log)
        setShowViewModal(true)
    }

    const handleDeleteLog = async (logId: string) => {
        if (!confirm('Are you sure you want to delete this log? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        const result = await deleteDayLog(logId)
        
        if ('error' in result) {
            alert(`Error deleting log: ${result.error}`)
        } else {
            alert('Log deleted successfully!')
            window.location.reload()
        }
        
        setIsDeleting(false)
    }

    return (
        <DashboardLayout userName={userName} userRole="Lab Director" title="Daily Log Entry">
            {/* Header */}
            <header className="px-4 md:px-8 py-4 md:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Daily Log Entry</h2>
                        <p className="text-slate-500 text-sm">Convert whiteboard notes into digital ledger transactions.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                        <Button 
                            onClick={handleSaveDraft}
                            variant="outline"
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-xs md:text-sm font-semibold border border-slate-200"
                        >
                            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Save as Draft</span>
                            <span className="sm:hidden">Draft</span>
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white rounded-xl transition-all text-xs md:text-sm font-semibold shadow-lg"
                        >
                            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="px-3 md:px-8 pb-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
                {/* Log Entry Form */}
                <DayLogForm
                    entries={entries}
                    products={products}
                    members={members}
                    onAddRow={addNewRow}
                    onRemoveRow={removeEntry}
                    onUpdateEntry={updateEntry}
                />

                {/* Notes Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm md:col-span-2 flex flex-col gap-2 md:gap-3">
                        <label className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">Notes</label>
                        <textarea 
                            className="w-full bg-slate-100 border-transparent focus:border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-xl text-xs md:text-sm transition-all px-3 md:px-4 py-2 md:py-3 resize-none"
                            placeholder="Add notes..."
                            rows={2}
                            value={globalNotes}
                            onChange={(e) => setGlobalNotes(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Tip Section */}
                <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-200/50 border border-slate-300">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">Tip</h4>
                        <p className="text-xs md:text-sm text-slate-500">Use Tab to jump between fields.</p>
                    </div>
                </div>
            </div>

            {/* Submitted Logs Section */}
            <SubmittedLogsTable
                logs={submittedLogs}
                onView={handleViewLog}
                onDelete={handleDeleteLog}
                isDeleting={isDeleting}
            />

            {/* View Modal */}
            {showViewModal && selectedLog && (
                <LogDetailModal 
                    log={selectedLog}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </DashboardLayout>
    )
}

