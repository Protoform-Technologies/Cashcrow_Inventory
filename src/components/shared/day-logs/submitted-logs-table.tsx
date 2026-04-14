'use client'

import React from 'react'
import { FileText, Eye, Trash2, Loader2, User, Clock, Package, CheckCircle2 } from 'lucide-react'
import { DayLog, DayLogItem, TransactionType } from '@/lib/day-logs'

interface SubmittedLogsTableProps {
    logs: DayLog[]
    onView?: (log: DayLog) => void
    onDelete?: (logId: string) => void
    isDeleting?: boolean
}

const getTransactionColor = (type: TransactionType) => {
    switch (type) {
        case 'IN': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        case 'OUT': return 'bg-slate-100 text-slate-700 border-slate-200'
        case 'RETURN': return 'bg-sky-100 text-sky-700 border-sky-200'
        case 'ADJUST': return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'SCRAP': return 'bg-rose-100 text-rose-700 border-rose-200'
        default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
}

const LogCard = ({ log, onView, onDelete, isDeleting }: { log: DayLog } & Pick<SubmittedLogsTableProps, 'onView' | 'onDelete' | 'isDeleting'>) => {
    const { date, time } = formatDate(log.created_at)
    const creator = log.profiles

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[var(--color-cashcrow-primary)]/20 transition-all duration-500 overflow-hidden group">
            <div className="p-8 space-y-6">
                {/* Header: Date & Time */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[var(--color-cashcrow-primary)] group-hover:text-white transition-all duration-500 shadow-inner">
                            <Clock className="size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{time}</p>
                            <h4 className="text-xl font-black text-slate-900 leading-none mt-1">{date}</h4>
                        </div>
                    </div>
                    <div className="px-4 py-1.5 bg-[var(--color-cashcrow-primary)]/10 text-[var(--color-cashcrow-primary)] rounded-full text-[9px] font-black uppercase tracking-widest border border-[var(--color-cashcrow-primary)]/10">
                        {log.day_log_items?.length || 0} Entries
                    </div>
                </div>

                {/* Creator Section */}
                <div className="bg-slate-50/50 rounded-[2rem] p-5 flex items-center gap-4 border border-slate-100 transition-colors group-hover:bg-white group-hover:border-[var(--color-cashcrow-primary)]/10">
                    <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm text-[var(--color-cashcrow-primary)] shadow-sm group-hover:scale-105 transition-transform">
                        {creator?.first_name?.charAt(0)}{creator?.last_name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Authorized Log</p>
                        <p className="text-sm font-black text-slate-900 truncate">{creator?.first_name} {creator?.last_name}</p>
                    </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Inventory Sync</p>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {log.day_log_items?.slice(0, 4).map((item, idx) => (
                            <div key={idx} className={`px-3 py-1.5 rounded-xl border text-[10px] font-black shadow-sm transition-transform hover:scale-105 ${getTransactionColor(item.type)}`}>
                                {item.type} <span className="opacity-30 mx-1">|</span> {item.qty}
                            </div>
                        ))}
                        {log.day_log_items && log.day_log_items.length > 4 && (
                            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors">
                                +{log.day_log_items.length - 4} Others
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button 
                        onClick={() => onView?.(log)}
                        className="flex-1 h-12 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Eye className="size-4" />
                        Review
                    </button>
                    {onDelete && (
                        <button 
                            onClick={() => onDelete(log.id)}
                            disabled={isDeleting}
                            className="size-12 bg-white border border-slate-200 rounded-2xl text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90 disabled:opacity-50 group/del"
                        >
                            {isDeleting ? <Loader2 className="size-4 animate-spin text-rose-500" /> : <Trash2 className="size-5 transition-transform group-hover/del:scale-110" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function SubmittedLogsTable({ logs, onView, onDelete, isDeleting }: SubmittedLogsTableProps) {
    if (logs.length === 0) return null

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 md:px-2">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-[var(--color-cashcrow-primary)] flex items-center justify-center text-white shadow-xl shadow-[var(--color-cashcrow-primary)]/20">
                        <FileText className="size-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ledger Archives</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Immutable proof of all inventory movements</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Package className="size-3 text-[var(--color-cashcrow-primary)]" />
                    {logs.length} Total Records
                </div>
            </div>

            {/* Mobile View: Vertical Cards */}
            <div className="grid grid-cols-1 md:hidden gap-8 px-4">
                {logs.map((log) => (
                    <LogCard key={log.id} log={log} onView={onView} onDelete={onDelete} isDeleting={isDeleting} />
                ))}
            </div>

            {/* Desktop View: Styled Table */}
            <div className="hidden md:block bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-left">Transaction Date</th>
                            <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-left">Operational Member</th>
                            <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-left">Movement Buffer</th>
                            <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-left">Verification</th>
                            <th className="px-10 py-7 text-right w-[140px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => {
                            const { date, time } = formatDate(log.created_at)
                            const creator = log.profiles

                            return (
                                <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[var(--color-cashcrow-primary)] group-hover:text-white transition-all duration-500 shadow-sm">
                                                <Clock className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{date}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{time}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-[10px] text-[var(--color-cashcrow-primary)] group-hover:scale-105 transition-transform">
                                                {creator?.first_name?.charAt(0)}{creator?.last_name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-900 truncate max-w-[180px]">
                                                    {creator?.first_name} {creator?.last_name}
                                                </p>
                                                <p className="text-[10px] font-black text-slate-400 truncate max-w-[180px] uppercase tracking-tighter opacity-60">ADMINISTRATOR</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-wrap gap-2">
                                            {log.day_log_items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className={`px-3 py-1.5 rounded-xl border text-[10px] font-black shadow-sm transition-colors ${getTransactionColor(item.type)}`}>
                                                    {item.type} <span className="opacity-30 mx-1">|</span> {item.qty}
                                                </div>
                                            ))}
                                            {log.day_log_items && log.day_log_items.length > 3 && (
                                                <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-black text-slate-400">
                                                    +{log.day_log_items.length - 3} Units
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full bg-[var(--color-cashcrow-primary)] animate-pulse shadow-[0_0_10px_rgba(var(--color-cashcrow-primary-rgb),0.5)]" />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                                <CheckCircle2 className="size-3 text-[var(--color-cashcrow-primary)]" />
                                                Verified
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-500">
                                            {onView && (
                                                <button 
                                                    onClick={() => onView(log)}
                                                    className="size-11 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[var(--color-cashcrow-primary)] hover:border-[var(--color-cashcrow-primary)]/40 hover:shadow-2xl hover:shadow-[var(--color-cashcrow-primary)]/20 transition-all flex items-center justify-center active:scale-90"
                                                >
                                                    <Eye className="size-5" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button 
                                                    onClick={() => onDelete(log.id)}
                                                    disabled={isDeleting}
                                                    className="size-11 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100 transition-all flex items-center justify-center active:scale-90"
                                                >
                                                    {isDeleting ? <Loader2 className="size-5 animate-spin" /> : <Trash2 className="size-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

