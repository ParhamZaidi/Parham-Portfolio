"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PiSunFill, PiMoonFill } from "react-icons/pi";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDay = theme === "day";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
      data-cursor={isDay ? "Go dark" : "Go light"}
      className="relative w-9 h-9 rounded-full border flex items-center justify-center transition-colors bg-fg/[0.04] border-fg/10 hover:border-fg/20 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDay ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <PiSunFill size={15} color="#FACC15" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <PiMoonFill size={14} color="rgb(var(--fg) / 0.7)" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
