"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Send, FileText } from "lucide-react"
import { saveDayLogDraft, submitDayLog, deleteDayLog } from "@/actions/day-logs"
import DayLogForm from "@/components/shared/day-logs/day-log-form"
import SubmittedLogsTable from "@/components/shared/day-logs/submitted-logs-table"
import LogDetailModal from "@/components/shared/day-logs/log-detail-modal"

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

            const submitResult = await submitDayLog(draftResult.id)

            if ('error' in submitResult) {
                alert(`Error submitting log: ${submitResult.error}`)
                setIsSubmitting(false)
                return
            }

            setEntries([initialEntry])
            setGlobalNotes('')
            setCurrentLogId(null)
            
            alert('Log submitted successfully!')
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
        <div className="space-y-6 md:space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Daily Log Entry</h2>
                        <p className="text-slate-500 text-sm md:text-base mt-1">Convert whiteboard notes into digital ledger transactions.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <Button 
                            onClick={handleSaveDraft}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Save Draft
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)]"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? 'Submitting...' : 'Submit Log'}
                        </Button>
                    </div>
                </div>
            </header>

            <DayLogForm
                entries={entries}
                products={products}
                members={members}
                onAddRow={addNewRow}
                onRemoveRow={removeEntry}
                onUpdateEntry={updateEntry}
            />

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Notes</label>
                <textarea 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[var(--color-cashcrow-primary)] focus:ring-1 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-xl transition-all px-4 py-3 resize-none"
                    placeholder="Additional notes for this log entry..."
                    rows={3}
                    value={globalNotes}
                    onChange={(e) => setGlobalNotes(e.target.value)}
                />
            </div>

            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center border">
                    <Search className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Pro Tip</h4>
                    <p className="text-base text-slate-500 leading-relaxed">Use Tab key to quickly move between product fields. Ctrl+Enter to submit.</p>
                </div>
            </div>

            <SubmittedLogsTable
                logs={submittedLogs}
                onView={handleViewLog}
                onDelete={handleDeleteLog}
                isDeleting={isDeleting}
            />

            {showViewModal && selectedLog && (
                <LogDetailModal 
                    log={selectedLog}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div>
    )
}

