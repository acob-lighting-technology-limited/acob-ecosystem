# ACOB Ecosystem Hub

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

A unified entry gateway and portal for **ACOB Lighting Technology Limited**, connecting staff, partners, and clients to every digital platform across the organization.

---

## 🌟 Platforms Included

| Platform | URL | Description | Type |
| :--- | :--- | :--- | :--- |
| **ACOB Lighting** | `www.acoblighting.com` | Official corporate site — services, project portfolio, company news, and national reach. | **Public** |
| **Matrix** | `matrix.acoblighting.com` | Internal Enterprise Resource Planning (ERP): HR, leave management, help desk, correspondence, asset tracking, and reporting. | **Internal** |
| **Beverly** | `beverly.acoblighting.com` | Dedicated ACOB platform serving specialized business operations. | **External** |
| **Webmail** | `www.acoblighting.com/mail` | Official corporate email client for `@acoblighting.com` staff. | **Mail** |

---

## 🛠️ Features & Design

- **Interactive Neon Mesh Canvas**: High-performance animated background canvas using custom particle physics.
- **Micro-Animations & Card Launch**: Card click interaction with seamless perspective scaling transition overlay.
- **Responsive Layout**: Designed for mobile, tablet, and desktop display viewports.
- **Dark Aesthetic**: Custom HSL dark palette with neon accents celebration badge.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `^20.0.0` or higher
- npm `^10.0.0` or yarn / pnpm / bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/acob-lighting-technology-limited/acob-ecosystem.git
   cd acob-ecosystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Repository Structure

```
acob-ecosystem/
├── public/
│   └── images/              # Corporate branding, platform logomarks, and webp graphics
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css      # Core design tokens, CSS variables, and keyframe animations
│   │   ├── layout.tsx       # Root layout with Geist font family configuration
│   │   └── page.tsx         # Main Ecosystem Hub landing page component
│   ├── components/
│   │   ├── launch-overlay.tsx # Smooth portal launch overlay animation
│   │   ├── neon-mesh.tsx      # Canvas interactive particle background
│   │   └── platform-card.tsx  # Platform card component with hover & launch triggers
│   └── lib/
│       └── utils.ts         # Utility helpers (clsx & tailwind-merge)
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 📝 License & Copyright

© 2026 **ACOB Lighting Technology Limited**. All rights reserved.
