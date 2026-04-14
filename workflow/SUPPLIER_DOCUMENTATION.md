# Supplier Management & Logistics Documentation

This document explains the technical implementation of the Supplier Management system, used to track procurement partners, financial details, and logistics metadata within the Cashcrow Parts Management.

## 🏗 Architecture Overview

The supplier management system is designed to handle high-density partner data while maintaining a responsive user interface. It utilizes Server Actions for secure database interaction and modular UI components for versatile data representation.

### Key Components:
- **Supplier Actions (`src/actions/suppliers.ts`)**: Encapsulates all CRUD logic, server-side search, and notification triggers.
- **Supplier Views (`src/components/admin/suppliers/`)**: A rich library of components supporting tabbed views, tables, and detailed modal profiles.
- **Admin Command Center**: Located at `/admin/suppliers`, this page serves as the primary gateway for all procurement-related management.

---

## 🚀 Key Features

### 1. Comprehensive Partner Profiles
Unlike simple contact lists, the system tracks deep metabolic data for each supplier:
- **Identity**: Company name, website, and categorization.
- **Logistics**: Standard Lead Time (days) and Payment Terms.
- **Financial Details**: GST Number and full Banking information (Account, IFSC, Branch, Payment ID).
- **Communication**: Primary contact names, emails, and phone numbers.

### 2. Versatile Data Representation
The system provides two primary modes of viewing data:
- **Grid View**: Focuses on accessibility and high-level categorization.
- **Table View**: Optimized for administrative precision with multi-column sorting and filtering.

---

## 💾 Data Management & Mutations

The system uses Next.js **Server Actions** to manage the supplier lifecycle:

**The Mutation Workflow:**
1. **Validation**: Form data is parsed and validated (e.g., converting lead times to integers).
2. **Database Execution**: Direct interaction with the `suppliers` table via the Supabase client.
3. **Cache Updates**: Calls `revalidatePath('/admin/suppliers')` to refresh the server-side cache.
4. **Broadcasting**: Triggers a `SUPPLIER_ADDED` notification to alert administrators when a new partner is onboarded.

---

## 📊 Shared Supplier Components

The UI is broken down into performance-focused components:

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Suppliers Table** | Data management | High-density view with support for edit, delete, and detail actions. |
| **Supplier Stats** | Business intelligence | Visualizes total partner count and active categories. |
| **Detail Modal** | Comprehensive view | A side-peek or modal interface showing banking and contact info without navigation. |
| **Management Forms** | Onboarding & Edits | Sectioned forms for complex data entry (Add/Edit). |

---

## 🔍 Search & Logistics Tracking

Efficiency in procurement is handled via server-side operations:
- **Unified Search**: Search across Company Name, Contact Name, and Category using `ilike` pattern matching.
- **Lead Time Tracking**: Standardized lead time fields help in predictive inventory ordering.
- **Pagination**: Implements consistent pagination to handle growing partner lists without performance degradation.

---

## ⚙️ Logistics Business Logic

The system automatically interprets quantitative logistics data into qualitative statuses to aid administrative decision-making:

### 1. Delivery Performance (Lead Time)
The system categorizes suppliers based on their `lead_time` (days) across all views (Cards, Table, Details):
- **Fast Delivery** (≤ 5 Days): Highlighted in **Emerald**. Optimal for just-in-time inventory.
- **Standard** (6 - 10 Days): Highlighted in **Blue**. Default expectation for most hardware/electronics.
- **Slow Turnaround** (> 10 Days): Highlighted in **Orange**. Requires early ordering or safety stock.

### 2. Payment Terms
Financial agreements are standardized to ensure clear billing cycles:
- **Immediate**: Payment required upon invoicing.
- **Net 15/30/60**: Payment due within specified days.
- **COD**: Cash on Delivery.
- **Due on Receipt**: Payment expected upon physical delivery.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── suppliers.ts      # CRUD operations and search logic
├── components/
│   └── admin/suppliers/  # Core UI components
│       ├── suppliers-view.tsx
│       ├── suppliers-table.tsx
│       ├── supplier-detail-modal.tsx
│       ├── add-supplier-form.tsx
│       └── suppliers-header.tsx
└── app/
    └── admin/suppliers/  # Protected admin route for supplier management
```

---

## 🚛 Procurement Connectivity (Parts Sync)

The supplier system is the primary data source for the **Multi-Vendor Logic** used in the Parts Management module:
- **Part Association**: Suppliers defined here can be linked to multiple parts in the **Parts Onboarding** workflow.
- **Logistics Integration**: The **Standard Lead Times** documented here directly inform the procurement strategy for associated parts.
- **Financial Sync**: **Payment Terms** (e.g., Immediate) ensure that replenishment orders for parts align with the organization's financial liquidity policies.
