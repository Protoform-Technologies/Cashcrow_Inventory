"use client";

import React from "react";
import ExportButton from "./export-button";
import { Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-4 md:py-6 transition-all shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Performance <span className="text-primary">Reports</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 gap-2 text-sm group w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            <select 
              value={currentMonth} 
              onChange={(e) => handleDateChange(parseInt(e.target.value), currentYear)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-xs"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select 
              value={currentYear} 
              onChange={(e) => handleDateChange(currentMonth, parseInt(e.target.value))}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-xs"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <ExportButton reportData={reportData} />
        </div>
      </div>
    </header>
  );
}

