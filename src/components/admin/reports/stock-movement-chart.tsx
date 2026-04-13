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
} from "recharts";
import { getReportAnalytics } from "@/actions/reports";

interface DataPoint {
  name: string;
  inbound: number;
  outbound: number;
}

export default function StockMovementChart({ data: initialData }: { data: DataPoint[] }) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [localMonth, setLocalMonth] = useState(new Date().getMonth());
  const [localYear, setLocalYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Sync with initial data when it changes from parent
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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
    <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
           <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm">Stock Movement</h4>
           <p className="text-xs text-slate-400 mt-1 font-medium italic">Weekly breakdown of inbound and outbound transactions</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 self-start sm:self-center">
          <select 
            value={localMonth} 
            onChange={(e) => handleDateChange(parseInt(e.target.value), localYear)}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none cursor-pointer"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <span className="text-slate-300">/</span>
          <select 
            value={localYear} 
            onChange={(e) => handleDateChange(localMonth, parseInt(e.target.value))}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary">
          Refreshing...
        </div>
      )}
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '12px'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '30px', fontSize: '11px', fontWeight: 'bold' }}
            />
            <Bar 
              name="Inbound" 
              dataKey="inbound" 
              fill="#265035" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
              animationDuration={1000}
            />
            <Bar 
              name="Outbound" 
              dataKey="outbound" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
