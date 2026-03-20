# TODO_VENDORS: Display 4 Vendors in Parts Modal + Suppliers Filter

Status: ⏳ In Progress

## Steps (4 total)
- [x] 1. Create seedSampleVendors in src/actions/products.ts
- [x] 2. Update src/app/admin/parts/parts-client.tsx (show first 4 vendors as SupplierCards + View All link) ✓
- [x] 3. Add filter in src/app/admin/suppliers/suppliers-client.tsx (by productId/name)
- [x] 4. Test: seed → parts modal → view all → filtered suppliers ✓

## Current Progress
Step 1: Creating this TODO

**Testing Commands:**
```
npm run dev
→ /admin/parts → select part → verify 4 vendors shown
→ click View All → /admin/suppliers?product=ID → filtered results
```

