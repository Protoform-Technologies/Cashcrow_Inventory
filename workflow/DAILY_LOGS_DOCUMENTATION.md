# Daily Log & Movement Tracking Documentation

This document explains the technical implementation of the Daily Logs system, detailing how physical inventory movements are tracked, audited, and processed to maintain stock accuracy.

## 🏗 Architecture Overview

The daily log system is designed for high-granularity auditing, ensuring every single part movement is recorded as an independent transaction.

### Key Components:
- **Atomic Log Actions (`src/actions/day-logs.ts`)**: Implements the **Atomic Submission Protocol**, which processes movement batches into separate, traceable records.
- **Log Service Layer (`src/lib/day-logs-service.ts`)**: Handles complex data aggregation, joining logs with user profiles (creator and recipient) and part details.
- **Shared UI Components (`src/components/shared/day-logs/`)**: Unified interface for entering stock movements and viewing historical audit trails.
- **Role-Based Access**: Dedicated routes for Admin (`/admin/daily-log`) and Member (`/member/daily-log`) that leverage shared logic.

---

## 🚀 Key Features

### 1. Atomic Submission Protocol
To ensure maximum accountability, the system avoids "bulk logs" in the database. Instead:
- Every line item in the submission form is saved as its own `day_logs` parent and `day_log_items` child.
- This allows administrators to audit, search, or delete individual movements without affecting an entire multi-item batch.

### 2. Stock Awareness & Logic
Movement types are tied directly to inventory calculations:
- 📥 **IN / RETURN**: Increases current quantity of the part.
- 📤 **OUT / SCRAP / ADJUST**: Decreases current quantity (preventing negative stock).
- **Validation**: Submissions are floor-limited to zero to maintain data integrity.

---

## 💾 Data Flow & Mutations

The system uses Next.js **Server Actions** to process movement registries and sync them with the inventory state.

**The Mutation Flow:**
1. **Entry Capture**: Users enter movement details (Part, Qty, Type, Recipient) in the `LogSubmissionView`.
2. **Atomic Processing**: The `submitAtomicLogs` action loops through each entry.
3. **Database Insertion**: An independent log record is created for each movement.
4. **Stock Synchronization**: For every movement, the `products` table is updated in the same loop to ensure real-time inventory reflecting.
5. **Cache Invalidation**: `revalidatePath()` is called for both the log registry and the inventory views.

---

## 📊 Daily Log Components

Components are built to handle batch operations and clear audit visualizations:

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| **Log Submission** | Data Entry | Multi-row interactive form with part search and type selection. Includes a **Finalize Record Confirmation Modal** to prevent accidental submissions. |
| **Audit Registry** | Historical View | High-density list with profile-enhanced "Taken By" info and transaction tags. Includes a **Delete Confirmation Modal** for administrators to safely remove logs. |
| **Log Summary** | Quick Stats | View of today's total movements and most active parts. |

---

## 👤 Dynamic Actor Tracking

When physical inventory movements are submitted, the system automatically tags the log with the **Current Logged-in User** acting as the "Actor" (the person entering the data). This replaces generic or "Unknown" placeholders, ensuring an accurate and indisputable audit trail of who performed the digital transaction vs who physically took the part ("Taken By").

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── day-logs.ts       # Atomic Submission logic & inventory syncing
├── lib/
│   └── day-logs-service.ts # Complex data fetching & deletion logic
├── components/
│   └── shared/day-logs/  # Core UI shared across Admin/Member
│       ├── log-submission-view.tsx
│       ├── log-history-registry.tsx
│       └── log-status-badge.tsx
├── types/
│   └── day-logs.ts       # Protocol-specific TypeScript interfaces
└── app/
    ├── admin/daily-log/  # Admin logistics dashboard
    └── member/daily-log/ # Member logistics dashboard
```

---

## 🚛 Atomic Auditing Protocol

Each entry is treated as its own independent lifecycle event. By decoupling movement lines into separate parent log records, the system provides:
- **Granular Deletion**: Admins can remove a single incorrect "OUT" entry without deleting other valid "IN" entries submitted at the same time.
- **Precise Metadata**: Unique notes, recipient IDs, and purposes are stored per movement, eliminating ambient data noise in the audit trail.
- **Searchable Logic**: Filtering logs by "User" or "Part" returns exactly the relevant movements, making stock audits significantly faster.

---
*Created: April 2026*
