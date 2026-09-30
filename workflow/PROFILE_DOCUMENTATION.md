# User Profile & Identity Documentation

This document describes the implementation of the Profile management system, including account updates, avatar handling, and the smart identity fallback system used in the Cashcrow Inventory platform.

## 🏗 Architecture Overview

The profile system is built using a decentralized component pattern that separates identity visualization from data management:

1. **Shared Profile Components (`src/components/shared/profile/`)**: Universal UI components used across both Admin and Member dashboards.
2. **Server Actions (`src/actions/profile.ts`)**: Secure handlers for profile metadata updates and avatar binary management.
3. **Database Layer (`public.profiles`)**: A dedicated table that extends basic authentication data with platform-specific metadata (Phone, Avatar, Role).

---

## 💾 Database Schema

The `public.profiles` table is the source of truth for all user identity data:

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **id** | `uuid` | `auth.uid()` | Primary key linked to `auth.users`. |
| **first_name** | `text` | `NULL` | User's first name. |
| **last_name** | `text` | `NULL` | User's last name. |
| **email** | `text` | `NULL` | Read-only copy of the primary auth email. |
| **phone_number** | `text` | `NULL` | User's primary contact number. |
| **avatar_url** | `text` | `NULL` | Public URL to the profile image hosted in Supabase Storage. |
| **role** | `user_role` | `'MEMBER'` | Defines access levels within the platform. |

---

## 🖼 Smart Identity Fallback

The platform implements a **"No-Photo" Fallback** logic to ensure a professional look even when a user hasn't uploaded an avatar:

- **Logic**: When `avatar_url` is `NULL`, the `ProfileHeader` uses the `getInitials` helper to extract the first letter of the First and Last names.
- **Visuals**: Displays a stylized circular container with calculated initials (e.g., "John Doe" becomes "JD").
- **Removal**: Users can instantly revert to this fallback by clicking the **Remove Photo (Trash)** button.

---

## 🚀 Server Actions & Logic

| Action | Functionality |
| :--- | :--- |
| **`updateProfile`** | Updates name and phone number metadata. Triggers `revalidatePath`. |
| **`uploadAvatar`** | Handles multi-part form data, uploads to Supabase Bucket `profile`, and updates the URL in the database. |
| **`removeAvatar`** | Nullifies the `avatar_url` column and triggers a UI refresh to show initials. |

---

## 📱 Layout & Responsiveness

The profile interface is fully optimized for mobile devices and unified across roles:
- **Unified Clean Layout**: Both Admin and Member profiles share a unified, clean layout focused solely on account information. Redundant "Account Actions" (like logout) have been removed from the profile page as they are already accessible via the main navigation sidebar.
- **Adaptive Header**: Transitions from a left-aligned layout on desktop to a centered, ergonomic view on mobile.
- **Touch Targets**: Management buttons (Camera, Trash, Edit) are scaled and repositioned for easier thumb-interactability.
- **Responsive Form**: Profile fields switch from a two-column grid to a single-column stack on smaller viewports.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── profile.ts        # Server Actions for profile & avatar management
├── lib/
│   └── getInitials.ts    # Helper for generating JD-style fallbacks
├── components/
│   └── shared/
│       └── profile/      # Core Profile UI components
│           ├── profile-header.tsx
│           └── account-info.tsx
├── app/
│   ├── admin/profile/    # Admin entry point
│   └── member/profile/   # Member entry point
```

---

## ⚙️ Business Rules

1. **Email Security**: The email address is synchronized from the auth provider and is **read-only** within the profile form to prevent account hijacking.
2. **Access Control**: Admins have the `ADMIN` role, granting them system-wide analytics access, while `MEMBER` accounts are restricted to basic inventory operations.
3. **Storage Quota**: Avatars are stored as `uuid.ext` in the `avatars/` folder of the `profile` bucket to ensure unique file naming and prevent collisions.
