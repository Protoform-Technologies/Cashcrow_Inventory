'use client'

import { FileText, X } from 'lucide-react'

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

interface LogDetailModalProps {
    log: SubmittedLog
    onClose: () => void
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

export default function LogDetailModal({ log, onClose }: LogDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Log Details</h3>
                        <p className="text-slate-500 text-sm">Submitted on {formatDate(log.created_at)}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Creator Info */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-cashcrow-primary)]/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[var(--color-cashcrow-primary)]" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">
                                {log.profiles?.first_name} {log.profiles?.last_name}
                            </p>
                            <p className="text-sm text-slate-500">{log.profiles?.email}</p>
                        </div>
                        <div className="ml-auto">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                {log.status}
                            </span>
                        </div>
                    </div>

                    {/* Notes */}
                    {log.notes && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Notes</h4>
                            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">{log.notes}</p>
                        </div>
                    )}

                    {/* Items Table */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Items</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3 text-right">Qty</th>
                                        <th className="px-4 py-3">Taken By</th>
                                        <th className="px-4 py-3">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {log.day_log_items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-semibold text-slate-900">{item.products?.name}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{item.products?.sku}</code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${getTransactionColor(item.type)}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">{item.qty}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{item.taken_by_name || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{item.purpose || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

