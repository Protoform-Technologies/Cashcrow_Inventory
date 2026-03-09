# Parts Page Enhancement Task

## TODO List:
- [x] 1. Install jsPDF dependency
- [x] 2. Create parts-client.tsx component with:
  - Product list view (cards/grid layout)
  - Individual product detail view
  - Search functionality
  - PDF download option for each product
- [x] 3. Update parts/page.tsx to use the new client component
- [x] 4. Create Add Suppliers page with form:
  - General Information section (Company Name, Website)
  - Contact Details section (Primary Contact Name, Email, Phone) - all optional
  - Operational Information section (Lead Time, Payment Terms, Category)
  - Tax ID removed as per requirement
- [x] 5. Update sidebar to include Suppliers link

## Notes:
- Keep existing code structure (components, lib, actions)
- Use Tailwind CSS for styling (matching existing design)
- PDF includes: Product name, SKU, category, location, stock info, supplier info
- Contact information is optional in Add Suppliers form

