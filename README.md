# Foundation (Next.js)

A polished worship/faith media platform built in Next.js 16 App Router with search, video/podcast content, auth, and multi-API aggregation.

## 🚀 Live Demo

- https://foundation-next-js.vercel.app/

## 🧩 What this app does

- Global search by Bible, sermons, podcasts, music, and related content
- Embedded hero video + “trending” media flows
- Client/server state via React Context (`SearchContext`)
- Dynamic category switcher (`Sermons`, `Podcasts`, etc.)
- “Load more” pagination for sermons
- 404 fallback via `app/not-found.js`
- Error fallback via `app/error.js`
- User session menu with Clerk (`@clerk/nextjs`)
- Link-based nav (`donations`, `downloads`, `settings`, `Trending`)
- API proxy routes:
  - `/api/hero` → YouTube Hero suggestions
  - `/api/bible` → Bible API (scripture.api.bible)
  - `/api/podcasts` → ListenNotes
  - `/api/sermons` → YouTube search
- Supabase client setup in `app/api/Supabase.js` (C.R.U.D support can be built in)

## 🛠️ Stack

- Next.js 16 + App Router
- React 19
- Tailwind CSS
- Clerk auth
- Supabase JS
- YouTube Data API, ListenNotes API, Bible API
- React Player + icons + hook-form + toast
- ESLint + Next.js lint config
- Context Api

## 📁 Key files

- `app/layout.js` - root layout + fonts
- `app/page.js` - main landing pipeline
- `app/AppBody.js` - header/hero/trending/footer wrapper
- `app/not-found.js` - 404 page (auto-rendered)
- `app/error.js` - error boundary
- `app/_components/` - UI components (Header, Search, Podcast, Sermons, etc.)
- `app/api/**/route.js` - server API handler entrypoints
- `app/_lib/` - API helper functions

## ⚙️ Setup (Local)

1. Clone:
   ```bash
   git clone <repo-url>
   cd Foundation.Next.Js
   npm install
   ```
2. Add `.env.local` (example)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<...>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<...>
   BIBLE_API_KEY=<...>
   YOUTUBE_API_KEY=<...>
   LISTEN_NOTES_API_KEY=<...>
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`

## ✅ Checklist for portfolio readiness

- [x] Feature-rich
- [x] Buyable by recruiters
- [x] Real API integration
- [x] Auth flow
- [x] Route + 404 + error handling
- [x] Add `README` + setup docs + live demo
- [ ] Add tests (unit/integration)
- [ ] Cleanup secret key leakage in code (`Supabase.js` best replaced w/ env vars)

## 🔒 Security note

- `app/api/Supabase.js` includes hardcoded Supabase key. Replace with env-based secret config before public repo release.

## 🧹 Next steps

- Add `jest` / `vitest` tests for `Trending`, `SearchBar`, and API routes.
- Move Supabase credentials to `.env.local` (see setup section).
