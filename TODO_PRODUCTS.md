# Add Products Page Mobile Cards TODO

## Status
📋 User request: "add product page mobile responsive card form"

## Analysis
**Page:** /admin/add-product
**Structure:** `add-product-client.tsx` has *inline table* (no separate component)
**Current:** Responsive table (`overflow-x-auto`, `table-fixed`, responsive text/px)
**Goal:** Cards mobile (`md:hidden grid`), table desktop, no logic changes

**Key Features to Preserve:**
- Search/filter? No (but pagination yes)
- Delete confirm row 
- Edit modal 
- Stock status colors
- Image/avatar, all columns (Item/Cat/SKU/Loc/Qty/Status/Actions)
- Pagination (5/page)

**Detailed Plan:**
1. Inline `ProductCard` component 
2. Replace `<table>` block with responsive container
3. Cards: Image/name, details grid, status badge, full-width Edit/Delete
4. Desktop table: Keep exact structure/classes
5. Pagination unchanged below
6. Fix delete confirm for both layouts

**Files:** Only `src/app/admin/add-product/add-product-client.tsx`

✅ User approved
