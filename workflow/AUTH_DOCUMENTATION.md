# Authentication & Role Management Documentation

This document explains the technical implementation of the authentication system, role-based access control (RBAC), and performance optimizations used in the Cashcrow Lab Inventory Management system.

## 🏗 Architecture Overview

The authentication system is built using **Next.js 14 (App Router)** and **Supabase Auth**. It uses a "Metadata-First" approach to ensure high performance and low latency.

### Key Components:
- **Middleware (`src/middleware.ts`)**: The first line of defense. Handles session validation and instant role-based redirects.
- **Server Actions (`src/actions/auth.ts`)**: Handles login, logout, password resets, and metadata caching logic.
- **API Callback (`src/app/api/auth/callback/route.ts`)**: Handles the OAuth/Magic link code exchange.
- **Supabase PostgreSQL**: Stores persistent user profiles and syncs roles to the authentication layer.

---

## 🚀 Performance Optimization: Metadata Caching

Traditional authentication requires querying a database table (e.g., `profiles`) on every page load to check the user's role. This adds significant latency (~500ms - 2s).

**Our Optimized Flow:**
1. **First Login**: The system fetches the role from the `profiles` table.
2. **Caching**: The role is saved into the user's Supabase `app_metadata`.
3. **Subsequent Access**: The role is now part of the encrypted JWT (session token).
4. **Middleware**: The middleware reads the role directly from the token—**zero database hits** required for redirects.

---

## 🔑 Role-Based Access Control (RBAC)

The system supports two primary roles:
- **ADMIN**: Access to the `/admin` dashboard and all management features.
- **MEMBER**: Access to the `/member` dashboard for inventory requests and viewing.

### Security Implementation:
Redirection is handled automatically by the middleware based on the following pattern:
- `/admin/*` $\rightarrow$ Restricted to **ADMIN**.
- `/member/*` $\rightarrow$ Restricted to **MEMBER**.
- `/` (Root) $\rightarrow$ Redirects authenticated users to their respective dashboard instantly.

---

## 📁 Folder Structure

```text
src/
├── actions/
│   └── auth.ts           # Login, Session Cache, Password Reset logic
├── app/
│   ├── (auth)/           # Route group for auth pages (Login, Forgot, Reset)
│   ├── api/auth/callback # Server-side auth code exchange
│   ├── admin/            # Admin dashboard routes
│   └── member/           # Member dashboard routes
├── lib/
│   └── supabase.ts       # Supabase client creators (SSR & Admin)
└── middleware.ts         # High-speed session & role verification
```

---

## 🔄 Automatic Synchronization (SQL Trigger)

To ensure that changing a role in the database instantly updates the user's access, a PostgreSQL trigger is used:

```sql
create or replace function public.handle_role_sync()
returns trigger as $$
begin
  update auth.users
  set raw_app_metadata = raw_app_metadata || 
    jsonb_build_object('role', new.role, 'is_active', new.is_active)
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;
```

This trigger fires whenever a row in the `profiles` table is inserted or updated, keeping the authentication token in sync with the database.

---

## 🛡️ Role-Based Permission Matrix

Access to system resources is strictly governed by the user's role:

| Feature | ADMIN Role | MEMBER Role |
| :--- | :--- | :--- |
| **Parts Viewing** | Full Access | Full Access |
| **Stock Adjustments** | Full Access | No Access |
| **Parts Onboarding** | Full Access | No Access |
| **Supplier Management** | **Full Access** | No Access |
| **Logistics Branding** | **Full Access** | No Access |

### Administrative Management Logic
Only users with the `ADMIN` role can access the **Supplier Onboarding** workflows. This ensures that critical logistics metadata—such as **Lead Times** (Standard/Fast) and **Payment Terms** (Immediate)—is managed by authorized procurement officers to maintain platform-wide data integrity.
