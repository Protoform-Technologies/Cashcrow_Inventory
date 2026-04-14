'use client'

import React from 'react'
import { FileText, X, User, Activity, Package, Hash, Archive, Clipboard, Clock, CheckCircle2, History as HistoryIcon } from 'lucide-react'
import { DayLog, DayLogItem, TransactionType } from '@/lib/day-logs'

interface LogDetailModalProps {
    log: DayLog
    onClose: () => void
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
        full: date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }),
        time: date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }
}

export default function LogDetailModal({ log, onClose }: LogDetailModalProps) {
    const creator = log.profiles
    const dateInfo = formatDate(log.created_at)

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="bg-[var(--color-cashcrow-primary)] px-10 py-8 flex items-center justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-cashcrow-primary)] opacity-10 blur-[100px] pointer-events-none" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="size-14 rounded-2xl bg-[var(--color-cashcrow-primary)] flex items-center justify-center text-white shadow-2xl shadow-[var(--color-cashcrow-primary)]/40 animate-pulse">
                            <FileText className="size-7" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-black text-white tracking-tight">Transaction Ledger</h3>
                                <span className="px-3 py-1 bg-white/10 text-[var(--color-cashcrow-primary)] rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                    {log.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold tracking-[0.1em] flex items-center gap-2">
                                REQUISITION ID <span className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">{log.id.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose} 
                        className="size-12 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all flex items-center justify-center active:scale-90 group"
                    >
                        <X className="size-6 transition-transform group-hover:rotate-90" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    {/* Meta Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-xl text-[var(--color-cashcrow-primary)]">
                                {creator?.first_name?.charAt(0)}{creator?.last_name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Originator</p>
                                <p className="text-lg font-black text-slate-900 leading-tight truncate">
                                    {creator?.first_name} {creator?.last_name}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                                <Clock className="size-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Captured On</p>
                                <p className="text-lg font-black text-slate-900 leading-tight">
                                    {dateInfo.full}
                                </p>
                                <p className="text-xs font-bold text-[var(--color-cashcrow-primary)]">{dateInfo.time}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-[var(--color-cashcrow-primary)]/5 rounded-[2rem] border border-[var(--color-cashcrow-primary)]/10 flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[var(--color-cashcrow-primary)]">
                                <CheckCircle2 className="size-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">System Status</p>
                                <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter">
                                    Verified Log
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revalidated Path</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes (Conditional) */}
                    {log.notes && (
                        <div className="relative">
                            <h4 className="absolute -top-3 left-8 px-4 bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contextual Notes</h4>
                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-medium text-slate-600 leading-relaxed italic shadow-inner">
                                "{log.notes}"
                            </div>
                        </div>
                    )}

                    {/* Movement Items */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Asset Transferences</h4>
                                <div className="h-0.5 w-12 bg-slate-200 rounded-full" />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 bg-[var(--color-cashcrow-primary)]/20 px-4 py-1.5 rounded-full uppercase tracking-widest border border-[var(--color-cashcrow-primary)]/10">
                                {log.day_log_items?.length} Valid Movements
                            </span>
                        </div>
                        
                        {/* Hybrid Layout: Desktop Table / Mobile Cards */}
                        <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200">
                            <table className="w-full text-left hidden md:table">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                        <th className="px-10 py-6">Product & Reference</th>
                                        <th className="px-10 py-6">Type</th>
                                        <th className="px-10 py-6 text-center">Batch Qty</th>
                                        <th className="px-10 py-6">Accountability</th>
                                        <th className="px-10 py-6">Defined Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {log.day_log_items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                        <Package className="size-6 text-slate-300 group-hover:text-[var(--color-cashcrow-primary)] transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">{item.products?.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SKU: {item.products?.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border shadow-sm transition-all ${getTransactionColor(item.type)}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-center">
                                                <div className="inline-flex flex-col">
                                                    <span className="text-lg font-black text-slate-900">{item.qty}</span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-[var(--color-cashcrow-primary)]/10 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                                        {item.taken_by_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{item.taken_by_name || 'System Auto'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-xs font-bold text-slate-500 max-w-[240px] leading-relaxed">
                                                {item.purpose || 'General Inventory Allocation'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Grid */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {log.day_log_items?.map((item, idx) => (
                                    <div key={idx} className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <Package className="size-5 text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{item.products?.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{item.products?.sku}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-lg border text-[10px] font-black ${getTransactionColor(item.type)}`}>
                                                {item.type} x{item.qty}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Responsibility</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="size-5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                                                        {item.taken_by_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-700">{item.taken_by_name || 'System'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose</p>
                                                <p className="text-[11px] font-bold text-slate-700 truncate">{item.purpose || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 text-center flex items-center justify-center gap-3">
                    <HistoryIcon className="size-3 text-slate-400" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Vault Log Entry &bull; Cryptographic Proof of Transference</p>
                </div>
            </div>
        </div>
    )
}

