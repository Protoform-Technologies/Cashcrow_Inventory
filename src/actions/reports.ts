"use server"

import { fetchReportAnalyticsData } from '@/lib/report'

export async function getReportAnalytics(month?: number, year?: number) {
  try {
    const data = await fetchReportAnalyticsData(month, year);

    // Format KPIs for the UI cards
    const stats = [
      {
        label: "Total Inventory Value",
        value: `₹${data.stats.totalValue.toLocaleString()}`,
        trendType: "neutral",
        icon: "payments",
      },
      {
        label: "Monthly Consumption",
        value: `${data.stats.consumptionQty.toLocaleString()} Units`,
        trend: `${data.stats.trends.consumptionQty}% vs prev month`,
        trendType: Number(data.stats.trends.consumptionQty) <= 0 ? "down-good" : "up",
        icon: "monitoring",
      },
      {
        label: "Monthly Inventory Used",
        value: `₹${data.stats.consumptionValue.toLocaleString()}`,
        trend: `${data.stats.trends.consumptionValue}% vs prev month`,
        trendType: Number(data.stats.trends.consumptionValue) <= 0 ? "down-good" : "up",
        icon: "account_balance_wallet",
      },
      {
        label: "Low Stock Items",
        value: data.stats.lowStock.toString(),
        trend: `${data.stats.outOfStock} Out of Stock`,
        trendType: data.stats.outOfStock > 0 ? "down" : "neutral",
        icon: "inventory_2",
      },
    ];

    return {
      period: {
        month: data.timestamp,
        year: data.year,
        formatted: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(data.year, data.timestamp))
      },
      stats,
      stockMovement: data.charts.stockMovement,
      inventoryByCategory: data.charts.inventoryByCategory,
      topParts: data.topUsed
    };
  } catch (error) {
    console.error("Report Analytics Error:", error);
    throw new Error("Failed to generate report analytics.");
  }
}


