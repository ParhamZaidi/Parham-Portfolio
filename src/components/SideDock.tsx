"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLinkedin, FaGithub, FaArrowUp } from "react-icons/fa";
import LetterModal from "@/components/LetterModal";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const items = [
  { id: "linkedin", icon: FaLinkedin, label: "LinkedIn", href: "#", cursor: "This is my LinkedIn" },
  { id: "github", icon: FaGithub, label: "GitHub", href: "#", cursor: "This is my GitHub" },
];

export default function SideDock() {
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    // Anchored a fixed distance below the nav (top-28) instead of
    // vertically centered (top-1/2) — centering could push this dock up
    // into the nav bar on shorter viewports, where its higher z-index
    // made it win clicks meant for the logo/back link (confirmed: it was
    // silently sending "go home" clicks to /pamiot instead). A fixed top
    // offset below the nav's own height can't overlap it regardless of
    // viewport height.
    <div className="fixed left-4 md:left-6 top-28 z-[9999] flex flex-col gap-3">
      <Link
        href="/pamiot"
        aria-label="Pamiot — ask about Parham"
        data-cursor="Pamiot — ask about me"
        className="w-11 h-11 rounded-full border overflow-hidden flex items-center justify-center backdrop-blur-xl transition-all bg-[#FACC15]/10 border-[#FACC15]/40 hover:bg-[#FACC15]/20 hover:border-[#FACC15]/60"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pamiot/head-icon.png"
          alt=""
          className="w-[85%] h-[85%] object-contain"
        />
      </Link>

      <div className="h-px bg-fg/10 mx-1" />

      <button
        type="button"
        data-cursor="Message me"
        onClick={() => setLetterOpen(true)}
        aria-label="Message me"
        className="w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all bg-fg/[0.03] border-fg/10 text-fg/50 hover:text-fg hover:border-fg/20"
      >
        <FaEnvelope size={16} />
      </button>

      {items.map(({ id, icon: Icon, label, href, cursor }) => (
        <Link
          key={id}
          href={href}
          aria-label={label}
          data-cursor={cursor}
          className="w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all bg-fg/[0.03] border-fg/10 text-fg/50 hover:text-fg hover:border-fg/20"
        >
          <Icon size={16} />
        </Link>
      ))}
      <div className="h-px bg-fg/10 mx-1" />
      <button
        type="button"
        data-cursor="Back to top"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all bg-fg/[0.03] border-fg/10 text-fg/50 hover:text-fg hover:border-fg/20"
      >
        <FaArrowUp size={14} />
      </button>

      <LetterModal open={letterOpen} onClose={() => setLetterOpen(false)} />
    </div>
  );
}
