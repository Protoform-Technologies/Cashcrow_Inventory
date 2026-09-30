import React from 'react'
import { Truck, ExternalLink, FileText, Download } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductDetailSidebarProps {
    product: Product
    isAdmin?: boolean
}

interface Vendor {
    name?: string
    fund?: string
    link?: string
}

export default function ProductDetailSidebar({ product }: ProductDetailSidebarProps) {
    const vendors: Vendor[] = (product.vendors || []).filter((v): v is Vendor => !!v?.name)
    const topTwo = vendors.slice(0, 2)
    const rest = vendors.slice(2)

    return (
        <div className="space-y-4">
            {/* Suppliers */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[var(--color-cashcrow-primary)]/10 rounded-lg">
                            <Truck className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                        </div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--color-cashcrow-primary)]">Suppliers</h3>
                    </div>
                    {vendors.length > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{vendors.length}</span>
                    )}
                </div>

                {vendors.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No suppliers linked</p>
                    </div>
                ) : (
                    <>
                        {/* Top 2 — featured */}
                        <div className="space-y-3">
                            {topTwo.map((v, i) => (
                                <div key={i} className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl hover:border-[var(--color-cashcrow-primary)]/30 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <span className={`inline-block mb-1 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${v.link ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                                {v.link ? 'Online' : 'Offline'}
                                            </span>
                                            <h4 className="font-bold text-sm text-slate-900 truncate" title={v.name}>{v.name}</h4>
                                        </div>
                                        <span className="shrink-0 text-sm font-black px-2.5 py-1 bg-white text-slate-800 rounded-lg border border-slate-100 shadow-sm">₹{v.fund || '—'}</span>
                                    </div>
                                    {v.link && (
                                        <a
                                            href={v.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--color-cashcrow-primary)] transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Purchase Link
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Remaining — compact list */}
                        {rest.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Other suppliers</p>
                                <div className="space-y-1">
                                    {rest.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.link ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                <span className="text-xs font-bold text-slate-700 truncate" title={v.name}>{v.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs font-black text-slate-600">₹{v.fund || '—'}</span>
                                                {v.link && (
                                                    <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[var(--color-cashcrow-primary)] transition-colors">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Data Sheet */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-[var(--color-cashcrow-primary)]/10 rounded-lg">
                        <FileText className="w-4 h-4 text-[var(--color-cashcrow-primary)]" />
                    </div>
                    <h3 className="text-xs font-black tracking-widest uppercase text-[var(--color-cashcrow-primary)]">Data Sheet</h3>
                </div>

                {product.data_sheet_url ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/60 border border-slate-100 rounded-2xl">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                            <FileText className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900 truncate">Technical Document</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF attachment</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <a
                                href={product.data_sheet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in new tab"
                                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[var(--color-cashcrow-primary)] hover:border-[var(--color-cashcrow-primary)]/30 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                                href={product.data_sheet_url}
                                download
                                title="Download"
                                className="p-2 rounded-lg bg-[var(--color-cashcrow-primary)] text-white hover:bg-[var(--color-cashcrow-lightgreen)] transition-all shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                        <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No data sheet uploaded</p>
                    </div>
                )}
            </div>
        </div>
    )
}
