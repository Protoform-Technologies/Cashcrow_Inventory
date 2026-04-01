"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

interface ExportButtonProps {
  reportData: any;
}

export default function ExportButton({ reportData }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add Logo Placeholder / Header
      doc.setFillColor(38, 80, 53); // Primary Color #265035
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("CASHCROW LAB", 20, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("INVENTORY SYSTEMS - REPORTS & ANALYTICS", 20, 32);

      // Report Info
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Inventory Status Report", 20, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 68);
      doc.text(`Period: ${reportData.period?.formatted || 'All Time'}`, 20, 73);

      // Section: Key Metrics
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Key Metrics", 20, 90);
      doc.line(20, 92, pageWidth - 20, 92);

      let yPos = 100;
      reportData.stats.forEach((stat: any) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(stat.label, 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(stat.value, 150, yPos, { align: "right" });
        doc.text(stat.trend, 155, yPos);
        yPos += 10;
      });

      // Section: Top Used Parts
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Top Used Parts (Monthly)", 20, yPos);
      doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
      yPos += 12;

      // Table Header
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("SKU", 20, yPos);
      doc.text("Part Name", 60, yPos);
      doc.text("Usage", 160, yPos, { align: "right" });
      doc.text("Status", 185, yPos);
      yPos += 8;

      reportData.topParts.forEach((part: any) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.text(part.sku, 20, yPos);
        doc.text(part.name, 60, yPos);
        doc.setFont("helvetica", "bold");
        doc.text(part.usage, 160, yPos, { align: "right" });
        doc.setFontSize(8);
        doc.text(part.status.toUpperCase(), 185, yPos);
        doc.setFontSize(10);
        yPos += 10;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const footerText = "This is a computer-generated report. Confidential. Cashcrow Laboratory.";
      doc.text(footerText, pageWidth / 2, 285, { align: "center" });

      doc.save(`Cashcrow_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`bg-[#265035] hover:bg-[#1e402a] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] flex items-center gap-2.5 transition-all shadow-lg shadow-[#265035]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="tracking-widest">Export Report</span>
        </>
      )}
    </button>
  );
}

