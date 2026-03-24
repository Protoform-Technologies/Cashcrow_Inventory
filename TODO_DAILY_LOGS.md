# Daily Log Page Mobile Cards TODO (Members-style)

## Status
📋 New task from user feedback

## Plan Overview
**Target:** `src/components/dashboard/submitted-logs-table.tsx` (Submitted Logs History table)
**Goal:** Cards on mobile, table on desktop (md+), no structure changes

**Files Analyzed:**
- `src/app/admin/daily-log/page.tsx`: Fetches data → DailyLogClient
- `src/app/admin/daily-log/daily-log-client.tsx`: Renders `<SubmittedLogsTable logs={submittedLogs} />`
- `submitted-logs-table.tsx`: Table with Date/Creator/Items/Notes/Actions
- Preserves: View modal, delete, all state/logic

**Detailed Plan:**
1. Add `LogCard` component (avatar/date, creator, item badges, notes truncate, action buttons)
2. Responsive container: `md:hidden grid gap-4` + `hidden md:block table`
3. Mobile pagination? N/A (no pagination in current table)
4. Delete confirm: Row/card replacement
**✅ COMPLETE**

Updated `submitted-logs-table.tsx`:
- Added `LogCard` component
- Responsive: `md:hidden grid` (mobile cards) + `hidden md:block table` (desktop)
- Cards: Header (date/items count), creator avatar, items badges, notes (line-clamp-2), full-width View/Delete
- Table: Optimized desktop (min-w-[600px], gap-1 actions)
- Fixed TS error: Proper LogCard props type

**Test:** `npm run dev` → /admin/daily-log → Mobile/Desktop toggle
