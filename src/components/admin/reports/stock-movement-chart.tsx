"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { getReportAnalytics } from "@/actions/reports";
import { Activity } from "lucide-react";

interface DataPoint {
  name: string;
  inbound: number;
  outbound: number;
}

export default function StockMovementChart({ 
  data: initialData,
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
}: { 
  data: DataPoint[],
  initialMonth?: number,
  initialYear?: number
}) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [localMonth, setLocalMonth] = useState(initialMonth);
  const [localYear, setLocalYear] = useState(initialYear);
  const [isLoading, setIsLoading] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Sync with initial data and filters when they change from parent
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
      setData(res.stockMovement);
    } catch (err) {
      console.error("Failed to re-fetch stock movement:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
             <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
             <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Stock Throughput</h4>
             <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">Inbound vs Outbound Velocity</p>
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
      
      <div className="h-[350px] min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc', radius: 8 }}
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
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '40px', fontSize: '10px', fontWeight: 'bold' }}
            />
            <Bar 
              name="Inbound" 
              dataKey="inbound" 
              fill="var(--color-cashcrow-primary)" 
              radius={[6, 6, 0, 0]} 
              barSize={24}
              animationDuration={1500}
            >
              <LabelList dataKey="inbound" position="top" style={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar 
              name="Outbound" 
              dataKey="outbound" 
              fill="#3b82f6" 
              radius={[6, 6, 0, 0]} 
              barSize={24}
              animationDuration={1500}
            >
              <LabelList dataKey="outbound" position="top" style={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
