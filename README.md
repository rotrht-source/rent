# RentFlow — Turnkey Property Rental & Landlord CRM SaaS Template

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.0.1-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178c6.svg)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-Commercial-success.svg)](LICENSE)

**RentFlow** is a complete, production-grade, commercial-ready Property Rental, Booking, and Landlord Management Portal. Designed for landlords, property management agencies, and SaaS entrepreneurs looking to deploy a white-label rental marketplace with built-in tenant ledger, Stripe rent checkout, inspection scheduling, and 30-day lease countdown timers.

---

## 🌟 Key Features

### 🏢 1. Public Rental Marketplace
- **Hero & Curated Discovery**: High-converting search banner with quick location, property type, and budget filters.
- **Dedicated Listings Page (`All Properties`)**: Filter by category (Apartments, Houses & Villas, Commercial Offices, Parking & Garages) and status.
- **Rich Property Detail Modal**:
  - Multi-photo carousel with full desktop upload support.
  - Interactive bedroom, bathroom, floor area, parking, and furnished status badges.
  - Wall colors and interior palette specifications.
  - Instant "Book Property Inspection" form.

### 🔑 2. Unified Multi-Role Authentication
- **Dual Role Support**: Single modal handles both **Landlord Admin** and **Verified Tenant** sign-in.
- **Unique Login ID Verification**: Enforces 3-factor validation (Username, Password, and cryptographic Unique ID such as `TNT-2025-001` or `ADMIN-MASTER-001`).
- **Protected Routing**: Guarded views with immediate redirects and informative locked-state cards.

### 🧑‍💼 3. Landlord CRM Admin Dashboard
- **Executive Metrics**: Live KPI cards for total properties, leased units, occupancy rate, and monthly collected revenue.
- **Leased Property Accounting**:
  - Filter rent payments by month (e.g. May 2026, June 2026, July 2026).
  - Status pills showing Paid vs. Pending per unit.
  - One-click "Mark as Paid" and manual offline payment recorder.
- **Tenant Management**:
  - Add new tenants with customizable lease start dates, monthly rent, and deposit amounts.
  - Assign or reassign available properties dynamically.
  - Instant "Click-to-view Tenant Ledger" modal showing full payment history.
  - 1-Click "Test Login as Tenant" for immediate impersonation/support.
- **Booking Requests & Inspection Scheduler**:
  - Review incoming rental applications.
  - Approve meetings with date, time, and video call link (Google Meet / Zoom).
  - One-click Unique Login ID generator and tenant profile creation.
- **Live Brand & Site Customizer**:
  - Edit company name, logo, contact addresses, phone numbers, and working hours in real-time.
  - Update hero banners and tagline without touching code.
- **Stripe Online Payment Configuration**:
  - Landlord Stripe checkout URL input with live enable/disable toggle.
  - Visual preview of how the checkout appears to tenants.

### 🏠 4. Verified Tenant Portal
- **Active Lease Card**: Current unit details, monthly rent, deposit held, and landlord contact details.
- **Automated 30-Day Lease Countdown**:
  - Live progress bar calculating elapsed vs. remaining days until the next rent due date.
- **Seamless Rent Payment**:
  - **Online via Stripe**: Direct integration with landlord's Stripe checkout link.
  - **Bank Transfer & Mobile Money**: Integrated offline payment submission.
- **Instant Printable Invoices & PDF Receipts**:
  - Automated invoice generation with unique transaction hash (`TXN-...`) and receipt number (`REC-...`).
  - Browser-native print and PDF export ready.

### ⚡ 5. Marketplace Demo Suite (`DemoToolbar`)
- **1-Click Role Logins**: Test Admin and Tenant roles instantly without manual typing.
- **One-Click Database Reset**: Restore the mock database to pristine factory defaults with fresh sample properties, bookings, and tenants.
- **JSON Data Export**: Download a full backup of all properties, tenants, and site configuration with a single click.
- **Collapsible & Dismissible**: Minimize or hide during live production use.

---

## 🔐 Default Demo Credentials

For testing and marketplace evaluation, the following pre-configured credentials can be used or launched via the 1-click **Demo Toolbar**:

| Role | Username | Password | Unique Login ID | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Landlord Admin** | `admin` | `admin` | `ADMIN-MASTER-001` | Full CRM, Properties, Tenants, Settings |
| **Active Tenant** | `tanjina` | `tenant123` | `TNT-2025-001` | Unit 402, Lease Countdown, Invoices |
| **Active Tenant 2** | `john` | `tenant123` | `TNT-2025-002` | Unit 12B, Rent Ledger, Stripe Checkout |

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev) with Functional Components & Hooks
- **Language**: [TypeScript 7.0](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Modern CSS theme variables, zero legacy config)
- **Icons**: [Lucide React](https://lucide.dev)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev)
- **Server Runtime**: [Express](https://expressjs.com) & [tsx](https://github.com/privatenumber/tsx)
- **Storage**: Client-authoritative localStorage schema with instant reactivity and JSON backup/restore.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 18.0.0 or higher recommended)
- npm or pnpm or yarn

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the local Vite dev server on port 3000:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Build for Production
Create an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `/dist` directory, ready to deploy to Vercel, Netlify, Cloudflare Pages, AWS S3, or any static/container host.

### 4. Run TypeScript Check
```bash
npm run lint
```

---

## 🎨 White-Labeling & Customization

1. **Brand Name & Logo**:
   - Navigate to **Admin Dashboard -> Site Settings**.
   - Enter your custom company name, tagline, logo image, and banner graphics.
   - Click **Save Changes** — the navbar, hero banner, contact footer, and invoice receipts update instantly.

2. **Connecting Real Stripe Checkout**:
   - Go to your [Stripe Dashboard](https://dashboard.stripe.com) -> Payment Links.
   - Create a Payment Link for your rent or property management fee.
   - Paste the link into **Admin Dashboard -> Site Settings -> Stripe Checkout Payment URL**.
   - Ensure the **Enable Online Stripe Rent Payment** toggle is switched ON.

3. **Currency & Localization**:
   - Default currency is set to USD (`$`).
   - To update, adjust the currency formatting utility in `src/data/mockData.ts` and `src/context/AppContext.tsx`.

---

## 📦 Commercial License

This template is licensed under the **Commercial Application License**. You are granted a non-exclusive license to:
- Use this codebase to build and host your own commercial application or client projects.
- Modify, re-brand, and extend the features for unlimited end users.
- Re-distribution or resale of the unmodified source code on competing marketplaces without permission is prohibited.

---

© 2026 RentFlow Technologies. Built for modern property management.
