# IdeaVault – Startup Idea Sharing Platform

IdeaVault is a premium single-page web application (SPA) where builders, creators, and investors gather to share groundbreaking startup concepts, evaluate business feasibility programmatically, and validate ideas collectively through feedback threads.

## 🚀 Live Demonstration Link
👉 **[IdeaVault Live Site (Vercel)](https://b13-a09-murex.vercel.app/)**

## 📂 GitHub Repository
👉 **[GitHub Repository (NazifaNeloy/b13_A09)](https://github.com/NazifaNeloy/b13_A09)**

---

## ✨ Key Platform Features

- **💡 Disruptive Pitch Vault**: Share comprehensive startup models, estimated launch budgets, target audience metrics, and problem/solution parameters inside a beautifully formatted, responsive catalog.
- **⚡ Interactive Pitch Feasibility Deck Estimator**: An onboard mathematical simulator tool allowing users to adjust operational budget thresholds, target reach scales, and sector uniqueness to calculate a business viability index with dynamic executive suggestions.
- **🗺️ Startup Ecosystem Growth timeline stepper**: An interactive navigation widget illustrating detailed operational milestones, metrics targets, and execution strategies sequentially from Pre-Seed Ideation to Unicorn Scale.
- **🎨 Curated Glassmorphism Design System**: Built with modern, harmonious custom Vanilla CSS styling tokens, featuring smooth micro-animations, customizable responsive forms, and a persistent dark mode toggle mapped globally across all views.
- **🔐 Firebase Auth & Secure Server JWT Coordination**: Leverages Firebase Authentication (supporting secure Email/Password and Google OAuth logins) integrated seamlessly with client-side JWT token storage to guard private routes and securely authenticate database operations.
- **💬 Community Validation comments CRUD**: Engages users via real-time collaborative discussion threads, allowing innovators to write, edit, and delete constructive feedback recommendations on posted pitches.

---

## 🛠️ Technology Stack

- **Client Boilerplate**: React 18 + Vite (ES6 Modules)
- **Styling Architecture**: Custom Vanilla CSS (Design tokens, glassmorphism, responsive grids)
- **Routing Engine**: React Router DOM (v6)
- **Authentication**: Firebase Authentication SDK
- **Alert Notifications**: React Hot Toast
- **Animations & Effects**: Canvas Confetti (For submission celebrations!)
- **Networking**: Axios + Secure Request Interceptors

---

## 💻 Quick Start Guide

1. Navigate to the client folder:
   ```bash
   cd ideavault-client
   ```
2. Install client-side packages:
   ```bash
   npm install
   ```
3. Set up your `.env.local` environmental keys inside the root:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Fire up the high-performance local hot-reloaded development environment:
   ```bash
   npm run dev
   ```
