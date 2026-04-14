# Quote & Procurement Management Documentation

This document explains the technical implementation of the Quote Management system, detailing how "Request for Quotes" (RFQs) are generated, tracked, and reported within the Cashcrow platform.

## 🏗 Architecture Overview

The quote system follows a clear separation of concerns, splitting UI representation, business logic (actions), and a robust data access layer (lib).

### Key Components:
- **Quote Database Layer (`src/lib/quotes-db.ts`)**: A dedicated DAL for all quote-related queries and mutations. It uses the Supabase Service Role client for critical status updates to bypass RLS.
- **Procurement Actions (`src/actions/quotes.ts`)**: Server-side handlers that bridge the UI with the database, managing ID generation and path revalidation.
- **PDF Reporting Engine (`src/lib/quote-reports.ts`)**: A client-side library built on `jsPDF` that generates formal, branded audit reports.
- **Registry Components (`src/components/admin/quotes/`)**: Responsive UI tools for generating new requests and auditing historical procurement traces.

---

## 🚀 Key Features

### 1. Lifecycle Tracking
Every quote request follows a strict status lifecycle through the `QuoteStatus` enum:
- ⏳ **PENDING**: Initial trace created, awaiting supplier response or internal check.
- 📦 **ORDERED**: Formal order placed based on a received quote.
- ✅ **APPROVED**: Procurement finalized and verified.
- 🚫 **DENIED**: Quote rejected or request cancelled.

### 2. Audit-Ready PDF Generation
Standardized reports are generated instantly without server round-trips:
- **Branding**: Includes emerald-themed corporate headers and systematic metadata.
- **Transparency**: Every report includes a unique Request ID (RFQ-TRACE) and a full item specification breakdown.
- **Notes**: Supports strategic notes for internal procurement justification.

---

## 💾 Data Flow & Mutations

The system utilizes specialized **Database Abstraction** to ensure mutations are atomic and high-performance.

**The Mutation Flow:**
1. **Selection**: Admin selects a Product and Supplier in the `RequestQuoteForm`.
2. **Identification**: `getNextRequestId()` generates a sequential serial number (`RFQ-2026-04-XXXX`).
3. **Database Write**: `createQuoteInDB` stores the core metadata in the `quotes` table.
4. **Instant Registry**: The `Audit Registry` (Table) refreshes its state via `router.refresh()` to show the new record.
5. **Status Update**: Users can change the Lifecycle Status via the `StatusDropdown`, which triggers an administrative update via the Service Role client.

---

## 📊 Quote Components

Components are designed for high-density information display and administrative efficiency:

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Audit Registry** | Historical Tracking | Hybrid view (Desktop Table / Mobile Cards) with date-based filtering. |
| **Status Dropdown** | Lifecycle Control | **Fixed Position** rendering to bypass table stacking context issues. |
| **Request Form** | Data Entry | Multi-step form with real-time total amount estimation. |
| **Final Summary** | Action Hub | Central hub for PDF generation and Gmail integration. |

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── quotes.ts         # Server actions & revalidation logic
├── lib/
│   ├── quotes-db.ts      # Specialized Database Access Layer (DAL)
│   └── quote-reports.ts  # Client-side jsPDF reporting logic
├── components/
│   └── admin/quotes/     # Procurement-specific UI components
│       ├── quote-history-table.tsx
│       ├── request-quote-form.tsx
│       └── quotes-header.tsx
└── app/
    └── admin/quotes/     # Primary procurement route
```

---

## 🛑 Technical Note: Stacking Context Resolution

Due to the complex rendering constraints of HTML `<table>` elements, the `StatusDropdown` utilizes **CSS Fixed Positioning** and dynamic viewport coordinate calculation via `getBoundingClientRect()`. This ensures that the administrative menu always renders on top of the audit table without being clipped by parent overflow settings.

---
