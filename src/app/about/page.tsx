"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { tools } from "@/data/tools";

const principles = [
  {
    title: "Clarity over cleverness",
    body: "If a user needs a tooltip to understand it, the design isn't done yet.",
  },
  {
    title: "Systems, not screens",
    body: "Every screen I ship is a byproduct of a system built to outlast it.",
  },
  {
    title: "Ship, then learn",
    body: "Confidence comes from real usage, not one more round of polish.",
  },
];

const experience = [
  { role: "Senior Product Designer", dates: "2023 — Present" },
  { role: "Product Designer", dates: "2021 — 2023" },
  { role: "Junior Designer", dates: "2019 — 2021" },
];

const toolKeys = ["figma", "framer", "sketch", "notion", "miro"];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <AnimatedBackground />

      {/* Watermark */}
      <div
        className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[clamp(180px,28vw,380px)] font-black text-white/[0.018] leading-none tracking-[-18px]">
          PA
        </span>
      </div>

      <Navigation />

      <div className="relative z-10 max-w-[1120px] mx-auto px-8 md:px-16 pb-32">
        {/* Hero */}
        <motion.section
          id="page-heading"
          className="flex flex-col md:flex-row gap-14 md:gap-16 items-center pt-8 md:pt-12 pb-20 md:pb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex-1 min-w-[280px]">
            <p className="text-[12px] tracking-[3px] text-white/30 uppercase mb-4">
              About
            </p>
            <h1 className="font-display text-4xl md:text-[56px] font-bold tracking-tight text-white leading-[1.1] mb-6">
              Hi, I&apos;m Parham Ailia.
            </h1>
            <p className="text-[17px] font-light text-white/55 leading-[1.75] max-w-[480px]">
              A product designer who spends most of the day thinking about
              the three seconds after someone opens an app for the first
              time. I care about the parts most people skip — empty states,
              error messages, loading spinners — because that&apos;s where
              trust actually gets built.
            </p>
          </div>
          <div className="flex-shrink-0 w-[280px] md:w-[320px] h-[340px] md:h-[380px] bg-white/[0.025] border border-white/[0.05] rounded-3xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-2.5">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
              <span className="text-[10px] tracking-[2px] text-white/10 uppercase">
                Portrait Photo
              </span>
            </div>
          </div>
        </motion.section>

        {/* Principles */}
        <motion.section
          className="pb-20 md:pb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[11px] tracking-[2px] text-white/25 uppercase mb-6">
            How I work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {principles.map(({ title, body }) => (
              <div
                key={title}
                className="p-7 bg-white/[0.025] border border-white/[0.04] rounded-2xl hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="font-display text-xl font-semibold text-white/90 mb-2.5">
                  {title}
                </div>
                <div className="text-sm text-white/50 leading-relaxed">
                  {body}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          className="pb-20 md:pb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[11px] tracking-[2px] text-white/25 uppercase mb-6">
            Experience
          </p>
          <div className="flex flex-col">
            {experience.map(({ role, dates }, i) => (
              <div
                key={role}
                className={`flex items-baseline justify-between gap-6 py-5 ${
                  i < experience.length - 1
                    ? "border-b border-white/[0.06]"
                    : ""
                }`}
              >
                <div>
                  <div className="font-display text-lg text-white/90 mb-1">
                    {role}
                  </div>
                  <div className="text-[13px] text-white/40">
                    [YOUR COMPANY]
                  </div>
                </div>
                <div className="text-xs text-white/30 tracking-wide whitespace-nowrap">
                  {dates}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tools */}
        <motion.section
          className="pb-20 md:pb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[11px] tracking-[2px] text-white/25 uppercase mb-6">
            Tools I use
          </p>
          <div className="flex flex-wrap gap-3">
            {toolKeys.map((key) => {
              const tool = tools[key];
              if (!tool) return null;
              const Icon = tool.icon;
              return (
                <span
                  key={key}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-[13px] text-white/55 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-200"
                >
                  <Icon size={14} color="rgba(255,255,255,0.55)" />
                  {tool.label}
                </span>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="pt-16 border-t border-white/[0.06] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[11px] tracking-[2px] text-white/25 uppercase mb-3.5">
            Get in touch
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 font-display text-2xl md:text-[32px] font-semibold text-white/80 hover:text-white transition-colors"
          >
            Let&apos;s build something great
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1.5 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
