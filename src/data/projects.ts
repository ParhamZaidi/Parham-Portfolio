export interface Project {
  slug: string;
  date: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  role: string;
  company: string;
  duration: string;
  challenge: string;
  process: {
    overview: string;
    research: string;
    design: string;
    validate: string;
  };
  solution: string;
  results: {
    value: string;
    label: string;
  }[];
  tools: string[];
}

export const projects: Project[] = [
  {
    slug: "app-store-ranking",
    date: "Oct '25",
    title: "App Store Ranking Surge",
    metric: "+340%",
    metricLabel: "organic installs",
    description:
      "Redesigned the app listing experience to dramatically improve discoverability and conversion in the Japan App Store.",
    role: "Lead Product Designer",
    company: "[YOUR COMPANY]",
    duration: "3 months",
    challenge:
      "The app had been losing visibility in the Japan App Store for over two years. Organic installs were declining quarter over quarter, and the listing page had a high bounce rate compared to competitors. We needed to reverse the trend without increasing the marketing budget.",
    process: {
      overview:
        "Started with a competitive audit of the top 20 apps in our category across the Japan App Store, analyzing their visual language, screenshot strategies, and metadata patterns.",
      research: "Competitive audit of 20 top-ranked apps, user interviews with 12 Japanese users on app discovery habits",
      design: "Redesigned screenshots, app icon, and listing copy with culturally relevant visual language",
      validate: "A/B tested 3 screenshot variants over 4 weeks with 50K impressions each",
    },
    solution:
      "Created a new visual system for the app listing that prioritized the product's core value proposition in the first two screenshots. Redesigned the app icon to stand out in dense category grids, and rewrote all metadata with localized keywords identified through search trend analysis.",
    results: [
      { value: "+340%", label: "Organic Installs" },
      { value: "#4", label: "Category Rank" },
      { value: "-62%", label: "Bounce Rate" },
    ],
    tools: ["figma", "sketch", "marvelapp"],
  },
  {
    slug: "link-viewer",
    date: "Nov '25",
    title: "The New Link Viewer",
    metric: "13.9K",
    metricLabel: "impressions",
    description:
      "Redesigned how users preview and interact with shared links, turning a utilitarian feature into an engaging content experience.",
    role: "Product Designer",
    company: "[YOUR COMPANY]",
    duration: "6 weeks",
    challenge:
      "The existing link preview was a basic card with a title and thumbnail. Users were ignoring shared links entirely — click-through rates were below 2%. The feature needed to feel native and compelling without slowing down the feed.",
    process: {
      overview:
        "Mapped the full link-sharing journey from sender to receiver, identifying three key drop-off points.",
      research: "Heatmap analysis, 8 user interviews, benchmark study of link previews across 15 platforms",
      design: "Progressive disclosure pattern with rich media extraction and contextual actions",
      validate: "Staged rollout to 10% of users, monitored engagement and load performance",
    },
    solution:
      "Built a rich link viewer that extracts and displays article content inline with smart truncation, preserving images, key quotes, and author context. Added contextual actions — save, highlight, share-with-comment — that appear naturally within the reading flow.",
    results: [
      { value: "13.9K", label: "Impressions" },
      { value: "+8.4x", label: "Click-through Rate" },
      { value: "45s", label: "Avg. Time Spent" },
    ],
    tools: ["figma", "framer", "lottiefiles"],
  },
  {
    slug: "country-of-origin",
    date: "Jan '26",
    title: "Country-of-Origin Feature",
    metric: "27K+",
    metricLabel: "reach",
    description:
      "Designed an authenticity verification system that surfaces product origin data to build user trust.",
    role: "Product Designer",
    company: "[YOUR COMPANY]",
    duration: "2 months",
    challenge:
      "Users reported trust issues when evaluating products on the platform. There was no easy way to verify where a product was made, and counterfeit concerns were driving users to competitors. We needed a transparent, non-intrusive way to surface origin information.",
    process: {
      overview:
        "Conducted a trust audit across the purchase funnel, mapping every moment where users hesitated or abandoned.",
      research: "Trust survey (n=400), 6 moderated usability sessions, competitive trust-signal audit",
      design: "Badge system with progressive disclosure — surface-level trust at a glance, full provenance on tap",
      validate: "Prototype testing with 15 users, measuring trust scores before/after exposure",
    },
    solution:
      "Created a layered trust system: a subtle origin badge on product cards that expands into a full provenance detail sheet — showing manufacturing country, certifications, and supply chain transparency scores. The design avoids visual noise while making verification effortless.",
    results: [
      { value: "27K+", label: "Reach" },
      { value: "+31%", label: "Trust Score" },
      { value: "-18%", label: "Return Rate" },
    ],
    tools: ["figma", "sketch", "notion"],
  },
  {
    slug: "onboarding-redesign",
    date: "Mar '26",
    title: "Onboarding Redesign",
    metric: "+42%",
    metricLabel: "completion rate",
    description:
      "Rebuilt the first-time user experience from scratch, turning a 7-step form into a conversational flow.",
    role: "Senior Product Designer",
    company: "[YOUR COMPANY]",
    duration: "4 months",
    challenge:
      "Only 34% of new signups completed onboarding. The existing flow was a rigid 7-step form that felt like paperwork. Users who dropped off during onboarding had near-zero retention at day 7, making this the single highest-leverage problem to solve.",
    process: {
      overview:
        "Analyzed drop-off data per step, ran exit surveys for users who abandoned, and mapped the minimum viable information needed to deliver value.",
      research: "Funnel analysis, exit surveys (n=200), competitive onboarding teardown of 10 apps",
      design: "Conversational progressive profiling — ask only what's needed, when it's needed",
      validate: "3-week A/B test against the existing flow, n=5,000 per variant",
    },
    solution:
      "Replaced the monolithic form with a conversational flow that collects only essential information upfront (name, one preference) and defers the rest to contextual moments during the first session. Added personality with micro-animations and a progress indicator that celebrates completion.",
    results: [
      { value: "+42%", label: "Completion Rate" },
      { value: "+28%", label: "Day-7 Retention" },
      { value: "48s", label: "Time to Value" },
    ],
    tools: ["figma", "framer", "notion"],
  },
  {
    slug: "dashboard-analytics",
    date: "Jun '26",
    title: "Dashboard Analytics",
    metric: "4.8★",
    metricLabel: "App Store",
    description:
      "Designed a real-time analytics dashboard that makes complex data accessible to non-technical users.",
    role: "Product Designer",
    company: "[YOUR COMPANY]",
    duration: "3 months",
    challenge:
      "Business users were exporting data to spreadsheets because the existing dashboard was too technical and slow. The app's analytics section had the lowest satisfaction score (2.1/5) of any feature. Users needed insights, not raw data.",
    process: {
      overview:
        "Shadowed 8 power users for a full work day each, documenting their actual data workflows and the workarounds they'd built.",
      research: "8 contextual inquiries, card sort with 20 users to reorganize metrics, satisfaction survey",
      design: "Insight-first dashboard with smart defaults, natural language summaries, and drill-down on demand",
      validate: "4-week beta with 50 power users, weekly feedback sessions",
    },
    solution:
      "Designed an insight-first dashboard that opens with a natural-language summary of what changed since the user's last visit. Key metrics are presented as trend cards with contextual benchmarks, and detailed charts are one tap away. Added a customizable layout so users can build their own view.",
    results: [
      { value: "4.8★", label: "App Store Rating" },
      { value: "-73%", label: "Export to Spreadsheet" },
      { value: "3.2x", label: "Daily Active Usage" },
    ],
    tools: ["figma", "sketch", "airtable"],
  },
  {
    slug: "payment-flow",
    date: "Aug '26",
    title: "Payment Flow Optimization",
    metric: "-35%",
    metricLabel: "drop-off",
    description:
      "Streamlined the checkout experience to reduce friction and recover abandoned transactions.",
    role: "Product Designer",
    company: "[YOUR COMPANY]",
    duration: "6 weeks",
    challenge:
      "The checkout flow had a 68% abandonment rate — well above the industry average of 48%. Session recordings showed users hesitating at the payment step, going back to verify totals, and struggling with the address form on mobile. Each percentage point of recovery was worth significant revenue.",
    process: {
      overview:
        "Mapped every interaction in the checkout funnel with session recordings (2,000 sessions) and identified the three highest-friction moments.",
      research: "Session recording analysis (2K sessions), checkout funnel heatmaps, 10 user walkthroughs",
      design: "Single-page checkout with inline validation, persistent order summary, and one-tap payment",
      validate: "Phased rollout: 5% → 25% → 100%, monitoring conversion at each stage",
    },
    solution:
      "Consolidated the 4-page checkout into a single scrolling page with a persistent order summary sidebar. Added inline validation with helpful error messages, smart address autocomplete, and express payment options (Apple Pay, Google Pay) as the default for returning users.",
    results: [
      { value: "-35%", label: "Drop-off Rate" },
      { value: "+22%", label: "Conversion" },
      { value: "-40%", label: "Support Tickets" },
    ],
    tools: ["figma", "framer", "miro"],
  },
];
