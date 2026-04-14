"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Package, ArrowUpRight } from "lucide-react";

interface PartItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  usage: string;
  status: string;
  statusColor: string;
}

export default function TopUsedParts({ parts }: { parts: PartItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(parts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = parts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyles = (color: string) => {
    switch (color) {
      case "red":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "emerald":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "amber":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-cashcrow-primary)]/10 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Most Utilized Resources</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Inventory Throughput Tracking</p>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-slate-100">
        {currentParts.map((part, index) => (
          <div key={index} className="p-5 space-y-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">{part.sku}</span>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">{part.name}</h5>
                <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">{part.category}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shrink-0 ${getStatusStyles(part.statusColor)}`}>
                {part.status}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50/80 rounded-xl p-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Count</span>
              <span className="text-sm font-black text-slate-900 tabular-nums">{part.usage}</span>
            </div>
          </div>
        ))}
        {parts.length === 0 && (
          <div className="p-10 text-center opacity-30">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No activity</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-4">SKU / Reference</th>
              <th className="px-8 py-4">Product Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4 text-center">Count</th>
              <th className="px-8 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentParts.map((part, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-xs font-mono font-bold text-slate-400 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">{part.sku}</td>
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-900 text-sm tracking-tight">{part.name}</div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{part.category}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-black text-slate-900 tabular-nums">{part.usage}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${getStatusStyles(part.statusColor)}`}>
                    {part.status}
                  </span>
                </td>
              </tr>
            ))}
            {parts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Package className="w-10 h-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No activity recorded</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Showing <span className="text-slate-900 font-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, parts.length)}</span> of <span className="text-slate-900 font-bold">{parts.length}</span> resources
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-white hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${currentPage === p
                  ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)] shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-white hover:border-[var(--color-cashcrow-primary)] hover:text-[var(--color-cashcrow-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

