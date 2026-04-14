'use client'

import React from 'react'
import { Trash2, PlusCircle, Package, User, Hash, Clipboard, Activity, ChevronDown } from 'lucide-react'
import { Product, Member, LogEntry, TransactionType } from '@/lib/day-logs'
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
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-visible">
                <div className="border border-slate-200 rounded-[2rem] bg-white shadow-sm overflow-visible">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-6 py-5 w-[18%]"><div className="flex items-center gap-2"><Package className="w-3 h-3" /> Product Reference</div></th>
                                <th className="px-6 py-5 w-[80px]"><div className="flex items-center gap-2"><Hash className="w-3 h-3" /> Qty</div></th>
                                <th className="px-6 py-5 w-[150px]"><div className="flex items-center gap-2"><Activity className="w-3 h-3" /> Action</div></th>
                                <th className="px-6 py-5 w-[18%]"><div className="flex items-center gap-2"><User className="w-3 h-3" /> Taken By</div></th>
                                <th className="px-6 py-5"><div className="flex items-center gap-2"><Clipboard className="w-3 h-3" /> Purpose</div></th>
                                <th className="px-6 py-5 w-[60px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-4 py-4 overflow-visible">
                                        <SearchableSelect
                                            options={productOptions}
                                            value={entry.productId}
                                            placeholder="Search product..."
                                            onChange={(id, name) => {
                                                const product = products.find(p => p.id === id)
                                                onUpdateEntry(entry.id, 'productId', id)
                                                onUpdateEntry(entry.id, 'productName', name)
                                                onUpdateEntry(entry.id, 'productSku', product ? product.sku : '')
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-cashcrow-primary)] focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-sm font-black transition-all px-4 py-2.5 text-center"
                                            type="number"
                                            min="0"
                                            value={entry.quantity || ''}
                                            onChange={(e) => onUpdateEntry(entry.id, 'quantity', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="relative group/select">
                                            <select
                                                className={`w-full border shadow-sm focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-[10px] font-black transition-all px-4 py-2.5 appearance-none cursor-pointer ${getTransactionColor(entry.transactionType)}`}
                                                value={entry.transactionType}
                                                onChange={(e) => onUpdateEntry(entry.id, 'transactionType', e.target.value as TransactionType)}
                                            >
                                                <option value="IN">IN (RESTOCK)</option>
                                                <option value="OUT">OUT (USAGE)</option>
                                                <option value="RETURN">RETURN</option>
                                                <option value="ADJUST">ADJUST</option>
                                                <option value="SCRAP">SCRAP</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 overflow-visible">
                                        <SearchableSelect
                                            options={memberOptions}
                                            value={entry.takenBy}
                                            placeholder="Authorized by..."
                                            onChange={(id, name) => {
                                                onUpdateEntry(entry.id, 'takenBy', id)
                                                onUpdateEntry(entry.id, 'takenByName', name)
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <input
                                            className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-cashcrow-primary)] focus:ring-4 focus:ring-[var(--color-cashcrow-primary)]/10 rounded-xl text-sm font-medium transition-all px-4 py-2.5"
                                            placeholder="E.g. Project X assembly"
                                            type="text"
                                            value={entry.purpose}
                                            onChange={(e) => onUpdateEntry(entry.id, 'purpose', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => onRemoveRow(entry.id)}
                                            className="text-slate-300 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-50 active:scale-95"
                                            disabled={entries.length === 1}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {entries.map((entry, index) => (
                    <div key={entry.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-5 relative shadow-sm overflow-visible">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                                    {index + 1}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Line</span>
                            </div>
                            <button
                                onClick={() => onRemoveRow(entry.id)}
                                className="text-rose-400 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                                disabled={entries.length === 1}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Package className="w-3 h-3" /> Product Reference
                                </label>
                                <SearchableSelect
                                    options={productOptions}
                                    value={entry.productId}
                                    placeholder="Select inventory item..."
                                    onChange={(id, name) => {
                                        const product = products.find(p => p.id === id)
                                        onUpdateEntry(entry.id, 'productId', id)
                                        onUpdateEntry(entry.id, 'productName', name)
                                        onUpdateEntry(entry.id, 'productSku', product ? product.sku : '')
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Hash className="w-3 h-3" /> Quantity
                                    </label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black p-4 text-center focus:bg-white focus:border-[var(--color-cashcrow-primary)] transition-all"
                                        type="number"
                                        min="0"
                                        value={entry.quantity || ''}
                                        onChange={(e) => onUpdateEntry(entry.id, 'quantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Activity className="w-3 h-3" /> Action
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full rounded-2xl text-[10px] font-black p-4 appearance-none border shadow-sm transition-all ${getTransactionColor(entry.transactionType)}`}
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium p-4 focus:bg-white focus:border-[var(--color-cashcrow-primary)] transition-all"
                                    placeholder="Reason for movement..."
                                    type="text"
                                    value={entry.purpose}
                                    onChange={(e) => onUpdateEntry(entry.id, 'purpose', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Addition Row Button */}
            <button
                onClick={onAddRow}
                className="flex items-center justify-center gap-3 w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/[0.03] transition-all text-[12px] font-black uppercase tracking-[0.25em] group shadow-sm bg-white active:scale-[0.99]"
            >
                <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                Add New Transaction Line
            </button>
        </div>
    )
}

