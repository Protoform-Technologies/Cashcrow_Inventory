# Supplier Billing Fields Implementation

## Steps (approved plan):
- [ ] 1. Provide/run Supabase SQL migration to add DB columns
- [x] 2. Update src/actions/suppliers.ts (add billing fields handling)
- [x] 3. Update src/components/dashboard/add-supplier-form.tsx (add Billing section + interface)
- [x] 4. Update src/components/dashboard/edit-supplier-form.tsx (add Billing section + interface)
- [x] 5. Update interfaces in client files:
  - [x] src/app/admin/suppliers/suppliers-client.tsx
  - [x] src/app/admin/add-suppliers/add-suppliers-client.tsx
  - [x] src/components/dashboard/supplier-detail-modal.tsx
  - [x] src/components/dashboard/supplier-card.tsx
  - [x] src/components/dashboard/suppliers-table.tsx
- [ ] 6. Test: Add supplier with billing → verify save/display/edit
- [x] 7. Optional: Enhance display (modal stats/PDF)
- [ ] 8. Mark complete, cleanup TODO

**DB Migration SQL:**
```sql
ALTER TABLE suppliers 
ADD COLUMN gst_no TEXT,
ADD COLUMN bank_account TEXT,
ADD COLUMN ifsc TEXT,
ADD COLUMN branch TEXT;
```
Run in Supabase dashboard > SQL editor.

**Post-edit:** `npm run dev` + test /admin/add-suppliers

