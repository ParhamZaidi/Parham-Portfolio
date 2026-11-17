export interface PamiotTopic {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
}

export const pamiotTopics: PamiotTopic[] = [
  {
    id: "about",
    label: "About Parham",
    keywords: ["about", "who", "parham", "yourself", "designer", "he"],
    answer:
      "Picture someone who gets genuinely annoyed by a loading spinner that runs half a second too long — that's Parham. He spends most of his time in fintech and consumer products, where he likes being in the room for the messy part, before anything on screen looks clean.",
  },
  {
    id: "skills",
    label: "Skills & tools",
    keywords: ["skill", "tool", "software", "stack", "figma", "use", "design with"],
    answer:
      "Figma is where most of his day actually happens, and Framer takes over whenever something needs to move convincingly before engineers get their hands on it. Notion keeps his research from scattering, Miro holds the messy whiteboard thinking, and LottieFiles steps in whenever motion has to do the selling.",
  },
  {
    id: "projects",
    label: "His projects",
    keywords: ["project", "work", "case study", "portfolio", "banking", "shipped", "built"],
    answer:
      "There's a banking app he built completely from a blank canvas — onboarding, dashboard, transfers, the full thing. Past that: an App Store push that landed 340 percent more installs, an onboarding rework that bumped completion by 42 percent, and a payment flow redesign that trimmed drop-off by over a third. Head back to the homepage to scroll through all of it.",
  },
  {
    id: "contact",
    label: "Get in touch",
    keywords: ["contact", "reach", "email", "hire", "linkedin", "talk"],
    answer:
      "The Contact page or the envelope icon in the dock — either one lands directly with him, no gatekeeping in between. I just point the way; the actual replying is his job, not mine.",
  },
  {
    id: "fun",
    label: "Something fun",
    keywords: ["fun", "joke", "funny", "hobby", "random", "monkey"],
    answer:
      "Between us, I might be the closest thing to a mascot he's ever had. He didn't want a boring chat widget sitting in the corner, so he built me instead — half monkey, half machine, fully opinionated about him.",
  },
];

export const pamiotFallback =
  "That one's outside what I've got on file — try asking about his work, his skills, or how to reach him instead.";

export function matchPamiotTopic(input: string): PamiotTopic | null {
  const q = input.toLowerCase();
  for (const topic of pamiotTopics) {
    if (topic.keywords.some((k) => q.includes(k))) return topic;
  }
  return null;
}
