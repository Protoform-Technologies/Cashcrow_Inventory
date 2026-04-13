"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function InventoryByCategoryChart({ data }: { data: CategoryData[] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
      <h4 className="font-black text-slate-900 uppercase tracking-wider text-sm mb-8">Category Split</h4>
      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900">{data.length}</p>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-1">Active Groups</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Percentage']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span 
                className="size-2.5 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <span className="font-bold text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
