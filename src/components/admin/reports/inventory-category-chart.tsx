"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getReportAnalytics } from "@/actions/reports";
import { PieChart as PieIcon } from "lucide-react";

interface CategoryData {
  name: string;
  value: number;
}

export default function InventoryByCategoryChart({ 
  data: initialData,
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
}: { 
  data: CategoryData[],
  initialMonth?: number,
  initialYear?: number
}) {
  const [data, setData] = useState<CategoryData[]>(initialData);
  const [localMonth, setLocalMonth] = useState(initialMonth);
  const [localYear, setLocalYear] = useState(initialYear);
  const [isLoading, setIsLoading] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    setData(initialData);
    setLocalMonth(initialMonth);
    setLocalYear(initialYear);
  }, [initialData, initialMonth, initialYear]);

  const handleDateChange = async (month: number, year: number) => {
    setLocalMonth(month);
    setLocalYear(year);
    setIsLoading(true);
    try {
      const res = await getReportAnalytics(month, year);
      setData(res.inventoryByCategory);
    } catch (err) {
      console.error("Failed to re-fetch category distribution:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#265035', '#3d7a52', '#54a370', '#6bc58d', '#82e0aa', '#2ecc71'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl">
             <PieIcon className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
          </div>
          <div>
             <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Category Split</h4>
             <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">Inventory Distribution</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 self-start sm:self-center">
          <select 
            value={localMonth} 
            onChange={(e) => handleDateChange(parseInt(e.target.value), localYear)}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <span className="text-slate-300">/</span>
          <select 
            value={localYear} 
            onChange={(e) => handleDateChange(localMonth, parseInt(e.target.value))}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="size-8 border-4 border-[var(--color-cashcrow-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-cashcrow-primary)]">Syncing Data</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center relative h-[300px] min-h-[300px] mb-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900 leading-tight">{data.length}</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-1">Sectors</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Weight']}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #f1f5f9', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '12px',
                textTransform: 'uppercase'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
        {data.sort((a,b) => b.value - a.value).map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
              <span 
                className="size-2 rounded-full shadow-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
            </div>
            <span className="text-[11px] font-black text-slate-900 tabular-nums">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
