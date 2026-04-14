# Add Supplier Onboarding Documentation

This document detail the technical and functional aspects of the **Supplier Onboarding Page** (`/admin/add-suppliers`), designed to integrate new procurement partners into the Cashcrow ecosystem with high data integrity.

## 🏗 Page Architecture

The onboarding page is built as a focused, high-utility environment that separates the complexity of supplier registration from the main management tables.

### File Structure:
- **Route**: `src/app/admin/add-suppliers/page.tsx` (Server Component)
- **Form Component**: `src/components/admin/suppliers/add-supplier-form.tsx` (Client Component)

---

## 📝 Form Structure & Sections

The onboarding process is broken down into four logical clusters to ensure a smooth user experience even with high-density data requirements:

### 1. General Information
- **Company Name**: *Mandatory*. Used as the primary identifier across the system.
- **Website**: Optional URL for partner verification.

### 2. Contact Details
- **Contact Name**: Primary point of person at the vendor organization.
- **Communication Channels**: captures Email and Phone for direct outreach via the **Supplier Detail Modal**.

### 3. Logistics & Category
- **Standardized Categories**: Users must select from a predefined 8-category list (Electronics, Hardware, IT Services, etc.) to ensure database consistency.
- **Payment Terms**: Defines the financial agreement (e.g., **Immediate**, Net 30, COD).
- **Lead Time**: Integer value representing the typical delivery duration. This triggers the **Logistics Status Logic**.

### 4. Billing Information
- **Financial IDs**: captures GST details.
- **Banking Infrastructure**: Full support for Account numbers, IFSC codes, and Branch tracking.
- **Digital Payments**: Dedicated field for UPI IDs or Payment Mobile numbers.

---

## ⚙️ Backend Logic & Normalization

To prevent data fragmentation, the onboarding form implements strict normalization rules before submission:

### 1. Title Case Normalization
Every category string is normalized to **Title Case** (e.g., `electronics` → `Electronics`). This prevents duplicate entries caused by mixed-casing in the database.

### 2. Logic Triggers
- **Lead Time Status**: Upon saving, the `lead_time` value is categorized:
    - **≤ 5 Days**: Fast Delivery
    - **6-10 Days**: Standard
    - **> 10 Days**: Slow Turnaround
- **Notifications**: Successful onboarding triggers a `SUPPLIER_ADDED` notification specifically to **ADMIN** roles.

---

## 🚀 Deployment & Permissions
- **Access**: Restricted to `ADMIN` roles via `DashboardLayout` checks.
- **Navigation**: Accessible via the "Add Supplier" button in the Suppliers Header or the sidebar.
- **Success Workflow**: On completion, users are automatically redirected to the main Suppliers list with a fresh cache via `router.refresh()`.
