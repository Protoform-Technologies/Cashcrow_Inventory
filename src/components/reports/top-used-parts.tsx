"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PartItem {
  sku: string;
  name: string;
  description: string;
  category: string;
  usage: string;
  status: string;
  statusColor: string;
}

export default function TopUsedParts({ parts }: { parts: PartItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(parts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParts = parts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyles = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-100 text-red-700";
      case "green":
        return "bg-green-100 text-green-700";
      case "blue":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
        <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs md:sm">Most Utilized Resources</h4>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline transition-all hidden sm:block">Full Inventory</button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-slate-100">
        {currentParts.map((part, index) => (
          <div key={index} className="p-5 flex flex-col gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-400 font-medium tracking-tight uppercase">{part.sku}</span>
                <h5 className="font-bold text-slate-900 text-sm leading-tight">{part.name}</h5>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{part.category}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${getStatusStyles(part.statusColor)}`}>
                {part.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cycle Count</span>
              <span className="text-sm font-black text-slate-900">{part.usage}</span>
            </div>
          </div>
        ))}
        {parts.length === 0 && (
          <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No activity for this period.</div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-bold">
            <tr>
              <th className="px-8 py-4">ID / SKU</th>
              <th className="px-8 py-4">Component Name</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4 text-right">Cycle Count</th>
              <th className="px-8 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentParts.map((part, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-xs font-mono text-slate-400 group-hover:text-primary transition-colors">{part.sku}</td>
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-900 text-sm">{part.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">{part.description}</div>
                </td>
                <td className="px-8 py-5 text-[11px] font-bold text-slate-600 uppercase tracking-tight">{part.category}</td>
                <td className="px-8 py-5 text-right text-sm font-black text-slate-900">{part.usage}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${getStatusStyles(part.statusColor)}`}>
                    {part.status}
                  </span>
                </td>
              </tr>
            ))}
            {parts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No activity recorded for the selected period.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 md:px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, parts.length)} of {parts.length} entries</span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:text-primary" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
               key={p}
               onClick={() => setCurrentPage(p)}
               className={`size-8 rounded-lg border transition-all ${currentPage === p ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-slate-200 hover:bg-white'}`}
            >
              {p}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-4 h-4 group-hover:text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

