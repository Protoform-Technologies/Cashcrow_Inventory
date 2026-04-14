# Inventory & Parts Management Documentation

This document explains the technical implementation of the Inventory Management system, detailing how parts are tracked, categorized, and managed through the Cashcrow platform.

## 🏗 Architecture Overview

The inventory system follows a clear separation of concerns, splitting UI representation, business logic (actions), and data access (lib).

### Key Components:
- **Part Management Actions (`src/actions/products.ts`)**: Handles the complex lifecycle of a part, including file processing, notifications, and path revalidation.
- **Inventory Service Layer (`src/lib/inventory.ts`)**: Provides standardized, cached read/write operations for the `products` table.
- **Shared UI Components (`src/components/shared/inventory/`)**: A modular library of components used for both grid-based browsing and deep-dive part details.
- **Admin & Member Routes**: Dedicated pages in `/admin/parts` and `/member/parts` that utilize shared logic with role-specific permissions.
- **Onboarding Workflow**: Specialist Add/Edit forms located in `src/components/admin/parts/`.

---

## 🚀 Key Features

### 1. Stock Status Intelligence
The system dynamically calculates the status of every item based on its current quantity and `min_stock_level`:
- ✅ **In Stock**: Quantity > Minimum Stock Level.
- ⚠️ **Low Stock**: Quantity > 0 but ≤ Minimum Stock Level.
- 🚫 **Out of Stock**: Quantity is exactly 0.

### 2. Multi-Media Integration
Inventory items support rich metadata through Supabase Storage:
- **Part Photos**: Stored in the `products` bucket.
- **Technical Data Sheets**: PDF documentation stored in the `data_sheets` bucket, allowing users to view specifications directly from the part page.
- **QR/Barcode Support**: (Internal SKU tracking) Every part is indexed by a unique SKU for quick identification.

---

## 💾 Data Flow & Mutations

The system uses Next.js **Server Actions** to handle multipart form data for product creation and updates.

**The Mutation Flow:**
1. **Action Receipt**: Receives `FormData` containing text fields, binary files, and **Vendors JSON**.
2. **Storage Processing**: Files are uploaded to Supabase Storage, and public URLs are generated.
3. **Database Write**: The clean metadata + public URLs + Vendors Array are sent to `src/lib/inventory.ts` for insertion/update using the `products` table schema.
4. **Cache Invalidation**: `revalidatePath()` is called to ensure all dashboard stats and inventory lists are instantly updated.
5. **Notification Trigger**: System alerts are fired for events like "New Part Added" or "Item Out of Stock".

---

## 📊 Shared Inventory Components

Components are designed to be high-fidelity and responsive:

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Inventory Table** | List browsing | Hybrid view (Desktop Table / Mobile Cards) with built-in pagination. |
| **Part Card** | Grid visualization | High-density information display including stock progress bars. |
| **Detail History** | Audit trail | Lists all movements (IN, OUT, ADJUST) specific to a single part. |
| **Detail Stats** | Performance metrics | Quick-view cards showing lifetime usage and current stock metrics. |
| **Onboarding Form** | Data Entry | Premium sectioned UI with **Multi-Vendor** (Online/Offline) support. |

---

## 🔍 Search & Filtering

Inventory search is performed on the server to handle large datasets efficiently:
- **Filters**: Supports filtering by Name, SKU, and Category.
- **Pagination**: Defaulted to 6-8 items per page to maintain optimal load times.
- **URL-State Sync**: Search and Page parameters are kept in the URL, making inventory views shareable and bookmarkable.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── products.ts       # Logic for Add/Edit/Delete + File Uploads
├── lib/
│   └── inventory.ts      # Pure PostgreSQL queries & Status helpers
├── components/
│   ├── admin/inventory/  # Admin-specific inventory tools
│   └── shared/inventory/ # Reusable UI components
│       ├── inventory-table.tsx
│       ├── product-card.tsx
│       ├── product-detail-history.tsx
│       └── product-detail-sidebar.tsx
└── app/
    ├── admin/parts/      # Admin parts management routes
    └── member/parts/     # Member parts viewing routes
```

---

---

## 🚛 Supply Chain & Multi-Vendor Integration

Part availability is tightly coupled with **Supplier Lead Times** and **Multi-Vendor Pricing**:
- **Replenishment Cycles**: Procurement decisions are informed by the supplier's delivery status (e.g., **Fast Delivery** partners for urgent stock-outs).
- **Vendor Comparison**: Each part supports multiple vendors via a `jsonb` field, tracking **Shop Names**, **MRP/Amount**, and **Online Links** (e.g., Amazon, Offline Retailers).
- **Standardized Categories**: Every part is mapped to one of 8 global categories (Electronics, Hardware, etc.) to ensure database consistency.

## 🔔 Automated Alert System

The inventory logic is tightly integrated with the notification system:
- **Global Visibility**: When a new part is added, a `PRODUCT_ADDED` notification is broadcast to all relevant roles.
- **Critical Alerts**: If a stock update results in a zero quantity, an `OUT_OF_STOCK` critical alert is triggered instantly, providing a direct link to the affected part for restocking.
