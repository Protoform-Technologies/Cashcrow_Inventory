import React from "react";
import { getReportAnalytics } from "@/actions/reports";
import ReportsHeader from "@/components/admin/reports/reports-header";
import ReportStats from "@/components/admin/reports/report-stats";
import StockMovementChart from "@/components/admin/reports/stock-movement-chart";
import InventoryByCategoryChart from "@/components/admin/reports/inventory-category-chart";
import TopUsedParts from "@/components/admin/reports/top-used-parts";

export const metadata = {
  title: "Reports & Analytics | Cashcrow Lab",
  description: "Comprehensive inventory reports and analytics for Cashcrow Laboratory.",
};

export default async function ReportsPage({
  searchParams
}: {
  searchParams: Promise<{ month?: string, year?: string }>
}) {
  const resolvedParams = await searchParams;

  const month = resolvedParams.month ? parseInt(resolvedParams.month) : undefined;
  const year = resolvedParams.year ? parseInt(resolvedParams.year) : undefined;

  // Fetch dynamic analytics
  const reportData = await getReportAnalytics(month, year);

  // Prepare data for export
  const exportData = {
    stats: reportData.stats,
    topParts: reportData.topParts,
    period: reportData.period
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Reports Header and Actions */}
        <ReportsHeader reportData={exportData} />

        {/* Key Metrics Grid */}
        <ReportStats stats={reportData.stats as any} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <StockMovementChart
            data={reportData.stockMovement}
            initialMonth={month}
            initialYear={year}
          />
          <InventoryByCategoryChart
            data={reportData.inventoryByCategory}
            initialMonth={month}
            initialYear={year}
          />
        </div>

        {/* Table Section */}
        <TopUsedParts parts={reportData.topParts as any} />
      </div>
    </>
  );
}
