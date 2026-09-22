"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";

const socials = ["LinkedIn", "X", "Dribbble", "GitHub"];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] flex flex-col">
      <AnimatedBackground />

      <Navigation />

      <motion.div
        id="page-heading"
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-[720px] mx-auto px-8 pb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        <p className="text-[12px] tracking-[3px] text-white/30 uppercase mb-4">
          Contact
        </p>
        <h1 className="font-display text-4xl md:text-[52px] font-bold tracking-tight text-white leading-[1.15] mb-5">
          Let&apos;s build something great.
        </h1>
        <p className="text-base font-light text-white/50 leading-relaxed max-w-[460px] mb-12">
          Have a project in mind, or just want to say hi? My inbox is always
          open.
        </p>

        <a
          href="mailto:parham@example.com"
          className="group relative inline-block font-display text-[28px] md:text-[34px] font-semibold text-white/90 hover:text-white transition-colors mb-9"
        >
          parham@example.com
          <span className="absolute left-0 right-0 -bottom-1.5 h-px bg-current scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
        </a>

        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full mb-12">
          <span className="w-[7px] h-[7px] rounded-full bg-[#6366f1] animate-pulse" />
          <span className="text-[13px] text-white/55">
            [Available for new projects]
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {socials.map((label) => (
            <a
              key={label}
              href="#"
              className="px-[22px] py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-[13px] text-white/50 hover:border-white/[0.25] hover:text-white/95 hover:bg-white/[0.05] transition-all duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </motion.div>

      <footer className="relative z-10 text-center pb-10">
        <span className="text-xs text-white/20 tracking-wide">
          © 2026 Parham Ailia
        </span>
      </footer>
    </main>
  );
}
