<div align="center">
  <img src="public/logo-2.png" alt="TERFLIX Logo" width="220" />
  
  # 🎬 TERFLIX - Next-Gen Movie & TV Streaming Platform

  **A high-performance, modern movie & TV series streaming web application built with Next.js 15, React 19, Drizzle ORM, and Supabase.**

  [🌐 Live Demo](https://terflix.web.id) • [🚀 Features](#-key-features) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) • [⚙️ Quick Start](#%EF%B8%8F-quick-start)

  ---

  ![Next.js 15](https://img.shields.io/badge/Next.js_15.4-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
  ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
</div>

---

## ✨ Key Features

### 🍿 Movie & TV Series Streaming Experience
- **TMDB Data Integration**: Comprehensive library of Now Playing, Trending, Top Rated, Upcoming, and Indonesian regional movies & TV series.
- **Hero Carousel**: Dynamic featured title carousel with official English logo overlays and high-resolution backdrop art.
- **Responsive Swiper Sliders**: Touch-friendly horizontal movie rails for desktop and mobile.

### 🔍 Netflix / Idlix Style Floating Live Search
- **Instant Floating Modal**: Open search anytime with **`Ctrl + K`** / **`Cmd + K`** or by clicking the navbar search icon.
- **Live Debounced Search**: Fast 300ms live suggestion popup featuring poster previews, release years, category tags (`Movie` / `TV Series`), and TMDB ratings.
- **Full Keyboard Navigation**: Navigate results with **`Up` / `Down`** arrow keys, press **`Enter`** to play, or hit **`ESC`** to close.
- **Auto-Search with Rest Delay**: 500ms debounced input on the main `/search` page prevents redundant network queries while typing.

### 📊 Real-Time Admin Traffic & Analytics Dashboard
- **Interactive Traffic Chart**: Filter website traffic dynamically by **24 Hours**, **7 Days**, **30 Days**, **1 Year**, and **All Time** powered by `recharts`.
- **Key Metrics Overview**: Track Total Page Views, Unique Visitors, Today's Visits, and Growth Trends.
- **Production & Admin Filter**: Website traffic tracking runs strictly in production (`process.env.NODE_ENV === 'production'`) and automatically filters out admin user sessions.
- **User Management**: Admin control panel for updating user roles (`user`, `premium`, `admin`), banning/unbanning accounts, and viewing user statistics.

### ⏱️ Watch History & Continue Watching
- **Automatic Progress Persistence**: Tracks watch progress percentage and last server choice per title/episode.
- **Continue Watching Rail**: Instant resumption rail displayed on the home page.
- **Custom Confirmation Popup**: Sleek glassmorphism confirmation modal for clearing watch history with loading state feedback.

### 🔖 Watchlist, Comments & User Profile
- **Personal Watchlist**: Bookmark movies and TV shows to view anytime.
- **User Comments**: Share thoughts and reviews on movie detail pages.
- **Role-Based Permissions**: Dynamic UI and ad filtering based on user roles (`User`, `Premium`, `Admin`).

### 📱 Progressive Web App (PWA) & Mobile Optimization
- **Offline Service Worker (`sw.js`)**: Installed service worker supporting background push notifications and asset caching.
- **Mobile Responsive Banners**: Automatic detection for mobile screen widths (`< 768px`) serving mobile-optimized ad sizes (`320x50` / `300x250`).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15.4 (App Router)](https://nextjs.org) + React 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org) (Strict Mode) |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team) + [PostgreSQL](https://github.com/porsager/postgres) |
| **Auth & Server** | [Supabase Auth](https://supabase.com) (`@supabase/ssr`) |
| **State Management**| [Zustand](https://zustand.docs.pmnd.rs) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com), [daisyUI v5](https://daisyui.com), Lucide Icons |
| **Charts & Carousel**| [Recharts](https://recharts.org), [Swiper.js](https://swiperjs.com) |
| **Notification** | [React Toastify](https://fkhadra.github.io/react-toastify) |

---

## 📂 Project Architecture

```graphql
movies-stream/
├── app/
│   ├── (dashboard)/            # Admin dashboard & user management routes
│   │   └── dashboard/
│   ├── (main)/                 # Main application routes (home, movie, tv, search, etc.)
│   │   ├── (home)/
│   │   ├── movie/
│   │   ├── tv/
│   │   ├── search/
│   │   └── profile/
│   ├── actions/                # React Server Actions (auth, analytics, watchHistory, manageUsers)
│   ├── api/                    # Route Handlers (TMDB proxy, analytics tracker)
│   │   ├── analytics/track/
│   │   └── tmdb/[...slug]/
│   ├── components/             # Reusable UI components (Navbar, FloatingSearchModal, AdsBanner, etc.)
│   └── layout.tsx              # Root Layout with TrafficTracker & ToastContainer
├── db/                         # Database schema & Drizzle connection
│   ├── schema.ts               # Users, Watchlist, Comments, WatchHistory, PageViews tables
│   └── index.ts
├── lib/                        # Server & client helpers
│   ├── supabase/               # Supabase client initialization
│   └── tmdb/                   # Direct server-side TMDB API fetcher
├── public/                     # Static assets, PWA manifest, service worker (sw.js)
└── zustand/                    # Client-side state stores (userStore)
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- **Node.js**: `v18.17` or higher
- **Package Manager**: `npm`
- **PostgreSQL Database** (e.g. Supabase, Neon, or local Postgres instance)
- **TMDB API Key**: Obtain API access token from [The Movie Database](https://www.themoviedb.org/settings/api)

### 2. Clone the Repository
```bash
git clone https://github.com/AfriawanMaulana/movie_stream_v2.git
cd movie_stream_v2
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:

```env
# Next.js App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# TMDB API Configuration
TMDB_API=https://api.themoviedb.org/3
TMDB_TOKEN=your_tmdb_bearer_token_here

# PostgreSQL Database Connection
DATABASE_URL=postgres://user:password@host:port/database

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Database Migrations
Generate and push database schemas using Drizzle Kit:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

### 6. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Performance Optimizations

- **Direct Server-Side TMDB Fetching**: SSR components fetch data directly from TMDB's API with Next.js response caching (`revalidate: 3600`), bypassing HTTP loopbacks to localhost.
- **Logo Batching**: Carousel logo requests are capped to the top 5 items max for fast TTFB (Time to First Byte).
- **Progressive Streaming**: Dashboard and homepage components utilize React `<Suspense>` boundaries with skeleton placeholders.
- **Request Lifecycle Auth Caching**: Admin authorization checks are wrapped with React `cache()` to prevent duplicate database queries within a single render pass.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by Afriawan Maulana</sub>
</div>
