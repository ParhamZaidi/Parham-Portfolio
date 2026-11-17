export interface SolutionFlow {
  title: string;
  body: string[];
  images: string[];
}

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
  /** Optional richer solution breakdown (multiple named flows, each with its own images). When present, this renders instead of the plain `solution` paragraph. */
  solutionFlows?: SolutionFlow[];
  /** Optional real hero screenshot (path under /public). Falls back to the placeholder box when omitted. */
  heroImage?: string;
  results: {
    value: string;
    label: string;
  }[];
  tools: string[];
}

export const projects: Project[] = [
  {
    slug: "banking-app-ground-up",
    date: "2026",
    title: "Mobile Banking App, Built From Zero",
    metric: "0 → 1",
    metricLabel: "banking app, from scratch",
    description:
      "Designed a mobile banking app from the ground up for a confidential banking client — onboarding through money transfers — under a tight, UI-first timeline.",
    role: "Lead Designer",
    company: "Confidential client",
    duration: "2 months",
    heroImage: "/work/banking-app-ground-up/dashboard-updated.png",
    challenge:
      "The client came to the team to design their mobile banking app essentially from zero — this wasn't a redesign of something that existed, it was the first version. The brief was UI-first and time-boxed: build a full banking app experience (onboarding, accounts, transfers, cards, limits, more) across a tight timeline, in a market already full of mobile banking apps with high baseline expectations. Given the constraint, the team made a deliberate call early on to lean on domain conventions, competitor patterns, and fast internal iteration rather than a long upfront discovery phase — a Lean UX approach, essentially by necessity as much as by choice.",
    process: {
      overview:
        "Framed honestly as Think / Make / Check (the Lean UX cycle): state an assumption, design against it, get it in front of stakeholders, and revise. Given the timeline, the \"Think\" phase was a heuristic audit and competitor-pattern review rather than formal user research — that tradeoff is part of the story, not hidden from it.",
      research:
        "Heuristic audit of the initial mocks against real banking-app conventions, informal stakeholder input, and competitive pattern review — not a formal user study, the timeline didn't allow for one.",
      design:
        "AI-assisted drafting and fast iteration across multiple visual directions (including a full Gen-Z tone exploration in parallel with the core direction), built out flow by flow.",
      validate:
        "Real stakeholder review rounds — visible in the version history as iterations (dashboard v1/v2/v3, a documented \"round 2\" change request) — rather than formal usability testing.",
    },
    solution:
      "The solution is broken into three core flows below — the ones far enough along to show. Each follows the same honest shape: what we assumed, where the original approach broke down or got stuck, and what shipped instead. (Beneficiary management, cards, limits, transactions, and a few other flows are still in progress and will be added here as they're finished.)",
    solutionFlows: [
      {
        title: "Onboarding & Login",
        images: [
          "/work/banking-app-ground-up/login-before-after.png",
          "/work/banking-app-ground-up/onboarding-register-login.png",
          "/work/banking-app-ground-up/onboarding-and-mpin.png",
          "/work/banking-app-ground-up/login-journey-genz-light.png",
          "/work/banking-app-ground-up/login-genz-light-error-state.png",
        ],
        body: [
          "The brief didn't start with “redesign the login screen.” It started with the bank wanting a single app where you could open an account from scratch *and* log into an existing one, without those two things feeling like different products. That's harder than it sounds — the first pass just bolted “Open Digital Account” onto the same screen as “Login” and called it done.",
          "It wasn't done. The login form had a field labeled “Mobile Number / Login ID” and another labeled “Password / Login PIN,” which is the kind of thing that looks fine until you imagine an actual person staring at it wondering which one applies to them. We didn't have the luxury of user interviews to catch this — we caught it by just reading our own form out loud and flinching.",
          "So, first fix: one field, one label, one plain-language helper line under it (“The number registered with your account”). Small, but it's the kind of small thing that either works or it doesn't.",
          "**Then came the part we actually got stuck on** — what happens when the password is wrong? The original flow had... nothing. No error state had been designed at all. For a banking app, “nothing happens, try again I guess” is a bad answer, so we had to go back and build one from scratch: an inline message (“Incorrect password. 2 of 5 attempts remaining”), a forgot-password link, and a phone number for anyone who's genuinely stuck, right there instead of buried in a help menu.",
          "The account-opening side went through its own round of back-and-forth. Early versions tried to cram CNIC capture, contact verification, and MPIN setup into fewer steps to “keep it short” — which just meant each step asked for too much at once. We split it into a proper step-by-step sequence (Step 1 of 2, Step 2 of 2) and, almost as an afterthought, added real-time validation on the MPIN so people couldn't set something like “1234” and find out it was weak later.",
          "**The one thing we got right early and didn't touch again:** the new-device security hold. Instead of just blocking transfers silently on a new phone, the screen says exactly what's limited (transfers, for 24 hours) and what still works (balances, statements). That line didn't come from a redesign — it came from someone on the team asking “wait, what does the user actually see if we lock them out and don't explain why?”",
        ],
      },
      {
        title: "Dashboard",
        images: [
          "/work/banking-app-ground-up/dashboard-before-after.png",
          "/work/banking-app-ground-up/dashboard-original-vs-v1-vs-v2.png",
          "/work/banking-app-ground-up/dashboard-v3-states.png",
          "/work/banking-app-ground-up/dashboard-v3-vs-original.png",
          "/work/banking-app-ground-up/dashboard-balance-states.png",
          "/work/banking-app-ground-up/dashboard-updated.png",
          "/work/banking-app-ground-up/dashboard-v3-vs-genz.png",
          "/work/banking-app-ground-up/genz-states.png",
          "/work/banking-app-ground-up/genz-dark-vs-light.png",
          "/work/banking-app-ground-up/genz-light-states.png",
          "/work/banking-app-ground-up/genz-light-refined-states.png",
          "/work/banking-app-ground-up/genz-light-refined-before-after.png",
        ],
        body: [
          "This is the screen that went through the most visible churn, and you can actually see the churn in the files — v1, v2, v3, then a whole separate branch asking whether the entire visual direction was wrong.",
          "**Where it started.** The first version treated the dashboard like a collection of cards that all happened to live on the same screen: a big green balance card, a separate IBAN card next to it, a separate yellow “Verified — Features Offered” badge, then a row of quick-action pills (Fund Transfer, Bank Transfer), then a promotional banner (“explore features — 3 new this week”) eating the most valuable real estate on the screen, then a 2x2 grid of more actions below that. One of those grid tiles was “Wallet Transfer” — which already existed as a pill button two sections up. Nobody meant to duplicate it; it just happened because each piece got designed as its own card instead of as one screen.",
          "**First fix, and it wasn't enough.** We pulled the balance and account identity into one card, added an eye icon to hide the balance, and replaced that vague “Verified — Features Offered” badge with something actually useful: a real-time “Transfer limits apply until 9:41 AM tomorrow” notice. We also swapped the promo banner for a real Recent Activity list — names, amounts, timestamps — because a dashboard that only shows your balance and nothing about what happened to your money isn't really a dashboard, it's a number. That became v2, and it was better. But the four management shortcuts (Beneficiaries, Cards, Accounts, Limits) were still sitting in their own separate grid below everything else, disconnected from the account details they were actually about.",
          "**Where we got stuck, honestly.** How do you show money in vs. money out without turning the dashboard into a chart? We tried a couple of directions before landing on the simplest one — two numbers (In / Out) with a thin proportional bar between them, sitting right under the balance. Not a graph, just enough visual weight to say “here's the shape of this month” at a glance. That's v3, and it's also where IBAN, account number, and the “verified account” status finally got merged into one card instead of requiring a tap to see them, and where the four management shortcuts moved into a single grid directly under that card instead of floating separately.",
          "**The detour.** At some point the question stopped being “is the layout right” and became “is the whole visual language right for this audience” — the client's teal-and-white felt safe, maybe too safe, for a market full of younger digital-first competitors. So a parallel track got built: an all-black, neon-green “Gen Z” direction, tested in both dark and light. It's a legitimate fork, not a finished decision — but one thing survived it regardless of which visual direction wins: when you hide the balance, the IBAN and account number mask too, not just the number. That detail started as a privacy feature and ended up proving itself useful enough to carry across every version after it appeared.",
          "**One more thing that came out of the Gen Z pass and is worth keeping no matter what:** the management tiles stopped being bare labels. “Beneficiaries” became “Beneficiaries — 8 saved payees.” “Cards” became “Cards — 1 active, 1 new.” Small change, but it means you know what's behind the tile before you tap it, instead of discovering it's empty or irrelevant.",
        ],
      },
      {
        title: "Fund Transfer / Send Money",
        images: [
          "/work/banking-app-ground-up/fund-transfer-journey.png",
          "/work/banking-app-ground-up/bank-transfer-iban-vs-account.png",
          "/work/banking-app-ground-up/bank-transfer-sample.png",
          "/work/banking-app-ground-up/fund-transfer-redesign.png",
          "/work/banking-app-ground-up/send-money-variation-1.png",
          "/work/banking-app-ground-up/send-money-variation-3.png",
          "/work/banking-app-ground-up/send-money-from-account-fix.png",
          "/work/banking-app-ground-up/fund-transfer-confirm-variants.png",
        ],
        body: [
          "The brief here sounds simple — let someone send money — until you realize the client needed to support four different ways money can leave an account: a transfer within the bank itself, an inter-bank transfer (IBFT), a mobile wallet top-up, and moving money between your own linked accounts. The easy, lazy answer is four separate menu items. We didn't do that, but it took a couple of wrong turns to get somewhere better.",
          "**The first wrong turn.** How do you ask “which account are you sending to” when some people know the recipient's IBAN and some only know a local account number? One version made people pick the beneficiary's bank from a dropdown *first*, then type the account number — except an IBAN already encodes which bank it belongs to, so for anyone who had the IBAN, we were asking them to do work the system could've done itself. A second version fixed that specific case (type the IBAN, skip the bank picker) but now there were two different screens depending on which piece of info you had, and nothing told you which one to use.",
          "**What we landed on instead:** one field. Type a mobile number, an IBAN, or an account number, and the screen figures out what it's looking at — if it's an IBAN, the bank gets detected and shown back to you as a confirmation chip instead of a dropdown you have to operate. If it's a wallet number, it asks which wallet provider. One input, the system does the classification instead of asking the user to pre-sort themselves into a category. The four transfer types (Fund / IBFT / Wallet / Own) became tabs on the same screen instead of four separate flows, each tab just filtering which saved contacts show up underneath.",
          "**Trust got built in at every checkpoint, not just at the end.** A verified badge sits next to a recipient's name once the account is confirmed. Before anything gets sent, the review screen says plainly “we'll confirm the name before anything is sent” and, one screen later, “check the name and account number — once approved, this transfer cannot be reversed.” The daily transfer limit isn't just a number buried in settings; it shows up as a progress bar at both the review and confirm steps, so the constraint is visible before someone hits a wall, not after. Authorization is MPIN or Face ID. And the receipt afterward isn't just a “success” checkmark — it shows a reference ID, the new account balance, and options to share or save the receipt as a PDF, so there's something to point to if a dispute ever comes up.",
          "**One small thing we iterated on that's easy to miss:** saving a beneficiary after a transfer went through three states before we were happy with it — an offer to save, an inline field to name them, and a confirmed “Saved as [nickname]” state — because the first version just dropped a save button on the confirm screen with no feedback that it had actually worked.",
        ],
      },
    ],
    results: [
      { value: "0 → 1", label: "New app, built from scratch" },
      { value: "3", label: "Core flows designed" },
      { value: "v1 → v3", label: "Dashboard, iterated live" },
    ],
    tools: ["figma"],
  },
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
