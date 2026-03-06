const inventoryItems = [
    { name: "Hydrochloric Acid 37%", category: "Chemicals", sku: "CH-HA-001", qty: "45 L", status: "In Stock" },
    { name: "Beaker 500mL (Pyrex)", category: "Glassware", sku: "GW-BK-500", qty: "8 units", status: "Low Stock" },
    { name: "Nitrile Gloves (Large)", category: "PPE", sku: "PPE-GL-LGE", qty: "0 units", status: "Out of Stock" },
    { name: "Petri Dishes 90mm", category: "Consumables", sku: "CO-PD-090", qty: "240 units", status: "In Stock" },
    { name: "Centrifuge Tubes 15mL", category: "Consumables", sku: "CO-CT-015", qty: "12 units", status: "Low Stock" }
]

export default function InventoryTable() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Stock Inventory</h3>
                <button className="text-[var(--color-cashcrow-primary)] text-sm font-bold hover:underline underline-offset-4 transition-all">
                    View All Inventory
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {inventoryItems.map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{item.category}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider shrink-0 ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                                item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <code className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-mono">
                                {item.sku}
                            </code>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Quantity</p>
                                <p className={`font-black text-base ${item.status === 'Low Stock' ? 'text-orange-600' :
                                    item.status === 'Out of Stock' ? 'text-red-600' :
                                        'text-slate-900'
                                    }`}>{item.qty}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4 text-right">Qty</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inventoryItems.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">{item.name}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-lg">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="text-[11px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-1 rounded-md font-mono">
                                            {item.sku}
                                        </code>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`font-black ${item.status === 'Low Stock' ? 'text-orange-600' :
                                            item.status === 'Out of Stock' ? 'text-red-600' :
                                                'text-slate-900'
                                            }`}>{item.qty}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status}
                                        </span>
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
