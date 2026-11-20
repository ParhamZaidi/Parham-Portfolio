"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import Logo from "@/components/Logo";
import TypewriterText from "@/components/TypewriterText";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useLetterModal } from "@/context/LetterModalContext";

interface NavigationProps {
  showBack?: boolean;
}

// Same dock icons as the desktop SideDock, shown inline in the top bar on
// mobile instead of a vertical side dock, which doesn't fit a narrow
// viewport well.
const mobileIcons = [
  { id: "linkedin", icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { id: "github", icon: FaGithub, label: "GitHub", href: "#" },
];

export default function Navigation({ showBack = false }: NavigationProps) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";
  const [logoHovered, setLogoHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { openLetter } = useLetterModal();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-between px-8 md:px-16 py-8"
    >
      {/* Desktop logo — hidden on mobile, a hamburger takes its place there */}
      <Link
        id="site-logo"
        href="/"
        aria-label="Parham Ailia — home"
        className="hidden md:flex relative items-center gap-3"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        {showBack && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg/90"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        )}
        <Logo size={46} dark={theme === "night"} hovered={logoHovered} />
        <TypewriterText
          text="PARHAM AILIA"
          active={logoHovered}
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap text-[15px] font-medium tracking-[1.5px] text-fg/90"
        />
      </Link>

      {/* Mobile left side: optional back link + hamburger menu, sharing
          one translucent pill container */}
      <div className="flex md:hidden items-center gap-1 p-1 rounded-full bg-fg/[0.04] border border-fg/10 backdrop-blur-xl">
        {showBack && (
          <Link
            href="/"
            aria-label="Back to home"
            className="w-8 h-8 rounded-full flex items-center justify-center text-fg/70 transition-colors hover:bg-fg/10"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="w-8 h-8 rounded-full flex items-center justify-center text-fg/70 transition-colors hover:bg-fg/10"
        >
          {menuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-8 top-full mt-2 z-30 flex flex-col gap-1 p-2 rounded-2xl bg-elevated border border-fg/10 shadow-lg min-w-[140px]"
              >
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    isAbout ? "text-fg bg-fg/[0.06]" : "text-fg/70 hover:bg-fg/[0.05]"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    isContact ? "text-fg bg-fg/[0.06]" : "text-fg/70 hover:bg-fg/[0.05]"
                  }`}
                >
                  Contact
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-8 md:gap-11">
        <Link
          href="/about"
          className={`text-sm font-normal tracking-wide transition-colors ${
            isAbout ? "text-fg/90" : "text-fg/55 hover:text-fg/90"
          }`}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`text-[13px] font-normal tracking-wide px-7 py-2.5 rounded-full transition-all ${
            isContact
              ? "bg-fg/[0.08] border border-fg/[0.18] text-fg/95"
              : "border border-fg/15 text-fg/80 hover:border-fg/30 hover:text-fg"
          }`}
        >
          Contact
        </Link>
        <ThemeToggle />
      </div>

      {/* Mobile right side: dock icons + theme toggle, sharing one
          translucent pill container instead of each having its own */}
      <div className="flex md:hidden items-center gap-1 p-1 rounded-full bg-fg/[0.04] border border-fg/10 backdrop-blur-xl">
        <Link
          href="/pamiot"
          aria-label="Pamiot — ask about Parham"
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-colors hover:bg-[#FACC15]/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pamiot/head-icon.png" alt="" className="w-[85%] h-[85%] object-contain" />
        </Link>
        <button
          type="button"
          onClick={openLetter}
          aria-label="Message me"
          className="w-8 h-8 rounded-full flex items-center justify-center text-fg/60 transition-colors hover:bg-fg/10"
        >
          <FaEnvelope size={12} />
        </button>
        {mobileIcons.map(({ id, icon: Icon, label, href }) => (
          <Link
            key={id}
            href={href}
            aria-label={label}
            className="w-8 h-8 rounded-full flex items-center justify-center text-fg/60 transition-colors hover:bg-fg/10"
          >
            <Icon size={12} />
          </Link>
        ))}
        <ThemeToggle bare />
      </div>
    </motion.nav>
  );
}
