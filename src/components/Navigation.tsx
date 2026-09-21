"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

interface NavigationProps {
  showBack?: boolean;
}

export default function Navigation({ showBack = false }: NavigationProps) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";

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
        className="flex items-center gap-3"
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
            className="text-white/90"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        )}
        <Logo size={46} dark />
      </Link>

      <div className="flex items-center gap-8 md:gap-11">
        <Link
          href="/about"
          className={`text-sm font-normal tracking-wide transition-colors ${
            isAbout ? "text-white/90" : "text-white/55 hover:text-white/90"
          }`}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`text-[13px] font-normal tracking-wide px-7 py-2.5 rounded-full transition-all ${
            isContact
              ? "bg-white/[0.08] border border-white/[0.18] text-white/95"
              : "border border-white/15 text-white/80 hover:border-white/30 hover:text-white"
          }`}
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
}
