'use client'

interface QuoteHistoryTableProps {
    quotes: any[]
}

export default function QuoteHistoryTable({ quotes }: QuoteHistoryTableProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Quote History</h3>
                <button className="text-[10px] font-bold text-[var(--color-cashcrow-primary)] hover:underline uppercase tracking-widest">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Supplier</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Quantity</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total Amount</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {quotes.length > 0 ? (
                            quotes.map((quote: any) => (
                                <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                        {new Date(quote.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                        {quote.suppliers?.company_name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{quote.quantity}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${quote.total_amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            quote.status === 'Approved' 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                quote.status === 'Approved' ? 'bg-emerald-500' : 'bg-slate-400'
                                            }`}></span>
                                            {quote.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400 italic">
                                    No recent quote history found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
