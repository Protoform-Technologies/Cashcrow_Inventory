# Reports & Analytics Documentation

This document outlines the architecture and implementation of the Reports & Analytics module, designed to provide high-fidelity inventory insights and trend tracking for the Cashcrow Parts Management system.

## 🏗 Architecture Overview

The module follows a three-tier architecture that separates data aggregation, business logic, and UI rendering:

1. **Analytics Engine (`src/lib/report.ts`)**: The core logic layer that performs multi-table aggregations and calculates trends (Month-over-Month).
2. **Server Actions (`src/actions/reports.ts`)**: Provides secure, type-safe data fetching for both Server and Client components.
3. **Responsive UI (`src/components/admin/reports/`)**: A collection of high-performance React components optimized for real-time data visualization.

---

## 🚀 Performance & Data Engine

The system is optimized for speed and accuracy using several advanced strategies:

**1. Parallelized Queries:**
In `fetchReportAnalyticsData`, we use `Promise.all()` to simultaneously query Total Value, Consumption stats, and Category distribution, reducing page load to under **800ms**.

**2. Dynamic Time Filtering:**
The engine accepts `month` and `year` parameters, allowing the system to recalculate the entire dashboard state on-the-fly without a full page reload.

**3. Intelligent Trend Calculation:**
Trends are computed by comparing current period data against the previous period. The logic includes safety checks for "zero-values" to prevent division-by-zero errors in growth percentages.

---

## 📊 Analytics Components

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Report Stats** | High-level KPIs | Displays Inventory Value, Consumption Qty/Value, and Low Stock counts with MoM trends. |
| **Stock Throughput** | Velocity Tracking | A bar chart comparing Inbound vs. Outbound part movements for the selected period. |
| **Category Split** | Asset Distribution | A donut chart showing how your inventory value is distributed across different categories. |
| **Utilized Resources** | Item-level Insights | A detailed list of top-usage parts with mobile-responsive card views. |

---

## 🔍 Data Visualization Logic

The module uses **Recharts** for its visualization layer, with several customizations:
- **Interactive Labels**: Bar charts include `LabelList` for immediate numeric visibility.
- **Responsive Hubs**: Charts automatically sync with the global "Reports Header" while maintaining local state for deep-dives.
- **Theming**: Integrated with the **Cashcrow Emerald** design system for a premium, laboratory-grade aesthetic.

---

## 🔄 Filtering & Synchronization

The dashboard maintains a "Two-Way Sync" for filters:
- **Global Header**: Updates URL search parameters for bookmarkable and shareable report views.
- **Local Selectors**: Allow individual charts to deep-dive into different periods; these automatically re-align whenever the Global Header is changed.

---

## 📱 Mobile-First Design

To ensure usability in a laboratory environment:
- **Card-to-Table Transition**: The "Utilized Resources" list transforms from a compact card stack on mobile to a detailed table on desktop.
- **Adaptive Spacing**: Paddings and font sizes are dynamically adjusted using Tailwind's responsive breakpoints.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── reports.ts        # Server Actions for analytics data
├── lib/
│   └── report.ts         # Core SQL aggregations and trend logic
├── components/
│   └── admin/
│       └── reports/      # Specialized analytics UI components
│           ├── reports-header.tsx
│           ├── report-stats.tsx
│           ├── stock-movement-chart.tsx
│           ├── inventory-category-chart.tsx
│           └── top-used-parts.tsx
```

---

## 🛡️ Business Rules

- **Total Inventory Value**: Calculated as `sum(quantity * unit_price)` across all active inventory items.
- **Monthly Consumption**: Sum of all `OUT` movements for the selected period.
- **Status Classification**:
  - 🟢 **STABLE**: Inventory moving at normal rates.
  - 🟠 **LOW STOCK**: Items reaching critical thresholds.
  - 🔴 **CRITICAL**: Out-of-stock items requiring immediate procurement.
