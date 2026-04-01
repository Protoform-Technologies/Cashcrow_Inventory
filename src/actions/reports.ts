'use server'

import { createServerSupabaseClient } from '@/lib/supabase'

export async function getReportAnalytics(month?: number, year?: number) {
  const supabase = await createServerSupabaseClient()

  // Default to current month/year if not provided
  const now = new Date()
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  // Define date range for the selected month
  const startDate = new Date(targetYear, targetMonth, 1).toISOString();
  const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59).toISOString();

  // 1. Fetch Stats (All Products for current stock status)
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, sku, category, quantity, min_stock_level, vendors')

  if (productError) {
    console.error("Error fetching products for reports:", productError)
    throw new Error("Failed to fetch products")
  }

  // Calculate Total Value (Estimate using vendors MRP)
  const totalValue = products.reduce((acc, p) => {
    const mrp = p.vendors?.[0]?.fund?.match(/\d+/)?.[0] || 100
    return acc + (p.quantity * Number(mrp))
  }, 0)

  const lowStockCount = products.filter(p => p.quantity <= p.min_stock_level && p.quantity > 0).length
  const outOfStockCount = products.filter(p => p.quantity === 0).length

  // 2. Fetch Logs for the selected range
  const { data: periodLogs, error: logsError } = await supabase
    .from('day_log_items')
    .select('qty, type, created_at, part_id')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  if (logsError) {
    console.error("Error fetching logs for reports:", logsError)
  }

  const consumption = periodLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => acc + (l.qty || 0), 0) || 0
  
  // 3. Stock Movement (Grouped into 4 weeks of the selected month)
  const weeks = [0, 1, 2, 3].map(w => {
    const start = new Date(targetYear, targetMonth, (w * 7) + 1);
    const end = new Date(targetYear, targetMonth, (w + 1) * 7 + 1);
    
    const weekLogs = periodLogs?.filter(l => {
      const d = new Date(l.created_at)
      return d >= start && d < end
    })

    return {
      name: `Week ${w + 1}`,
      inbound: weekLogs?.filter(l => l.type === 'IN').reduce((acc, l) => acc + (l.qty || 0), 0) || 0,
      outbound: weekLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => acc + (l.qty || 0), 0) || 0,
    }
  })

  // 4. Inventory by Category (Current Snapshot)
  const categoryCounts = products.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const totalProducts = products.length
  const inventoryByCategory = Object.entries(categoryCounts).map(([name, count]: [string, any]) => ({
    name,
    value: Math.round((count / totalProducts) * 100),
    color: name === 'Electronics' ? '#265035' : name === 'Hardware' ? '#3d7a52' : '#54a370'
  }))

  // 5. Utilized Parts for the period
  const partUsage = periodLogs?.filter(l => l.type === 'OUT').reduce((acc: any, l) => {
    acc[l.part_id] = (acc[l.part_id] || 0) + (l.qty || 0)
    return acc
  }, {})

  const sortedParts = Object.entries(partUsage || {})
    .sort(([, a]: any, [, b]: any) => b - a)

  const utilizedParts = sortedParts.map(([id, usage]: [string, any]) => {
    const p = products.find(prod => prod.id === id)
    return {
      sku: p?.sku || 'N/A',
      name: p?.name || 'Unknown',
      description: p?.category || 'Category',
      category: p?.category || 'General',
      usage: usage.toLocaleString(),
      status: p?.quantity === 0 ? 'Out of Stock' : p?.quantity! <= p?.min_stock_level! ? 'Low Stock' : 'Stable',
      statusColor: p?.quantity === 0 ? 'red' : p?.quantity! <= p?.min_stock_level! ? 'blue' : 'green'
    }
  })

  return {
    period: {
      month: targetMonth,
      year: targetYear,
      formatted: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(targetYear, targetMonth))
    },
    stats: [
      {
        label: "Total Inventory Value",
        value: `₹${totalValue.toLocaleString()}`,
        trend: "+2.4% vs last month",
        trendType: "up",
        icon: "payments",
      },
      {
        label: "Monthly Consumption",
        value: `${consumption} Units`,
        trend: "-1.1% vs prev month",
        trendType: "down-good",
        icon: "monitoring",
      },
      {
        label: "Avg. Fulfillment Time",
        value: "3.2 Days",
        trend: "-0.5 days faster",
        trendType: "down-good",
        icon: "speed",
      },
      {
        label: "Low Stock Items",
        value: lowStockCount.toString(),
        trend: `${outOfStockCount} Out of Stock`,
        trendType: "neutral",
        icon: "autorenew",
      },
    ],
    stockMovement: weeks,
    inventoryByCategory,
    topParts: utilizedParts
  }
}

