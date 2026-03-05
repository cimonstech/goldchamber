# Chamber of Licensed Gold Buyers — Website

Next.js 14 website for the Chamber of Licensed Gold Buyers (CLGB). Design: restrained authority — dark, gold-accented, premium.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **TypeScript**

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Hero animation (frames)

The homepage hero uses scroll-driven frame animation. Frames live in `public/ezgif-jpg/` as `ezgif-frame-001.jpg` … `ezgif-frame-240.jpg`. They were copied from the project’s `ezgif-jpg` folder into `public/ezgif-jpg` during setup. If you add new frames, keep the same naming and update `TOTAL_FRAMES` in `components/hero/HeroAnimation.tsx` if needed.

## Key paths

| Path | Description |
|------|-------------|
| `app/page.tsx` | Homepage (hero + sections) |
| `app/layout.tsx` | Root layout, fonts, Navbar, Footer, particle background |
| `components/hero/HeroAnimation.tsx` | Scroll-driven canvas frame animation |
| `components/hero/HeroContent.tsx` | Hero badge, headline, CTAs |
| `components/nav/Navbar.tsx` | Main nav (desktop + mobile) |
| `components/ParticleBackground.tsx` | Ambient gold particles (all pages except home) |
| `tailwind.config.ts` | Gold/dark/cream colours, fonts, spacing |

## Pages

- `/` — Home
- `/about` — Our Story
- `/about/leadership` — Leadership
- `/about/core-values` — Core Values
- `/about/why-choose-us` — Why Choose Us
- `/membership` — Membership tiers + application form
- `/gold-trading` — Services
- `/newsroom` — News listing
- `/newsroom/[slug]` — Article
- `/contact` — Contact details + form
- `/faqs` — FAQs
- `/gallery` — Media gallery

## Forms

Membership and contact forms currently only set local state (no API). To send emails, add an API route (e.g. `app/api/contact/route.ts`, `app/api/membership/route.ts`) and wire the forms to it (e.g. with Resend or Nodemailer).

## Build

```bash
npm run build
npm start
```

## Design tokens (Tailwind)

- **Colours:** `gold` (light, DEFAULT, dark, deep), `dark`, `cream`
- **Fonts:** `font-display` (Cormorant Garamond), `font-sans` (Montserrat)
- **Spacing:** `py-section` / `py-section-md` / `py-section-sm` for vertical section padding
