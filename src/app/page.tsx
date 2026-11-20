"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Carousel from "@/components/Carousel";
import NameStarBurst from "@/components/NameStarBurst";
import ToolsMarquee from "@/components/ToolsMarquee";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg transition-colors duration-500">
      <AnimatedBackground />

      {/* Watermark initials */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] pointer-events-none z-0 select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[clamp(200px,30vw,480px)] font-black text-fg/[0.018] leading-none tracking-[-20px]">
          PA
        </span>
      </div>

      <Navigation />

      {/* Hero */}
      <motion.section
        className="relative z-10 text-center pt-10 md:pt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <p className="text-[13px] font-light tracking-[3px] text-fg/35 uppercase mb-3.5">
          Hello, it&apos;s me
        </p>
        <h1
          id="page-heading"
          data-cursor="This is me"
          className="relative inline-block font-display text-5xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-fg"
        >
          Parham Ailia
          {/* Positioned off the text itself rather than inline with it, so
              the star/photo never shift where the name visually centers —
              it used to pull "Parham Ailia" noticeably left, worse on
              mobile where there's less room either side. */}
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 md:ml-4">
            <NameStarBurst />
          </span>
        </h1>
        <p className="text-[15px] font-light text-fg/35 mt-2.5 tracking-[2px]">
          Product Designer
        </p>
        <p className="text-[15px] md:text-base font-light text-fg/45 leading-relaxed max-w-[480px] mx-auto mt-5">
          I design products that make complicated things feel simple — from
          early 0-to-1 flows to the small details that make an interface
          feel considered. Currently focused on fintech and consumer apps.
        </p>
        <ToolsMarquee />
      </motion.section>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <Carousel />
      </motion.div>
    </main>
  );
}
