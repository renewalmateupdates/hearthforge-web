# Raid Ready Labs Web

Premium 3D printing brand website with full CMS admin dashboard.

**Live site:** https://raidreadylabs.com  
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## What's Built

### Public Site
- Homepage (hero, features, products, portfolio, testimonials, CTA)
- Products listing + product detail pages
- Portfolio / gallery with project detail pages
- About page (story, mission, team)
- Blog (listing + full post pages)
- FAQ (category-grouped accordion)
- Contact form

### Admin Dashboard (`/admin`)
| Section | What you can do |
|---|---|
| Homepage | Edit hero, features, featured products, CTA sections |
| Products | Add / edit / delete / reorder products and STL files |
| Portfolio | Upload and manage project gallery |
| About | Edit company story, mission, team info |
| Testimonials | Add / edit / delete customer reviews |
| FAQ | Add / edit / delete / drag-to-reorder questions |
| Blog | Create drafts, publish posts, manage categories |
| Contact Forms | View submissions, mark as read, export CSV |
| Media Library | Upload, organize, copy URLs for all images |
| Navigation | Edit main and footer menu items |
| SEO | Edit page titles, descriptions, OG images per page |
| Site Settings | Business name, logo, contact info, social links |
| Users | Invite team members, assign admin/editor roles |
| Analytics | Google Analytics integration |

---

## Setup

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. SQL Editor → paste and run `supabase/schema.sql`
3. Storage → create two public buckets: `media` and `avatars`

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://raidreadylabs.com
ADMIN_EMAIL=hearthforge.hq@gmail.com
```

### 3. Create Admin Account
1. Supabase → Authentication → Users → Invite user
2. Enter your email, accept the invite, set a password
3. Visit `/login` and sign in

### 4. Deploy
Connect this repo to Vercel, add the env vars above, deploy.

---

## Development
```bash
npm install
cp .env.example .env.local
# fill in .env.local with your Supabase values
npm run dev
```
