# 🌍 WorldAtlas v2.0 (World Countries Explorer)

An ultra-modern, high-performance web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. Converted and upgraded from a legacy Vite React project into a full-featured, zero-latency world demographics and nation explorer.

---

## ⚡ What's New & Upgrades

### 1. 🚀 Converted to Next.js 15 App Router & React 19
- Migrated from legacy client-side Vite to **Next.js 15 App Router** with full **SSG (Static Site Generation)**.
- All 250 country detail pages are pre-rendered at build time for instant (<20ms) page loads.
- Strict TypeScript interfaces for type safety and auto-completion.

### 2. ⚡ Blazing-Fast Local & Cached API (Fixing Deprecation)
- **Problem Solved**: The old `restcountries.com/v3.1` public API is deprecated and frequently fails or rate-limits.
- **Solution**: Embedded, highly optimized 250-country dataset with O(1) indexed lookups by `cca2`, `cca3`, `ccn3`, and name.
- **API Endpoints**:
  - `GET /api/countries`: Query with `search`, `region`, `subregion`, `sort`, `page`, `limit`, and status flags (`independent`, `unMember`, `landlocked`). Response time ~10-30ms.
  - `GET /api/countries/[code]`: Single country lookup that automatically resolves neighboring borders into names and flags.
  - `GET /api/stats`: Global summary metrics (world population, largest countries, continent breakdown).

### 3. 🎨 Modern Glassmorphism Design & Dark Mode
- Full **Dark Mode / Light Mode** theme toggle with persistent state and zero-flash initialization.
- Premium UI with glassmorphic cards, smooth hover animations, region pills, and status badges.
- Responsive layout supporting Grid View and Compact List View.

### 4. 🌟 Rich New Features
- **Instant Search**: Real-time fuzzy search by country name, official name, native name, or capital city.
- **Advanced Filtering**: Filter by Continent/Region, Subregion, Independent status, UN Membership, and Landlocked status.
- **Sorting Options**: Sort by Population (High to Low / Low to High), Name (A-Z / Z-A), Land Area (Largest first).
- **Interactive Country Comparison**: Compare up to 4 countries side-by-side in a comparative matrix with a floating bottom drawer.
- **Favorites / Bookmarking**: Bookmark countries with localStorage persistence and dedicated management page (`/favorites`).
- **World Geography Trivia Quiz (`/quiz`)**: Interactive game with 2 game modes ("Guess the Flag" and "Guess the Capital") with live score and streak counters!
- **Demographics & Analytics (`/analytics`)**: Top 10 population charts, top 10 land area charts, and continental distribution metrics.
- **Detailed Country Page (`/country/[code]`)**: Coat of Arms, official & native names, interactive maps, dialing codes, driving side, and clickable neighboring nations.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
country/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── countries/           # Fast cached API routes
│   │   │   │   ├── route.ts
│   │   │   │   └── [code]/route.ts
│   │   │   └── stats/route.ts
│   │   ├── country/[code]/page.tsx  # Dynamic SSG Country Details
│   │   ├── compare/page.tsx         # Side-by-side Comparison Matrix
│   │   ├── favorites/page.tsx       # Saved Favorite Nations
│   │   ├── quiz/page.tsx            # Geography Trivia Game
│   │   ├── analytics/page.tsx       # Demographics & Charts
│   │   ├── globals.css              # Custom Tailwind Styles & Themes
│   │   ├── layout.tsx               # Root Layout with Theme & Nav
│   │   └── page.tsx                 # Main Explorer & Search Hub
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── CountryCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── StatsOverview.tsx
│   │   └── ComparisonDrawer.tsx
│   ├── data/
│   │   └── countries.json           # Comprehensive 250-country dataset
│   ├── lib/
│   │   └── country-service.ts       # O(1) Search & Filter Engine
│   └── types/
│       └── country.ts               # Complete TypeScript Types
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```
