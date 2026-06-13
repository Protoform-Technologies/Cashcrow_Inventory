# Cashcrow Inventory

Cashcrow Inventory is a specialized, high-performance web application tailored for laboratory environment operations. It offers complete lifecycle tracking for parts, comprehensive supplier management, fine-grained access control for team members, and an atomic daily movement registry.

Built with **Next.js 15+**, **React**, **Tailwind CSS**, and **Supabase**, Cashcrow is designed to feel native, responsive, and blazingly fast.

## 🚀 Features

- **Dashboard & Analytics**: Real-time reporting and aggregated stats (e.g., Low Stock Alerts, Total Valuation).
- **Inventory & Parts Management**: Track inventory items with rich media support (images and technical data sheet PDFs). Intelligent low-stock and out-of-stock indicators.
- **Supplier Directory**: Manage online and offline suppliers, track performance, and embed product purchase links.
- **Atomic Daily Logs**: Track granular movements (IN, OUT, ADJUST, RETURN) for precise auditing without database locking.
- **Team Management**: Robust role-based access control (Admin vs. Member). Immediate session revocation and forced logouts.
- **Modern UI/UX**: Premium aesthetic featuring micro-animations, glassmorphism, responsive data grids, and fully mobile-optimized interfaces.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide React icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Supabase Storage)
- **Deployment**: Optimized for Vercel

## 📖 Documentation

Extensive documentation covering our workflows and system architectures can be found in the `/workflow` directory:
- `AUTH_DOCUMENTATION.md`
- `TEAM_MANAGEMENT_DOCUMENTATION.md`
- `INVENTORY_DOCUMENTATION.md`
- `DAILY_LOGS_DOCUMENTATION.md`
- `PROFILE_DOCUMENTATION.md`
- `SUPPLIER_DOCUMENTATION.md`
- `REPORTS_DOCUMENTATION.md`
- `DASHBOARD_DOCUMENTATION.md`

## ⚙️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Make sure to set up your `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## License

Powered by Protoform Technologies.
