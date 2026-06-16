# Inventre — IoT Marketplace, Academy & Project Lab

A premium, conversion-focused platform for **ready-made IoT kits**, **custom project development**, and **workshops / internships**. Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS v4 — ready to deploy on Vercel.

## ✨ What's included (frontend foundation)

| Area | Route | Status |
|---|---|---|
| Home (hero, categories, featured, workshops, internships, testimonials, partners, CTA) | `/` | ✅ Done |
| Project catalogue with live filters (domain / size / price / search / sort) | `/projects` | ✅ Done |
| Project detail (gallery, demo video, features, components, buy/add-to-cart) | `/projects/[slug]` | ✅ Done (8 sample kits) |
| Custom project request (3-step form + quotation status flow) | `/custom-project` | ✅ Done |
| Workshops & training (programs + booking form) | `/workshops` | ✅ Done |
| Internship portal (apply + student-dashboard preview) | `/internships` | ✅ Done |
| Learning center (Project Builder cost calculator, blogs, **certificate verification**) | `/learn` | ✅ Done |
| Lead intake API | `/api/leads` | ✅ Stub (logs + echoes ref id) |
| Floating WhatsApp / chat support | global | ✅ Done |
| Responsive nav, footer, 404 | global | ✅ Done |

The design system lives in `app/globals.css` (white + dark-navy theme, brand/cyan accents, mesh gradients, glass, animations). Reusable primitives are in `components/ui.tsx` and `components/Field.tsx`. All catalogue content is mock data in `lib/data.ts` with production-shaped types.

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

## ▲ Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset auto-detects **Next.js** — no config needed. Click **Deploy**.

Or from the CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## 🔌 Wiring to a real backend (next steps)

These are intentionally stubbed so you can plug in your stack of choice:

- **Database & CRM** — add Prisma + Postgres (Neon/Supabase). Models suggested in the spec: Users, Projects, Categories, Orders, Cart, Payments, CustomRequests, WorkshopRequests, Leads, Quotations, Trainers, Internships, Certificates, Blogs, Tickets. Persist leads in `app/api/leads/route.ts`.
- **Payments** — wire `BuyActions` "Buy now" + a new `/api/checkout` to **Razorpay** (UPI) or Stripe.
- **Auth & dashboards** — add NextAuth/Clerk for the student, trainer and admin portals.
- **Admin panel** — build `/admin` (dashboard, project management, workshop management, CRM, support) behind auth.
- **File uploads** — connect the custom-project document upload to S3 / UploadThing.
- **Certificate verification** — back `components/CertVerify.tsx` with a DB lookup or signed credential.
- **Live chat / WhatsApp** — replace the floating widget links with a real provider (e.g. WATI, Crisp).
- **CMS** — move blog & project content to a CMS (Sanity/Contentlayer) or keep in `lib/data.ts`.

## 🗂️ Structure

```
app/            routes (home, projects, custom-project, workshops, internships, learn, api)
components/     Navbar, Footer, ui primitives, forms, cards, calculators, chat
lib/            site config + mock catalogue data
```

Built with a premium SaaS aesthetic — clean, mobile-first, fast, conversion-focused.
