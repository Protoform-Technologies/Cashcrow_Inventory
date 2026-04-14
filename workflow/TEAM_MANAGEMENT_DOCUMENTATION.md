# Team Management & Lab Directory Documentation

This document details the technical implementation of the Team Management module, including user onboarding, role synchronization, and security enforcement in the Cashcrow Lab Inventory system.

## 🏗 Architecture Overview

The Team Management module manages the lifecycle of laboratory personnel. It coordinates between **Supabase Auth** (for identity) and a custom **`profiles`** table (for laboratory-specific metadata).

### Key Components:
- **Server Actions (`src/actions/members.ts`)**: Orchestrates the multi-step process for adding, updating, and deleting members.
- **Member Library (`src/lib/members.ts`)**: Low-level database operations using the Supabase Service Role (Admin) client.
- **Email Service (`src/lib/email.ts`)**: Handles automated onboarding notifications via Resend.
- **UI Components**: 
  - `MembersList`: High-density directory with mobile-optimized cards.
  - `AddMemberForm`: Wizard-style onboarding.
  - `EditMemberForm`: Fine-grained access control management.

---

## 🚀 Onboarding Workflow

Adding a new member follows an atomic 3-step sequence to ensure consistency:

1. **Identity Creation**: The user is created in `auth.users` via the Supabase Admin API. A temporary password (`Cashcrow@123`) is assigned.
2. **Profile Creation**: A corresponding record is inserted into the `public.profiles` table with laboratory metadata (First Name, Last Name, Role).
3. **Notification**: An automated invitation email is dispatched via **Resend** to the member's email address using the `onboarding@resend.dev` domain.

---

## 🛡️ Security & Access Control

### Role Synchronization
We use a **"Metadata-First"** approach. When a user's role is updated in the `profiles` table, the application logic simultaneously updates the Supabase Auth `app_metadata`. This ensures the user's JWT (session token) contains the most recent role for high-speed middleware redirection.

### Forced Session Invalidation
Security is enforced immediately. If an administrator changes a member's role (e.g., from Admin to Member), the system triggers a **Global Sign-out**:
- **`dbForceLogOutMember`**: Uses the Supabase Admin API to invalidate all active sessions for that specific user ID.
- **Result**: The user is instantly kicked out of their current session and must log back in to receive their updated permissions.

---

## 📱 User Experience & Design

### Responsive Lab Directory
The directory uses a hybrid layout to maximize screen real estate:
- **Desktop**: A comprehensive table view for rapid scanning.
- **Mobile**: High-density cards where name fields stack vertically to prevent text truncation.
- **Premium Aesthetics**: All interactive elements (modals, buttons, and inputs) utilize a `rounded-full` pill-style design and a monochromatic green (`#265136`) color palette.

---

## 📂 Folder Structure

```text
src/
├── actions/
│   └── members.ts         # Add, Delete, and Update server actions
├── app/admin/add-members/ # Administrative route for team management
├── components/admin/members/
│   ├── add-member-form.tsx # Onboarding form logic
│   ├── edit-member-form.tsx # Profile modification logic
│   └── members-list.tsx   # Responsive directory & search
├── lib/
│   ├── members.ts         # Admin-level Supabase DB/Auth utilities
│   └── email.ts           # Resend email integration logic
```

---

## 📊 Database Schema: `profiles`

The `profiles` table is the source of truth for laboratory identity:

| Field | Type | Description |
| :--- | :--- | :--- |
| **id** | UUID | Primary Key (Foreign Key to auth.users) |
| **first_name** | Text | Member's first name |
| **last_name** | Text | Member's last name |
| **email** | Text | Unique login email |
| **role** | UserRole | Access level (ADMIN / MEMBER) |
| **is_active** | Boolean | Controls account access status |
| **avatar_url** | Text | Optional profile image link |

---

## 📧 Email Notifications (Resend)

Automated communication is handled in `src/lib/email.ts`. During the verification phase, the system is configured to:
- **Sender**: `onboarding@resend.dev` (Standardized testing domain).
- **Template**: HTML-rich email providing the temporary password and a direct link to the Cashcrow login portal.
