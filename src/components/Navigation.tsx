"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import TypewriterText from "@/components/TypewriterText";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

interface NavigationProps {
  showBack?: boolean;
}

export default function Navigation({ showBack = false }: NavigationProps) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";
  const [logoHovered, setLogoHovered] = useState(false);
  const { theme } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-between px-8 md:px-16 py-8"
    >
      <Link
        id="site-logo"
        href="/"
        aria-label="Parham Ailia — home"
        className="relative flex items-center gap-3"
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

      <div className="flex items-center gap-8 md:gap-11">
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
    </motion.nav>
  );
}
