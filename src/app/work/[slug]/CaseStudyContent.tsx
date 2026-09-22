"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import type { Project } from "@/data/projects";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function CaseStudyContent({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project;
}) {
  return (
    <main className="relative min-h-screen bg-[#080808]">
      <AnimatedBackground />
      <Navigation showBack />

      {/* Hero */}
      <motion.section
        id="page-heading"
        className="relative z-10 px-8 md:px-40 pt-20 pb-16 max-w-[1120px] mx-auto"
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] text-white/30 tracking-[1.5px] uppercase">
            Case Study
          </span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="text-[11px] text-white/30 tracking-[1.5px] uppercase">
            {project.date}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-[56px] font-bold tracking-tight text-white leading-tight">
          {project.title}
        </h1>

        <p className="mt-5 text-[17px] font-light text-white/45 leading-relaxed max-w-[640px]">
          {project.description}
        </p>

        {/* Meta tags */}
        <div className="flex gap-3 mt-8 flex-wrap">
          {[project.role, project.company, project.duration].map((tag) => (
            <span
              key={tag}
              className="px-5 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-xs text-white/45 tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Hero visual placeholder */}
      <motion.div
        className="relative z-10 mx-8 md:mx-20 h-[320px] md:h-[480px] bg-white/[0.025] rounded-3xl border border-white/[0.04] flex items-center justify-center"
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-2.5">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[11px] text-white/10 tracking-[2px] uppercase">
            Hero Image or Product Screenshot
          </span>
        </div>
      </motion.div>

      {/* The Challenge */}
      <motion.section
        className="relative z-10 px-8 md:px-40 py-20 max-w-[1120px] mx-auto"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="md:flex gap-20">
          <div className="flex-shrink-0 w-[200px] mb-6 md:mb-0">
            <div className="text-[11px] text-white/25 tracking-[2px] uppercase mb-2">
              01
            </div>
            <h2 className="font-display text-[28px] font-semibold text-white/90">
              The Challenge
            </h2>
          </div>
          <div className="flex-grow">
            <p className="text-base font-light text-white/50 leading-[1.8]">
              {project.challenge}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Process */}
      <motion.section
        className="relative z-10 px-8 md:px-40 pb-20 max-w-[1120px] mx-auto"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="md:flex gap-20">
          <div className="flex-shrink-0 w-[200px] mb-6 md:mb-0">
            <div className="text-[11px] text-white/25 tracking-[2px] uppercase mb-2">
              02
            </div>
            <h2 className="font-display text-[28px] font-semibold text-white/90">
              Process
            </h2>
          </div>
          <div className="flex-grow">
            <p className="text-base font-light text-white/50 leading-[1.8] mb-7">
              {project.process.overview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(
                [
                  ["Research", project.process.research],
                  ["Design", project.process.design],
                  ["Validate", project.process.validate],
                ] as const
              ).map(([label, text]) => (
                <div
                  key={label}
                  className="p-6 bg-white/[0.025] border border-white/[0.04] rounded-2xl"
                >
                  <div className="text-[11px] text-white/25 tracking-[1px] uppercase mb-2">
                    {label}
                  </div>
                  <div className="text-sm text-white/55 leading-relaxed">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Before / After placeholders */}
      <motion.div
        className="relative z-10 mx-8 md:mx-20 grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="h-[280px] md:h-[360px] bg-white/[0.025] rounded-[20px] border border-white/[0.04] flex items-center justify-center">
          <span className="text-[10px] text-white/10 tracking-[2px] uppercase">
            Before / Wireframe
          </span>
        </div>
        <div className="h-[280px] md:h-[360px] bg-white/[0.025] rounded-[20px] border border-white/[0.04] flex items-center justify-center">
          <span className="text-[10px] text-white/10 tracking-[2px] uppercase">
            After / Final Design
          </span>
        </div>
      </motion.div>

      {/* Solution */}
      <motion.section
        className="relative z-10 px-8 md:px-40 py-20 max-w-[1120px] mx-auto"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="md:flex gap-20">
          <div className="flex-shrink-0 w-[200px] mb-6 md:mb-0">
            <div className="text-[11px] text-white/25 tracking-[2px] uppercase mb-2">
              03
            </div>
            <h2 className="font-display text-[28px] font-semibold text-white/90">
              Solution
            </h2>
          </div>
          <div className="flex-grow">
            <p className="text-base font-light text-white/50 leading-[1.8]">
              {project.solution}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Solution visual placeholder */}
      <motion.div
        className="relative z-10 mx-8 md:mx-20 h-[300px] md:h-[400px] bg-white/[0.025] rounded-3xl border border-white/[0.04] flex items-center justify-center"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="text-[10px] text-white/10 tracking-[2px] uppercase">
          Solution Screenshot or Prototype
        </span>
      </motion.div>

      {/* Results */}
      <motion.section
        className="relative z-10 px-8 md:px-40 py-20 max-w-[1120px] mx-auto"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="md:flex gap-20">
          <div className="flex-shrink-0 w-[200px] mb-6 md:mb-0">
            <div className="text-[11px] text-white/25 tracking-[2px] uppercase mb-2">
              04
            </div>
            <h2 className="font-display text-[28px] font-semibold text-white/90">
              Results
            </h2>
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="p-7 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-center"
                >
                  <div className="font-display text-4xl font-bold text-white mb-1.5">
                    {r.value}
                  </div>
                  <div className="text-xs text-white/35 tracking-[1px] uppercase">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="relative z-10 mx-8 md:mx-40 h-px bg-white/[0.06]" />

      {/* Next project CTA */}
      <motion.section
        className="relative z-10 py-16 text-center"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-xs text-white/25 tracking-[2px] uppercase mb-3">
          Next Project
        </div>
        <Link
          href={`/work/${nextProject.slug}`}
          className="inline-flex items-center gap-3 font-display text-2xl md:text-[32px] font-semibold text-white/80 hover:text-white transition-colors"
        >
          {nextProject.title}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.section>
    </main>
  );
}
