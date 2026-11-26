# ArtVault — Curated Fine Art & Original Masterpiece Marketplace

ArtVault is an e-commerce platform built for fine artists, galleries, and collectors in India. It supports 1-of-1 original artworks, certified limited edition Giclée prints, verifiable digital & physical Certificates of Authenticity (COA), 2D room wall visualizers, and India-first checkout flows with simulated Razorpay Route split settlements and scheduled courier pickups.

---

## 🎨 Key Features

1. **Collector Storefront & Discovery**:
   - Filter catalog by Medium (*Oil on Canvas*, *Acrylic*, *Charcoal & Sketches*, *Watercolor*, *Heritage*), Style, and Price in INR.
   - Distinct classification between **1-of-1 Unique Originals** and **Numbered Archival Giclée Prints**.
   - Custom archival framing selector (*Natural Raw Oak Wood*, *Minimalist Gallery Black*, *Antique Gold Leaf*).
   - **"View in Your Room" 2D Visualizer**: Calibrated wall scale preview with customizable wall colors.

2. **Integrity & Provenance**:
   - Cryptographically verifiable **Digital Certificate of Authenticity (COA)** with unique QR token codes.
   - Concurrency protection preventing cart double-booking of unique 1-of-1 originals.

3. **India-First Payment & Logistics**:
   - Razorpay Route integration with simulated support for **UPI**, **RuPay/Credit/Debit Cards (3D Secure)**, and **NetBanking**.
   - Compliant with **HSN 9701** (12% GST on artwork).
   - Scheduled white-glove courier pickup with Delhivery Fine Art / BlueDart Logistics.
   - 7-day buyer escrow inspection window before artist funds clearance.

4. **Artist Studio Dashboard**:
   - Listing studio to upload originals, dimensions, packaging methods (Archival PVC Tube vs. Wooden Box Crate), and optional limited print runs.
   - Scheduled courier pickup manager.
   - Earnings & Split Settlement Ledger displaying 20% platform fee and 1% TDS under Section 194-O.

5. **Curator & Admin Command Desk**:
   - Gross Merchandise Value (GMV), platform commission revenue, and pending escrow balance.
   - Artist KYC verification queue (PAN, bank details, portfolio screening).
   - Platform commission take-rate controls.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org) + React 19 + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + Lucide Icons
- **Database / ORM**: [Prisma ORM](https://www.prisma.io) + PostgreSQL
- **Hosting**: [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/artvault.git
cd artvault
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize the Database
```bash
npm run prisma:push
npm run prisma:seed
```

The seed creates the ArtVault admin, Pragya Jain (artist), and Kartik Jain (collector) accounts. It deletes unreferenced legacy demo listings and archives any linked to orders, reviews, or payouts so transaction history is preserved.

The local demo sign-in accounts are:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@artvault.in` | `AdminPassword123!` |
| Artist | `pragya@artvault.in` | `PragyaPassword123!` |
| Collector | `kartik@artvault.in` | `KartikPassword123!` |

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
Private project for ArtVault Technologies India Pvt Ltd.
