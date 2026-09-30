'use client'

import React from 'react'
import { Package, Eye, Trash2, Clock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { DayLog, TransactionType } from '@/types/day-logs'
import Image from 'next/image'

interface SubmittedLogsTableProps {
    logs: DayLog[]
    onView: (log: DayLog) => void
    onDelete: (id: string) => void
    isDeleting?: boolean
    userRole?: string
}

const getTransactionStyles = (type: TransactionType) => {
    switch (type) {
        case 'IN': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'OUT': return 'bg-slate-50 text-slate-600 border-slate-200'
        case 'RETURN': return 'bg-sky-50 text-sky-600 border-sky-100'
        case 'ADJUST': return 'bg-orange-50 text-orange-600 border-orange-100'
        case 'SCRAP': return 'bg-red-50 text-red-600 border-red-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
}

export default function SubmittedLogsTable({ logs, onView, onDelete, isDeleting, userRole }: SubmittedLogsTableProps) {
    // Hydration fix
    const [isClient, setIsClient] = React.useState(false)
    React.useEffect(() => { setIsClient(true) }, [])

    if (logs.length === 0) {
        return (
            <div className="p-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
                <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 border border-slate-100">
                    <ShieldCheck className="size-8" />
                </div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Zero Trace Identifiers Found</h4>
            </div>
        )
    }

    const formatDate = (dateStr: string) => {
        if (!isClient) return { date: '...', time: '...' }
        const d = new Date(dateStr)
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mobile: d.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                <th className="px-6 py-5">Timestamp</th>
                                <th className="px-6 py-5">Item Identifier</th>
                                <th className="px-6 py-5">Log Buffer</th>
                                <th className="px-6 py-5">Taken By</th>
                                <th className="px-6 py-5 text-right w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => {
                                const { date, time } = formatDate(log.created_at)
                                const item = log.day_log_items?.[0]
                                const product = item?.products

                                return (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                    <Clock className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{date}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{time}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    {product?.image_url ? (
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <Package className="size-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors leading-tight">{product?.name || 'Unknown Item'}</p>
                                                    <code className="text-[11px] text-slate-400 font-mono mt-1 block tracking-wider">{product?.sku || 'N/A'}</code>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider border ${getTransactionStyles(item?.type || 'OUT')}`}>
                                                <ArrowRight className="size-3 opacity-50" />
                                                {item?.type} | {item?.qty} Units
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm ring-1 ring-slate-100 shrink-0 overflow-hidden">
                                                    {item?.taken_by_avatar_url ? (
                                                        <Image
                                                            src={item.taken_by_avatar_url}
                                                            alt={item?.taken_by_name || 'User'}
                                                            width={36}
                                                            height={36}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        item?.taken_by_name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <p className="text-[13px] font-bold text-slate-800">{item?.taken_by_name || 'System'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => onView(log)}
                                                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                {userRole === 'ADMIN' && (
                                                    <button 
                                                        onClick={() => onDelete(log.id)}
                                                        disabled={isDeleting}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete Log"
                                                    >
                                                        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
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

            {/* High-Density Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {logs.map((log) => {
                    const { date, time } = formatDate(log.created_at)
                    const item = log.day_log_items?.[0]
                    const product = item?.products

                    return (
                        <div key={log.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden active:scale-[0.99] transition-all">
                            <div className="p-4 space-y-4">
                                {/* Top Section: Identity */}
                                <div className="flex gap-4">
                                    <div className="size-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                        {product?.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                width={56}
                                                height={56}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <Package className="size-6 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[14px] font-black text-slate-900 leading-tight truncate">{product?.name || 'Unknown Item'}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 mb-1.5">Electronic Ledger Record</p>
                                        <code className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono">
                                            {product?.sku || 'N/A'}
                                        </code>
                                    </div>
                                </div>

                                {/* Middle Section: Transactional Logic */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                    <div className="space-y-1">
                                        <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-widest border inline-block mb-1 ${getTransactionStyles(item?.type || 'OUT')}`}>
                                            {item?.type}
                                        </span>
                                        <p className="text-sm font-black text-slate-900 leading-none">
                                            {item?.qty} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Units</span>
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Accounted By</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="text-[11px] font-black text-slate-700 truncate max-w-[100px]">{item?.taken_by_name || 'System'}</p>
                                            <div className="size-6 rounded-full bg-slate-100 border border-white shadow-sm ring-1 ring-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400 overflow-hidden">
                                                {item?.taken_by_avatar_url ? (
                                                    <Image
                                                        src={item.taken_by_avatar_url}
                                                        alt={item?.taken_by_name || 'User'}
                                                        width={24}
                                                        height={24}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    item?.taken_by_name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Section: Time & Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-slate-800 leading-none">{date}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onView(log)}
                                            className="flex-1 p-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            <Eye className="size-3.5" /> View Record
                                        </button>
                                        {userRole === 'ADMIN' && (
                                            <button 
                                                onClick={() => onDelete(log.id)}
                                                disabled={isDeleting}
                                                className="flex-1 p-2 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-3.5" />} Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
