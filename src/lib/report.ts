import { createServerSupabaseClient } from './supabase'

/**
 * 🛠️ HELPER: PARSE PRICE FROM FUND STRING
 * Extracts numeric value from strings like "₹500.50" or "$100"
 */
function parsePrice(fund: string | number | null | undefined): number {
    if (fund === null || fund === undefined) return 0;
    if (typeof fund === 'number') return fund;
    const strFund = String(fund);
    const match = strFund.replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
}

export async function fetchReportAnalyticsData(month?: number, year?: number) {
    const supabase = await createServerSupabaseClient();

    // 1. Set Date Context
    const now = new Date();
    const targetMonth = month !== undefined ? month : now.getMonth();
    const targetYear = year !== undefined ? year : now.getFullYear();

    const currentStart = new Date(targetYear, targetMonth, 1);
    const currentEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const prevMonth = targetMonth === 0 ? 11 : targetMonth - 1;
    const prevYear = targetMonth === 0 ? targetYear - 1 : targetYear;
    const prevStart = new Date(prevYear, prevMonth, 1);
    const prevEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59);

    // 2. Fetch Base Data (Parallelized)
    const [
        { data: products },
        { data: currentLogs },
        { data: prevLogs }
    ] = await Promise.all([
        supabase.from('products').select('*').eq('is_deleted', false),
        supabase.from('day_log_items').select('*, products(name, sku, category, vendors)')
            .gte('created_at', currentStart.toISOString())
            .lte('created_at', currentEnd.toISOString()),
        supabase.from('day_log_items').select('qty, type, part_id')
            .gte('created_at', prevStart.toISOString())
            .lte('created_at', prevEnd.toISOString())
    ]);

    if (!products) throw new Error("Could not fetch inventory inventory.");

    // Pre-calculate product prices for fast lookup
    const productPriceMap = new Map(products.map(p => [
        p.id, 
        parsePrice(p.vendors?.[0]?.fund)
    ]));

    // --- 📊 KPI CALCULATIONS ---

    // 1. Total Inventory Value (Current Snapshot)
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.quantity * (productPriceMap.get(p.id) || 0)), 0);

    // 2. Monthly Consumption Quantities
    const currentConsumptionQty = currentLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => acc + (l.qty || 0), 0) || 0;
    const prevConsumptionQty = prevLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => acc + (l.qty || 0), 0) || 0;

    // 3. Monthly Consumption Value (Utility Value)
    const currentConsumptionValue = currentLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => {
        const price = productPriceMap.get(l.part_id) || 0;
        return acc + ((l.qty || 0) * price);
    }, 0) || 0;

    const prevConsumptionValue = prevLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => {
        const price = productPriceMap.get(l.part_id) || 0;
        return acc + ((l.qty || 0) * price);
    }, 0) || 0;

    // 4. Low Stock Counter
    const lowStockCount = products.filter(p => p.quantity <= p.min_stock_level && p.quantity > 0).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    // --- 📈 TREND CALCULATIONS ---
    const calculateTrend = (curr: number, prev: number) => {
        if (prev === 0) return curr === 0 ? "0.0" : "+100";
        const diff = ((curr - prev) / prev) * 100;
        return (diff > 0 ? "+" : "") + diff.toFixed(1);
    };

    // --- 📅 CHART AGGREGATIONS ---

    // Week-by-Week Stock Movement
    const weeks = [0, 1, 2, 3].map(w => {
        const start = new Date(targetYear, targetMonth, (w * 7) + 1);
        const end = new Date(targetYear, targetMonth, (w + 1) * 7 + 1);
        const wLogs = currentLogs?.filter(l => {
            const d = new Date(l.created_at);
            return d >= start && d < end;
        });
        return {
            name: `Week ${w + 1}`,
            inbound: wLogs?.filter(l => l.type === 'IN').reduce((acc, l) => acc + (l.qty || 0), 0) || 0,
            outbound: wLogs?.filter(l => l.type === 'OUT').reduce((acc, l) => acc + (l.qty || 0), 0) || 0,
        };
    });

    // Category Distribution
    const categoryTotals = products.reduce((acc: any, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    const totalCount = products.length;
    const inventoryByCategory = Object.entries(categoryTotals).map(([name, count]: [string, any]) => ({
        name: name || 'General',
        value: Math.round((count / totalCount) * 100)
    }));

    // --- 🏆 UTILIZED PARTS PAGINATION ---
    const partUsageAgg = currentLogs?.filter(l => l.type === 'OUT').reduce((acc: any, l) => {
        acc[l.part_id] = (acc[l.part_id] || 0) + (l.qty || 0);
        return acc;
    }, {});

    const utilizedParts = Object.entries(partUsageAgg || {})
        .sort(([, a]: any, [, b]: any) => b - a)
        .map(([id, usage]: [string, any]) => {
            const p = products.find(prod => prod.id === id);
            return {
                id: p?.id,
                sku: p?.sku || 'N/A',
                name: p?.name || 'Unknown',
                category: p?.category || 'General',
                usage: usage,
                status: p?.quantity === 0 ? 'Out of Stock' : p?.quantity! <= p?.min_stock_level! ? 'Low Stock' : 'Stable',
                statusColor: p?.quantity === 0 ? 'red' : p?.quantity! <= p?.min_stock_level! ? 'amber' : 'emerald'
            };
        });

    return {
        timestamp: targetMonth,
        year: targetYear,
        stats: {
            totalValue: totalInventoryValue,
            consumptionQty: currentConsumptionQty,
            consumptionValue: currentConsumptionValue,
            lowStock: lowStockCount,
            outOfStock: outOfStockCount,
            trends: {
                consumptionQty: calculateTrend(currentConsumptionQty, prevConsumptionQty),
                consumptionValue: calculateTrend(currentConsumptionValue, prevConsumptionValue),
            }
        },
        charts: {
            stockMovement: weeks,
            inventoryByCategory
        },
        topUsed: utilizedParts
    };
}