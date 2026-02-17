# SmartMark - Supercharge Your Bookmarks

SmartMark is a premium bookmark manager built with Next.js, Supabase, and Tailwind CSS. It features Google OAuth, real-time syncing, and a sleek, modern UI.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Database & Auth:** Supabase (PostgreSQL, GoTrue, Realtime)
- **Styling:** Tailwind CSS 4
- **Icons:** Material Symbols Outlined

## Features
- **Google OAuth:** Seamless login experience without passwords.
- **Private Bookmarks:** Row Level Security (RLS) ensures only you see your links.
- **Real-time Updates:** Changes reflect across all tabs instantly using Supabase Realtime.
- **Premium UI:** Glassmorphism headers, optimized cards, and responsive layout.

## Problems Encountered & Solutions

### 1. Real-time Synchronization Across Tabs
**Problem:** Initially, adding a bookmark would only update the current tab's state. Opening the app in another tab wouldn't show the new bookmark until a refresh.
**Solution:** Integrated `supabase.channel().on('postgres_changes', ...)` to listen for `INSERT` and `DELETE` events. This allows the UI to stay in sync across any number of open tabs without manual polling.

### 2. Secure Private Access (User Isolation)
**Problem:** Need to ensure User A can never accidentally or maliciously access User B's bookmarks at the database level, not just the UI.
**Solution:** Implemented **Row Level Security (RLS)** in Supabase. By using `auth.uid() = user_id` policies, the database itself rejects any request for data not belonging to the authenticated user, providing a robust security layer.

### 3. Handling Google OAuth in App Router
**Problem:** Next.js App Router handles cookies differently than the Pages router, which can lead to session hydration issues.
**Solution:** Used `@supabase/ssr` with a custom middleware implementation to refresh the user session on every request. This ensures that the server-side `getUser()` calls are always accurate and persistent across navigations.

### 4. Visual Feedback for Link Previews
**Problem:** Showing just a URL is boring. Users want to see what they saved.
**Solution:** Integrated a simple screenshot/preview API (`microlink.io`) to dynamically generate card thumbnails based on the bookmark URL, giving the dashboard a "premium" feel.

## Getting Started

1. **Clone the repo.**
2. **Install dependencies:** `npm install`
3. **Environment Variables:**
   - Add your Supabase URL and Anon Key to `.env.local`.
4. **Run the app:** `npm run dev`
