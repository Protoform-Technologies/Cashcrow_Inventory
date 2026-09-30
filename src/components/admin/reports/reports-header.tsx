"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter } from "lucide-react";
import ExportButton from "./export-button";

interface ReportsHeaderProps {
  reportData: any;
}

export default function ReportsHeader({ reportData }: ReportsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = parseInt(searchParams.get("month") || new Date().getMonth().toString());
  const currentYear = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const handleDateChange = (newMonth: number, newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newMonth.toString());
    params.set("year", newYear.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">
          Real-time performance metrics and inventory throughput for <span className="text-[var(--color-cashcrow-primary)] font-bold">{reportData.period.formatted}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Filters Group */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[var(--color-cashcrow-primary)]/20 transition-all">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={currentMonth}
              onChange={(e) => handleDateChange(parseInt(e.target.value), currentYear)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[var(--color-cashcrow-primary)]/20 transition-all">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={currentYear}
              onChange={(e) => handleDateChange(currentMonth, parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <ExportButton reportData={reportData} />
      </div>
    </div>
  );
}

