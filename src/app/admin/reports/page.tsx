import React from "react";
import DashboardLayout from "@/components/shared/dashboard/layout";
import { getAdminProfileOrRedirect } from "@/actions/auth";
import ReportsHeader from "@/components/reports/reports-header";
import ReportStats from "@/components/reports/report-stats";
import StockMovementChart from "@/components/reports/stock-movement-chart";
import InventoryByCategoryChart from "@/components/reports/inventory-category-chart";
import TopUsedParts from "@/components/reports/top-used-parts";
import { getReportAnalytics } from "@/actions/reports";

export const metadata = {
  title: "Reports & Analytics | Cashcrow Lab",
  description: "Comprehensive inventory reports and analytics for Cashcrow Laboratory.",
};

export default async function ReportsPage({
  searchParams
}: {
  searchParams: { month?: string, year?: string }
}) {
  const profile = await getAdminProfileOrRedirect();
  const fullName = `${profile.first_name} ${profile.last_name}`;

  const month = searchParams.month ? parseInt(searchParams.month) : undefined;
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;

  // Fetch dynamic analytics
  const reportData = await getReportAnalytics(month, year);

  // Prepare data for export
  const exportData = {
    stats: reportData.stats,
    topParts: reportData.topParts,
    period: reportData.period
  };

  return (
    <DashboardLayout 
      userName={fullName} 
      userRole="Lab Director" 
      avatarUrl={profile.avatar_url}
      title="Reports & Analytics"
    >
      {/* Reports Header and Actions */}
      <ReportsHeader reportData={exportData} />

      <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Key Metrics Grid */}
        <ReportStats stats={reportData.stats as any} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <StockMovementChart data={reportData.stockMovement} />
          <InventoryByCategoryChart data={reportData.inventoryByCategory} />
        </div>

        {/* Table Section */}
        <TopUsedParts parts={reportData.topParts as any} />

      </div>
    </DashboardLayout>
  );
}
