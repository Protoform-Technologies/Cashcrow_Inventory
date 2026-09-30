import React from 'react'
import { Package, MapPin, AlertTriangle, ShoppingBag } from 'lucide-react'
import { Product } from '@/types/product'
import { KPICard, type KPICardProps } from '@/components/ui/kpi-card'

interface ProductDetailStatsProps {
    product: Product
}

export default function ProductDetailStats({ product }: ProductDetailStatsProps) {
    const unit = product.unit_of_measurement || 'units'
    const outOfStock = product.quantity === 0
    const lowStock = !outOfStock && product.quantity <= product.min_stock_level
    const stockStatus = outOfStock ? 'Out of Stock' : lowStock ? 'Low Stock' : 'In Stock'

    const cards: KPICardProps[] = [
        {
            label: 'Current Stock',
            value: product.quantity,
            icon: Package,
            tone: outOfStock ? 'danger' : lowStock ? 'warning' : 'primary',
            badge: stockStatus,
            subtext: `${unit} available`,
        },
        {
            label: 'Location',
            value: `Shelf ${product.shelf_code}, Box ${product.box_code}`,
            icon: MapPin,
            tone: 'info',
            subtext: 'Storage location',
            valueClassName: 'text-lg truncate',
        },
        {
            label: 'Minimum Stock',
            value: product.min_stock_level,
            icon: AlertTriangle,
            tone: 'warning',
            subtext: `${unit} - reorder level`,
        },
        {
            label: 'Category',
            value: product.category,
            icon: ShoppingBag,
            tone: 'primary',
            subtext: 'Part category',
            valueClassName: 'text-lg truncate',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, idx) => (
                <KPICard key={idx} {...card} />
            ))}
        </div>
    )
}
