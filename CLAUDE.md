# Parham Ailia — Portfolio Website

## Project Overview
A dark, aesthetic product design portfolio built with Next.js 15, Tailwind CSS, and Framer Motion. Features an interactive carousel of case studies on the home page with smooth spring animations, animated abstract background blobs, and scroll-triggered case study pages.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript, `src/` directory)
- **Styling**: Tailwind CSS 3.4 with custom theme tokens
- **Animation**: Framer Motion 11 (carousel springs, page transitions, scroll reveals)
- **Deployment**: Vercel (static export via `output: "export"`)

## Getting Started
```bash
npm install
npm run dev
```

## Project Structure
```
src/
├── app/
│   ├── globals.css          # Google Fonts, CSS variables, scrollbar
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page (hero + carousel)
│   └── work/[slug]/page.tsx # Dynamic case study pages
├── components/
│   ├── AnimatedBackground.tsx  # Three drifting gradient blobs
│   ├── Carousel.tsx            # Interactive project carousel
│   └── Navigation.tsx          # Shared nav (logo, Work, About, Contact)
└── data/
    └── projects.ts           # Case study content & types
```

## Design Tokens
- **Background**: `#080808`
- **Fonts**: Playfair Display (headings), DM Sans (body)
- **Card surface**: `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.06)`
- **Text**: white at varying opacities (0.9, 0.55, 0.45, 0.35, 0.25)

## Key Implementation Details
- Carousel uses absolute-positioned cards with spring animations (stiffness: 260, damping: 30)
- Active card scales to 1.06, inactive to 0.86, with opacity falloff by distance
- Background blobs use CSS keyframe animations (`drift-1`, `drift-2`, `drift-3`)
- Case study pages use `whileInView` for scroll-triggered section reveals
- Static export requires `generateStaticParams()` in the `[slug]` route

## TODO
- [ ] Replace placeholder images with real project screenshots
- [ ] Update project data in `src/data/projects.ts` with real case studies
- [ ] Build the `/about` page
- [ ] Replace `parham@example.com` in Navigation.tsx with real email
- [ ] Replace `[YOUR COMPANY]` placeholders in project data
- [ ] Add Open Graph / social meta tags
- [ ] Deploy to Vercel
- [ ] Sign up for a free Formspree account and replace `FORM_ENDPOINT` in `StickyNoteFeedback.tsx` with your real form endpoint (sticky notes won't be emailed until this is set)
