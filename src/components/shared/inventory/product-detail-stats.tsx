import React from 'react'
import { Package, MapPin, AlertTriangle, ShoppingBag } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductDetailStatsProps {
    product: Product
}

export default function ProductDetailStats({ product }: ProductDetailStatsProps) {
    const stats = [
        {
            label: 'Current Stock',
            value: product.quantity,
            unit: product.unit_of_measurement || 'units',
            status: product.quantity === 0 ? 'Out of Stock' : product.quantity <= product.min_stock_level ? 'Low Stock' : 'In Stock',
            icon: Package,
            color: product.quantity === 0 ? 'text-red-500' : product.quantity <= product.min_stock_level ? 'text-amber-500' : 'text-emerald-600'
        },
        {
            label: 'Location',
            value: `Shelf ${product.shelf_code}, Box ${product.box_code}`,
            icon: MapPin,
            color: 'text-blue-600'
        },
        {
            label: 'Minimum Stock',
            value: product.min_stock_level,
            unit: 'units',
            icon: AlertTriangle,
            color: 'text-rose-500'
        },
        {
            label: 'Category',
            value: product.category,
            icon: ShoppingBag,
            color: 'text-indigo-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        {stat.status && (
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border ${
                                stat.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                stat.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-red-50 text-red-700 border-red-100'
                            }`}>
                                {stat.status}
                            </span>
                        )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className={`font-black text-slate-900 truncate tracking-tight ${stat.label === 'Location' || stat.label === 'Category' ? 'text-lg' : 'text-2xl'}`}>
                            {stat.value}
                            {stat.unit && <span className="text-[11px] font-bold text-slate-400 ml-1 lowercase">{stat.unit}</span>}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    )
}
