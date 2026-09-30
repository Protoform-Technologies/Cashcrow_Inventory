# Dashboard & Parts Insights Documentation

This document describes the implementation of the Dashboard system, including data fetching strategies, shared components, and the real-time activity tracking used in the Cashcrow Parts Management system.

## 🏗 Architecture Overview

The dashboard is designed for high performance and modularity, using a **Shared Component Pattern** that allows both Admin and Member dashboards to leverage the same UI logic while displaying role-specific data.

### Key Components:
- **Shared Layout (`src/components/shared/dashboard/layout.tsx`)**: Provides the responsive shell with sidebar, header, and mobile-ready navigation.
- **Server Actions (`src/actions/dashboard.ts`)**: The interface between the UI and the data layer, optimized for Next.js Server Components.
- **Data Service (`src/lib/dashboard.ts`)**: Contains optimized database queries using Supabase, featuring parallel execution and server-side caching.
- **Global Search**: A unified search interface that queries both inventory parts and suppliers simultaneously.

---

## 🚀 Performance Optimization: Data Aggregation

To ensure the dashboard loads in under **1 second**, we implement several database-level and application-level optimizations:

**1. Parallel Query Execution:**
In `fetchDashboardStats`, we use `Promise.all()` to trigger multiple counts (Total Parts, Out of Stock, Recent Logs) simultaneously, reducing total latency to that of the single slowest query.

**2. Intelligent Caching:**
All core data fetching functions are wrapped in React's `cache()` utility. This ensures that even if multiple components on the same page request the same data, only one database call is performed.

**3. Minimal Data Transfer:**
Instead of fetching entire rows for calculations (like Low Stock), we fetch only the necessary columns (`quantity`, `min_stock_level`) to minimize the JSON payload size.

---

## 📊 Shared Dashboard Components

The system uses a set of primitive components located in `src/components/shared/dashboard/`:

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Stats Grid** | Visual metrics | Displays Total Parts, Low Stock, and Daily Activity at a glance. |
| **Daily Log Feed** | Real-time tracking | Color-coded feed showing IN, OUT, ADJUST, and RETURN movements. |
| **Welcome Banner** | User Context | Dynamic time-based greetings and specific status alerts for the logged-in user. |
| **Sidebar** | Navigation | Role-aware navigation that dynamically switches between Admin and Member routes. |

---

## 🔍 Global Search Implementation

The dashboard provides a "Command-K" style search experience:
- **Multi-Table Search**: Queries both `products` and `suppliers` tables in a single operation.
- **Result Grouping**: Automatically categorizes results into "Parts" and "Suppliers" with status indicators.
- **Debounced Interaction**: Optimized to prevent database spamming during rapid typing.

---

## 🔄 Activity Feed Logic

The activity feed (`fetchRecentActivityFeed`) maps database transaction types to user-friendly UI elements:

- 🟢 **STOCK ADDING (IN)**: Emerald theme for incoming inventory.
- 🔵 **STOCK UPDATING (OUT)**: Blue theme for stock removal.
- 🟠 **AUDIT CHECKING (ADJUST)**: Amber theme for manual stock corrections.
- 🟣 **STOCK RETURNED (RETURN)**: Purple theme for returned items.
- 🔴 **STOCK WARNING (SCRAP)**: Rose theme for damaged or scrapped parts.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── dashboard.ts      # Server Actions for stats, inventory, and search
├── lib/
│   └── dashboard.ts      # Core logic, SQL queries, and activity mapping
├── components/
│   └── shared/
│       └── dashboard/    # Core dashboard UI components
│           ├── layout.tsx
│           ├── sidebar.tsx
│           ├── header.tsx
│           ├── stats-grid.tsx
│           └── daily-log-feed.tsx
```

---

## 🛡️ Role-Based Customization

While components are shared, they adapt to the user's role:
- **Admin**: Views system-wide statistics and has access to full management navigation (Suppliers, Quotes, Reports).
- **Member**: Views personal activity and inventory status with restricted navigation (Dashboard, Parts, Daily Log).

---

## ⚙️ Business Rules & Logistics Alerts

The dashboard serves as the central interpreter for various inventory and procurement signals:

### 1. Supply Chain Health
- **Supplier Lead Time**: Quantifies vendor reliability using badges like **Fast Delivery** (≤5 days) or **Standard** (6-10 days) synced through the logistics engine.
- **Onboarding Alerts**: Successful **Supplier Onboarding** triggers high-priority alerts to the procurement team, highlighting their **Category** (Electronics, Hardware, etc.) and and **Payment Terms** (e.g., **Immediate**).

### 2. Alert Thresholds
- **Critical Stock**: Quantity reaching 0. 
- **Low Stock**: Quantity ≤ `min_stock_level`. 
- **Delayed Delivery**: Identified via the **Slow Turnaround** badge for partners with lead times over 10 days.
