'use client'

import React from 'react'
import { X, User, Package, Clock, ShieldCheck, FileText, Info, Hash, MapPin } from 'lucide-react'
import { DayLog, TransactionType } from '@/lib/day-logs'
import Image from 'next/image'

interface LogDetailModalProps {
    log: DayLog
    onClose: () => void
}

const getTransactionStyles = (type: TransactionType) => {
    switch (type) {
        case 'IN': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
        case 'OUT': return 'bg-slate-50 text-slate-700 border-slate-200'
        case 'RETURN': return 'bg-sky-50 text-sky-700 border-sky-100'
        case 'ADJUST': return 'bg-orange-50 text-orange-700 border-orange-100'
        case 'SCRAP': return 'bg-red-50 text-red-700 border-red-100'
        default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
        date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
}

export default function LogDetailModal({ log, onClose }: LogDetailModalProps) {
    const creator = log.profiles
    const item = log.day_log_items?.[0]
    const product = item?.products
    const dateInfo = formatDate(log.created_at)

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Audit Trace Detail</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Reference ID: {log.id.slice(0, 13).toUpperCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center active:scale-95"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Primary Asset Section */}
                    <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div className="size-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            {product?.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <Package className="size-10 text-slate-200" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 leading-tight">{product?.name || 'Unknown Asset'}</h4>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${getTransactionStyles(item?.type || 'OUT')}`}>
                                    {item?.type}
                                </span>
                            </div>
                            <div className="mt-4 flex gap-4">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Impact</p>
                                    <p className="text-sm font-black text-slate-900">{item?.qty} <span className="text-[10px] text-slate-400">Units</span></p>
                                </div>
                                <div className="pl-4 border-l border-slate-200">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Internal SKU</p>
                                    <p className="text-sm font-mono font-bold text-slate-600">{product?.sku || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Standard Log Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 px-2">
                        {/* Purpose */}
                        {item?.purpose && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Info className="size-3.5 text-slate-400" />
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Strategic Purpose</label>
                                </div>
                                <p className="text-[14px] font-bold text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                                    {item.purpose}
                                </p>
                            </div>
                        )}

                        {/* Handover Responsibility */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="size-3.5 text-slate-400" />
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Taken By</label>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 border border-white ring-1 ring-slate-100 overflow-hidden">
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
                                <div>
                                    <p className="text-[14px] font-black text-slate-900 leading-none">{item?.taken_by_name || 'System Managed'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Log Created By */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-3.5 text-emerald-500" />
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Trace Recorded By</label>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl">
                                <div className="size-9 rounded-full bg-white flex items-center justify-center text-[11px] font-black text-emerald-600 border border-emerald-100 overflow-hidden">
                                    {creator?.avatar_url ? (
                                        <Image 
                                            src={creator.avatar_url} 
                                            alt={`${creator.first_name} ${creator.last_name}`} 
                                            width={36} 
                                            height={36} 
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        `${creator?.first_name?.charAt(0)}${creator?.last_name?.charAt(0)}`
                                    )}
                                </div>
                                <div>
                                    <p className="text-[14px] font-black text-slate-900 leading-none">{creator?.first_name} {creator?.last_name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-slate-400" />
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Temporal Signature</label>
                            </div>
                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                <p className="text-[14px] font-black text-slate-900 leading-none">{dateInfo.date}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-[0.2em]">{dateInfo.time}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
