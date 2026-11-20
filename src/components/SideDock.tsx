"use client";

import Link from "next/link";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { useLetterModal } from "@/context/LetterModalContext";

const items = [
  { id: "linkedin", icon: FaLinkedin, label: "LinkedIn", href: "#", cursor: "This is my LinkedIn" },
  { id: "github", icon: FaGithub, label: "GitHub", href: "#", cursor: "This is my GitHub" },
];

export default function SideDock() {
  const { openLetter } = useLetterModal();

  return (
    // Desktop-only — on mobile these same icons move into the top nav bar
    // instead (Navigation.tsx), since a vertical side dock doesn't fit a
    // narrow viewport well. The icons share one translucent pill-shaped
    // container instead of each having its own circular background.
    <div className="hidden md:flex fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-[9999] flex-col items-center gap-1 p-2 rounded-full bg-fg/[0.04] border border-fg/10 backdrop-blur-xl">
      <Link
        href="/pamiot"
        aria-label="Pamiot — ask about Parham"
        data-cursor="Pamiot — ask about me"
        className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center transition-colors hover:bg-[#FACC15]/10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pamiot/head-icon.png"
          alt=""
          className="w-[85%] h-[85%] object-contain"
        />
      </Link>

      <div className="h-px w-5 bg-fg/10 my-1" />

      <button
        type="button"
        data-cursor="Message me"
        onClick={openLetter}
        aria-label="Message me"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-fg/50 hover:text-fg hover:bg-fg/10"
      >
        <FaEnvelope size={15} />
      </button>

      {items.map(({ id, icon: Icon, label, href, cursor }) => (
        <Link
          key={id}
          href={href}
          aria-label={label}
          data-cursor={cursor}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-fg/50 hover:text-fg hover:bg-fg/10"
        >
          <Icon size={15} />
        </Link>
      ))}
    </div>
  );
}
