'use client'

import { FileText, Eye, Trash2, Loader2 } from 'lucide-react'

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

interface SubmittedLogsTableProps {
    logs: SubmittedLog[]
    onView: (log: SubmittedLog) => void
    onDelete: (logId: string) => void
    isDeleting: boolean
}

function getTransactionColor(type: string) {
    switch (type) {
        case 'IN': return 'bg-green-100 text-green-700'
        case 'OUT': return 'bg-red-100 text-red-700'
        case 'RETURN': return 'bg-blue-100 text-blue-700'
        case 'ADJUST': return 'bg-amber-100 text-amber-700'
        case 'SCRAP': return 'bg-slate-100 text-slate-700'
        default: return 'bg-slate-100 text-slate-700'
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export default function SubmittedLogsTable({ logs, onView, onDelete, isDeleting }: SubmittedLogsTableProps) {
    if (logs.length === 0) {
        return null
    }

    return (
        <div className="px-8 pb-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Submitted Logs History</h3>
                    <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2.5 py-1 rounded-full">
                        {logs.length}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Created By</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Notes</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">{formatDate(log.created_at)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-700">
                                            {log.profiles?.first_name} {log.profiles?.last_name}
                                        </p>
                                        <p className="text-xs text-slate-500">{log.profiles?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {log.day_log_items?.slice(0, 3).map((item, idx) => (
                                                <span key={idx} className={`px-2 py-1 text-[10px] font-bold rounded ${getTransactionColor(item.type)}`}>
                                                    {item.type} x{item.qty}
                                                </span>
                                            ))}
                                            {log.day_log_items?.length > 3 && (
                                                <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded">
                                                    +{log.day_log_items.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 max-w-[200px] truncate">
                                            {log.notes || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onView(log)}
                                                className="p-2 text-slate-400 hover:text-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/10 transition-colors rounded-lg"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(log.id)}
                                                disabled={isDeleting}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                                                title="Delete Log"
                                            >
                                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

