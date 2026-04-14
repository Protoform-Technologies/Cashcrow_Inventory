# Add Part Onboarding Documentation

This document details the technical and functional aspects of the **Part Onboarding Page** (`/admin/add-parts`), designed to register new inventory items and manage multi-vendor procurement data within the Cashcrow system.

## 🏗 Page Architecture

The onboarding page is designed for high-focus data entry, distinct from the main inventory browsing interface, ensuring that new parts are indexed with complete metadata.

### File Structure:
- **Route**: `src/app/admin/add-parts/page.tsx` (Server Component)
- **Form Component**: `src/components/admin/parts/add-part-form.tsx` (Client Component)

---

## 📝 Form Structure & Sections

The form uses a sectioned "white-card" layout to organize different data clusters:

### 1. General Information
- **Part Name**: Primary identifier for the item.
- **SKU / Item Code**: Unique barcode/serial for stock tracking.
- **Category**: Standardized selection from 8 predefined categories (Electronics, Hardware, etc.).
- **Part Photo**: Visual identifier stored in Supabase Storage.

### 2. Storage Location
- **Shelf & Box Codes**: alphanumeric identifiers (e.g., Shelf `S2`, Box `B12`) to physically locate items in the laboratory or warehouse.

### 3. Inventory Management
- **Initial Quantity**: The starting stock level.
- **Min Stock Level**: The critical threshold that triggers **Low Stock** alerts.

### 4. Purchase Details (Multi-Vendor)
The most complex section of the form, supporting multiple procurement sources for a single part:
- **Vendor Mode**: Toggle between **Online** and **Offline**.
- **Shop Name**: The name of the vendor (e.g., Amazon, Sigma-Aldrich).
- **MRP / Amount**: The unit price from that specific vendor.
- **Vendor Link**: Specific URL for Online vendors for quick re-ordering.

---

## ⚙️ Backend Logic & Multi-Vendor Storage

The system handles vendor data as dynamic JSON objects to allow for unlimited procurement scaling:

### 1. JSONB Serialization
Vendors are collected into a JSON array and saved into the `vendors` column of the `products` table. This allows the system to store "Online/Offline" states and links without needing a secondary table, optimizing database performance.

### 2. Category Normalization
All parts are assigned to one of the following 8 standard categories to ensure platform-wide data parity:
`Electronics`, `Hardware`, `Consumables`, `Lab Equipment`, `IT Services`, `Office Supplies`, `Manufacturing`, `General`.

---

## 🚀 Deployment & Permissions
- **Access**: Restricted to `ADMIN` roles.
- **Logic Sync**: Successful part registration triggers a `PRODUCT_ADDED` notification to all ADMINS and revalidates all dashboard metrics.
- **Navigation**: Accessible via the "Add Parts" button in the Inventory Header or the sidebar.
