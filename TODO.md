# Member Dashboard Implementation TODO

## Plan Overview
Copy admin dashboard content to member routes. Limit member sidebar to: Dashboard, Parts, Daily Log, User Profile, Settings.

## Steps (to be checked off as completed)

### 1. [x] Update src/actions/auth.ts
- Add `getMemberProfileOrRedirect()` function (mirror admin version for role='MEMBER').

### 2. [x] Update src/components/dashboard/sidebar.tsx
- Define separate `memberNavItems` array.
- Update filtering: if isAdmin → full nav, else → Dashboard (/member), Parts (/member/parts), Daily Log (/member/daily-log), Profile (/member/profile), Settings (/member/settings).
- Keep account section + logout.

**Next Action**: Complete step 3 (member/page.tsx).

### 3. [x] Upgrade src/app/member/page.tsx
- Replace placeholder with copy of admin/page.tsx content.
- Use getMemberProfileOrRedirect.

### 4. [x] Create src/app/member/parts/page.tsx
- Copy src/app/admin/parts/page.tsx exactly.
- Replace getAdminProfileOrRedirect with getMemberProfileOrRedirect.

### 5. [x] Create src/app/member/daily-log/page.tsx
- Copy src/app/admin/daily-log/page.tsx exactly.
- Use getMemberProfileOrRedirect.

### 6. [x] Create src/app/member/profile/page.tsx
- Enhanced profile view with edit capability.

### 7. [x] Create src/app/member/settings/page.tsx
- Basic settings placeholder.

### 8. [x] Test
- Verified sidebar/content works for member.

**✅ COMPLETE**

**Next Action**: Complete step 1 (auth.ts).

