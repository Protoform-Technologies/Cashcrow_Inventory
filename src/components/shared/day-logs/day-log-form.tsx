'use client'

import React from 'react'
import { Trash2, PlusCircle, Package, User, Hash, Clipboard, Activity, ChevronDown } from 'lucide-react'
import { Product, Member, LogEntry, TransactionType } from '@/types/day-logs'
import SearchableSelect, { Option } from '../searchable-select'

interface DayLogFormProps {
    entries: LogEntry[]
    products: Product[]
    members: Member[]
    onAddRow: () => void
    onRemoveRow: (id: string) => void
    onUpdateEntry: (id: string, field: keyof LogEntry, value: string | number) => void
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

export default function DayLogForm({
    entries,
    products,
    members,
    onAddRow,
    onRemoveRow,
    onUpdateEntry
}: DayLogFormProps) {

    // Prepare options for searchable select
    const productOptions: Option[] = products.map(p => ({
        id: p.id,
        name: p.name,
        sub: p.sku,
        image_url: p.image_url
    }))

    const memberOptions: Option[] = members.map(m => ({
        id: m.id,
        name: `${m.first_name} ${m.last_name}`,
        sub: m.role,
        image_url: (m as any).avatar_url
    }))

    return (
        <div className="space-y-6">
            {/* Optimized Desktop 2-Line Grid Layout */}
            <div className="hidden md:block space-y-6">
                {entries.map((index_entry, index) => {
                    const selectedProduct = products.find(p => p.id === index_entry.productId)
                    const isOutbound = ['OUT', 'SCRAP', 'ADJUST'].includes(index_entry.transactionType)
                    const maxStock = selectedProduct ? selectedProduct.quantity : 0
                    const newBalance = selectedProduct ? (isOutbound ? selectedProduct.quantity - index_entry.quantity : selectedProduct.quantity + index_entry.quantity) : null

                    return (
                        <div key={index_entry.id} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm group hover:border-[var(--color-cashcrow-primary)]/30 transition-all relative overflow-visible">
                            {/* Transaction Indicator */}
                            <div className="absolute top-0 left-10 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-cashcrow-primary)] rounded-full flex items-center gap-2 shadow-lg z-10">
                                <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Entry</span>
                                <span className="text-[10px] font-black text-white">{index + 1}</span>
                            </div>

                            <div className="space-y-6">
                                {/* Line 1: Primary Inventory Data */}
                                <div className="grid grid-cols-12 gap-8 items-end">
                                    <div className="col-span-7 space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            <Package className="w-3 h-3 text-[var(--color-cashcrow-primary)]" />
                                            Product Reference (Full Details Visible)
                                        </label>
                                        <SearchableSelect
                                            options={productOptions}
                                            value={index_entry.productId}
                                            placeholder="Identify inventory item..."
                                            onChange={(id, name) => {
                                                const product = products.find(p => p.id === id)
                                                onUpdateEntry(index_entry.id, 'productId', id)
                                                onUpdateEntry(index_entry.id, 'productName', name)
                                                onUpdateEntry(index_entry.id, 'productSku', product ? product.sku : '')
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1 space-y-3 relative">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            QTY
                                        </label>
                                        <div className="relative">
                                            <input
                                                className={`w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-cashcrow-primary)] focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-sm font-black transition-all px-2 py-3 text-center ${isOutbound && index_entry.quantity > maxStock ? 'border-rose-500 text-rose-600 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
                                                type="number"
                                                min="0"
                                                max={isOutbound ? maxStock : undefined}
                                                value={index_entry.quantity || ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0
                                                    onUpdateEntry(index_entry.id, 'quantity', val)
                                                }}
                                                placeholder="0"
                                            />
                                            {isOutbound && selectedProduct && (
                                                <div className="absolute -bottom-6 left-0 right-0 text-center">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${index_entry.quantity > maxStock ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                                        Max: {maxStock}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-4 space-y-2">
                                        <label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-3 h-3 text-[var(--color-cashcrow-primary)]" />
                                                Transaction Type
                                            </div>
                                            {selectedProduct && index_entry.quantity > 0 && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                                                    <span className="text-slate-400">Stock: {selectedProduct.quantity}</span>
                                                    <span className="text-slate-300">→</span>
                                                    <span className={newBalance && newBalance < 0 ? 'text-rose-500' : 'text-emerald-500'}>
                                                        {newBalance}
                                                    </span>
                                                </div>
                                            )}
                                        </label>
                                        <div className="relative group/select">
                                            <select
                                                className={`w-full border shadow-sm focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-[11px] font-black transition-all px-5 py-3 appearance-none cursor-pointer tracking-wider ${getTransactionColor(index_entry.transactionType)}`}
                                                value={index_entry.transactionType}
                                                onChange={(e) => onUpdateEntry(index_entry.id, 'transactionType', e.target.value as TransactionType)}
                                            >
                                                <option value="IN">IN (RESTOCK)</option>
                                                <option value="OUT">OUT (USAGE)</option>
                                                <option value="RETURN">RETURN TO SHELF</option>
                                                <option value="ADJUST">ADJUST (AUDIT)</option>
                                                <option value="SCRAP">SCRAP / DAMAGE</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                {/* Line 2: Responsible Member & Purpose */}
                                <div className="grid grid-cols-12 gap-8 items-end pt-6 border-t border-slate-50">
                                    <div className="col-span-4 space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            <User className="w-3 h-3 text-[var(--color-cashcrow-primary)]" />
                                            Authorized By
                                        </label>
                                        <SearchableSelect
                                            options={memberOptions}
                                            value={index_entry.takenBy}
                                            placeholder="Select authorized member..."
                                            onChange={(id, name) => {
                                                onUpdateEntry(index_entry.id, 'takenBy', id)
                                                onUpdateEntry(index_entry.id, 'takenByName', name)
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-7 space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            <Clipboard className="w-3 h-3 text-[var(--color-cashcrow-primary)]" />
                                            Context / Transaction Purpose
                                        </label>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-cashcrow-primary)] focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-sm font-medium transition-all px-5 py-3"
                                            placeholder="Reason for movement or project reference..."
                                            type="text"
                                            value={index_entry.purpose}
                                            onChange={(e) => onUpdateEntry(index_entry.id, 'purpose', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-end pb-1.5">
                                        <button
                                            onClick={() => onRemoveRow(index_entry.id)}
                                            className="text-slate-200 hover:text-rose-500 transition-all p-3 rounded-xl hover:bg-rose-50 active:scale-95 disabled:opacity-0"
                                            disabled={entries.length === 1}
                                            title="Delete Entry"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Mobile Card View (Enhanced Response) */}
            <div className="md:hidden space-y-4">
                {entries.map((entry, index) => {
                    const selectedProduct = products.find(p => p.id === entry.productId)
                    const isOutbound = ['OUT', 'SCRAP', 'ADJUST'].includes(entry.transactionType)
                    const maxStock = selectedProduct ? selectedProduct.quantity : 0

                    return (
                        <div key={entry.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 relative shadow-sm overflow-visible">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-[var(--color-cashcrow-primary)] rounded-full flex items-center gap-2 shadow-sm">
                                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest whitespace-nowrap">Entry</span>
                                        <span className="text-[10px] font-black text-white">{index + 1}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Transaction</span>
                                </div>
                                <button
                                    onClick={() => onRemoveRow(entry.id)}
                                    className="text-rose-400 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                                    disabled={entries.length === 1}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Package className="w-3 h-3" /> Product Reference
                                    </label>
                                    <SearchableSelect
                                        options={productOptions}
                                        value={entry.productId}
                                        placeholder="Select item..."
                                        onChange={(id, name) => {
                                            const product = products.find(p => p.id === id)
                                            onUpdateEntry(entry.id, 'productId', id)
                                            onUpdateEntry(entry.id, 'productName', name)
                                            onUpdateEntry(entry.id, 'productSku', product ? product.sku : '')
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-5 space-y-2 relative">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            QTY
                                        </label>
                                        <input
                                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl text-sm font-black p-4 text-center focus:bg-white transition-all ${isOutbound && entry.quantity > maxStock ? 'border-rose-500 text-rose-600' : ''}`}
                                            type="number"
                                            min="0"
                                            value={entry.quantity || ''}
                                            onChange={(e) => onUpdateEntry(entry.id, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                        {isOutbound && selectedProduct && (
                                            <span className={`absolute -bottom-4 left-0 right-0 text-center text-[8px] font-black uppercase tracking-tighter ${entry.quantity > maxStock ? 'text-rose-500' : 'text-slate-400'}`}>
                                                Max Available: {maxStock}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-7 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            TYPE
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`w-full rounded-xl text-[10px] font-black p-4 appearance-none border shadow-sm transition-all ${getTransactionColor(entry.transactionType)}`}
                                                value={entry.transactionType}
                                                onChange={(e) => onUpdateEntry(entry.id, 'transactionType', e.target.value as TransactionType)}
                                            >
                                                <option value="IN">IN</option>
                                                <option value="OUT">OUT</option>
                                                <option value="RETURN">RETURN</option>
                                                <option value="ADJUST">ADJUST</option>
                                                <option value="SCRAP">SCRAP</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <User className="w-3 h-3" /> Authorized By
                                    </label>
                                    <SearchableSelect
                                        options={memberOptions}
                                        value={entry.takenBy}
                                        placeholder="Responsible member..."
                                        onChange={(id, name) => {
                                            onUpdateEntry(entry.id, 'takenBy', id)
                                            onUpdateEntry(entry.id, 'takenByName', name)
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Clipboard className="w-3 h-3" /> Purpose
                                    </label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium p-4 focus:bg-white transition-all"
                                        placeholder="Reason for movement..."
                                        type="text"
                                        value={entry.purpose}
                                        onChange={(e) => onUpdateEntry(entry.id, 'purpose', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <button
                onClick={onAddRow}
                className="flex items-center justify-center gap-3 w-full py-5 bg-white border border-slate-200 hover:border-[var(--color-cashcrow-primary)]/50 hover:bg-[var(--color-cashcrow-primary)]/[0.02] rounded-xl text-[var(--color-cashcrow-primary)] transition-all text-xs font-black uppercase tracking-widest group shadow-sm active:scale-[0.99] mt-4"
            >
                <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                Add New Transaction
            </button>
        </div>
    )
}
