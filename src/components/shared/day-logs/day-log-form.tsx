'use client'

import { Trash2, PlusCircle } from 'lucide-react'

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

interface DayLogFormProps {
    entries: LogEntry[]
    products: Product[]
    members: Member[]
    onAddRow: () => void
    onRemoveRow: (id: string) => void
    onUpdateEntry: (id: string, field: keyof LogEntry, value: string | number) => void
}

export default function DayLogForm({ 
    entries, 
    products, 
    members, 
    onAddRow, 
    onRemoveRow, 
    onUpdateEntry 
}: DayLogFormProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto -mx-2 md:mx-0">
                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                    <thead>
                        <tr className="bg-slate-50/80">
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Part</th>
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider w-[80px] md:w-[120px]">Qty</th>
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider w-[100px] md:w-[180px]">Type</th>
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">By</th>
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</th>
                            <th className="px-2 md:px-4 py-3 md:py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider w-[50px] md:w-[80px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-2 md:px-4 py-2 md:py-3">
                                    <select
                                        className="w-full bg-slate-100 border-transparent focus:border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-lg text-xs md:text-sm transition-all px-2 md:px-3 py-1.5 md:py-2 appearance-none"
                                        value={entry.productId}
                                        onChange={(e) => {
                                            const product = products.find(p => p.id === e.target.value)
                                            onUpdateEntry(entry.id, 'productId', e.target.value)
                                            onUpdateEntry(entry.id, 'productName', product ? product.name : '')
                                            onUpdateEntry(entry.id, 'productSku', product ? product.sku : '')
                                        }}
                                    >
                                        <option value="">Select product...</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-2 md:px-4 py-2 md:py-3">
                                    <input
                                        className="w-full bg-slate-100 border-transparent focus:border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-lg text-xs md:text-sm transition-all px-2 md:px-3 py-1.5 md:py-2"
                                        type="number"
                                        min="0"
                                        value={entry.quantity || ''}
                                        onChange={(e) => onUpdateEntry(entry.id, 'quantity', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="px-2 md:px-4 py-2 md:py-3">
                                    <select
                                        className="w-full bg-slate-100 border-transparent focus:border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-lg text-xs md:text-sm transition-all px-2 md:px-3 py-1.5 md:py-2 appearance-none"
                                        value={entry.transactionType}
                                        onChange={(e) => onUpdateEntry(entry.id, 'transactionType', e.target.value as TransactionType)}
                                    >
                                        <option value="IN">IN</option>
                                        <option value="OUT">OUT</option>
                                        <option value="RETURN">RETURN</option>
                                        <option value="ADJUST">ADJUST</option>
                                        <option value="SCRAP">SCRAP</option>
                                    </select>
                                </td>
                                <td className="px-2 md:px-4 py-2 md:py-3">
                                    {members.length === 0 && (
                                        <div className="text-[10px] text-red-500 mb-1">No members</div>
                                    )}
                                    <select
                                        className="w-full bg-slate-100 border-transparent focus:border-border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-lg text-xs md:text-sm transition-all px-2 md:px-3 py-1.5 md:py-2 appearance-none"
                                        value={entry.takenBy}
                                        onChange={(e) => {
                                            const member = members.find(m => m.id === e.target.value)
                                            onUpdateEntry(entry.id, 'takenBy', e.target.value)
                                            onUpdateEntry(entry.id, 'takenByName', member ? `${member.first_name} ${member.last_name}` : '')
                                        }}
                                    >
                                        <option value="">Select...</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.first_name} {member.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-2 md:px-4 py-2 md:py-3">
                                    <input
                                        className="w-full bg-slate-100 border-transparent focus:border-[var(--color-cashcrow-primary)] focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 rounded-lg text-xs md:text-sm transition-all px-2 md:px-3 py-1.5 md:py-2"
                                        placeholder="Purpose"
                                        type="text"
                                        value={entry.purpose}
                                        onChange={(e) => onUpdateEntry(entry.id, 'purpose', e.target.value)}
                                    />
                                </td>
                                <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                                    <button 
                                        onClick={() => onRemoveRow(entry.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                                        disabled={entries.length === 1}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 md:p-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                    onClick={onAddRow}
                    className="flex items-center justify-center gap-2 w-full py-2 md:py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] transition-all text-xs md:text-sm font-semibold group"
                >
                    <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:scale-125" />
                    Add Row
                </button>
            </div>
        </div>
    )
}

