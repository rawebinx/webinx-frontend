# WebinX — Webinar Discovery Platform

## Overview

A modern webinar discovery platform built with React (Vite) frontend and Express backend. Users can browse, filter, and register for webinars across technology, business, design, and more.

## Architecture

- **Frontend**: React + Wouter (routing) + TanStack Query + shadcn/ui + Tailwind CSS
- **Backend**: Express.js with in-memory storage (MemStorage)
- **Shared**: TypeScript schemas via Drizzle ORM type definitions in `shared/schema.ts`

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `pages/home.tsx` | Homepage with search, categories, trending & upcoming webinars |
| `/webinars` | `pages/webinars.tsx` | Listing page with category/sector/date filters |
| `/webinars/:id` | `pages/webinar-detail.tsx` | Detail page with registration dialog |
| `/hosts/:id` | `pages/host.tsx` | Host profile with bio, expertise, and their webinars |

## Key Components

- `components/navbar.tsx` — Top navigation bar with theme toggle
- `components/footer.tsx` — Site footer
- `components/webinar-card.tsx` — Reusable card with gradient image, progress bar, register button

## Data Models (shared/schema.ts)

- **Host**: id, name, bio, avatar, company, role, expertise[], followers, website
- **Webinar**: id, title, description, hostId, category, sector, date, duration, attendees, maxAttendees, imageUrl, isTrending, isUpcoming, isFree, price, tags[]
- **Registration**: id, webinarId, email, name, registeredAt

## API Endpoints

- `GET /api/webinars` — List webinars (optional filters: category, sector, date, search)
- `GET /api/webinars/trending` — Trending webinars
- `GET /api/webinars/upcoming` — Upcoming webinars
- `GET /api/webinars/:id` — Single webinar with host + registration count
- `GET /api/hosts` — All hosts
- `GET /api/hosts/:id` — Single host profile
- `GET /api/hosts/:id/webinars` — Webinars by host
- `POST /api/webinars/:id/register` — Register (body: {name, email})

## Seed Data

10 webinars and 5 hosts seeded on startup. Categories include: AI & Machine Learning, Marketing, Entrepreneurship, Design, Finance, Leadership.

## Run

```bash
npm run dev
```
