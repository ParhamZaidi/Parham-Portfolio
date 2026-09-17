"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Carousel from "@/components/Carousel";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <AnimatedBackground />

      {/* Watermark initials */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] pointer-events-none z-0 select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[clamp(200px,30vw,480px)] font-black text-white/[0.018] leading-none tracking-[-20px]">
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
        <p className="text-[13px] font-light tracking-[3px] text-white/35 uppercase mb-3.5">
          Hello, it&apos;s me
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-white">
          Parham Ailia
        </h1>
        <p className="text-[15px] font-light text-white/35 mt-2.5 tracking-[2px]">
          Product Designer
        </p>
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
