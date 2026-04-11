import React from 'react'
import Link from 'next/link'
import { Truck, MapPin, ExternalLink, ArrowRight, FileText } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductDetailSidebarProps {
    product: Product
    isAdmin?: boolean
}

export default function ProductDetailSidebar({ product, isAdmin = false }: ProductDetailSidebarProps) {
    const displayVendors = product.vendors?.slice(0, 4) || []
    const hasMoreVendors = (product.vendors?.length || 0) > 4

    return (
        <div className="space-y-4">
            {/* Supplier Box - Integrated Design */}
            <div className="bg-[#265136]/5 border border-[#265136]/10 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#265136]/10 rounded-lg">
                            <Truck className="w-4 h-4 text-[#265136]" />
                        </div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[#265136]">Suppliers</h3>
                    </div>
                </div>

                <div className="space-y-3">
                    {displayVendors.length > 0 ? displayVendors.map((vendor: any, i: number) => (
                        <div key={i} className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-[var(--color-cashcrow-lightgreen)]/30 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2.5">
                                <div className="min-w-0 pr-4">
                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-cashcrow-lightgreen)] transition-colors truncate" title={vendor.name}>
                                        {vendor.name}
                                    </h4>
                                </div>
                                <span className="shrink-0 text-xs font-black px-2 py-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 shadow-sm">
                                    ₹{vendor.fund}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <span className={`self-start text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                                    vendor.link ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                }`}>
                                    {vendor.link ? 'Online' : 'Offline'}
                                </span>

                                {vendor.link && (
                                    <a
                                        href={vendor.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[var(--color-cashcrow-lightgreen)] transition-colors font-black uppercase tracking-widest"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Purchase Link
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No suppliers linked</p>
                        </div>
                    )}

                    {hasMoreVendors && (
                        <Link
                            href={isAdmin ? `/admin/suppliers?q=${encodeURIComponent(product.name)}` : `/member/parts`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all group"
                        >
                            View more suppliers
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. Technical Data Sheet */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-[var(--color-cashcrow-lightgreen)]/5">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-[var(--color-cashcrow-lightgreen)] text-white rounded-lg shadow-sm">
                            <FileText className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 tracking-tight">Data Sheet</h2>
                    </div>
                </div>
                <div className="p-4">
                    {product.data_sheet_url ? (
                        <a
                            href={product.data_sheet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[var(--color-cashcrow-lightgreen)]/50 hover:bg-[var(--color-cashcrow-lightgreen)]/5 transition-all group"
                        >
                            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-[var(--color-cashcrow-lightgreen)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Technical Document</span>
                                <span className="text-[9px] font-bold text-[var(--color-cashcrow-lightgreen)] uppercase">Click to open in new tab</span>
                            </div>
                        </a>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                            <div className="p-2 bg-white rounded-xl opacity-50">
                                <FileText className="w-5 h-5 text-slate-300" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Not provided</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Storage Identification */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-5 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <h3 className="font-black uppercase tracking-widest text-[9px]">Storage Identification</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100/50">
                        <span className="text-slate-500 font-bold text-[12px]">Shelf Position</span>
                        <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded text-xs border border-slate-100 shadow-sm">{product.shelf_code}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100/50">
                        <span className="text-slate-500 font-bold text-[12px]">Box Number</span>
                        <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded text-xs border border-slate-100 shadow-sm">{product.box_code}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
