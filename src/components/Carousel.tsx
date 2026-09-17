"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { projects } from "@/data/projects";
import { tools } from "@/data/tools";

const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 500;
const LIKED_STORAGE_KEY = "liked-projects";

export default function Carousel() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(2);
  const [likedSlugs, setLikedSlugs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_STORAGE_KEY);
      if (stored) setLikedSlugs(JSON.parse(stored));
    } catch {
      // localStorage unavailable — likes just won't persist
    }
  }, []);

  const toggleLike = (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setLikedSlugs((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — likes just won't persist
      }
      return next;
    });
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (
      info.offset.x < -SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      setActiveIndex((i) => Math.min(projects.length - 1, i + 1));
    } else if (
      info.offset.x > SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      setActiveIndex((i) => Math.max(0, i - 1));
    }
  };

  return (
    <section id="work" className="relative z-10 mt-14 md:mt-16 pb-16">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 w-24 md:w-32 h-full bg-gradient-to-r from-[#080808] to-transparent z-[15] pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 md:w-32 h-full bg-gradient-to-l from-[#080808] to-transparent z-[15] pointer-events-none" />

      {/* Cards */}
      <motion.div
        className="relative w-full h-[480px] md:h-[460px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {projects.map((project, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);

          if (absOffset > 3) return null;

          const isActive = offset === 0;
          const tx = offset * 340 + (isActive ? 0 : offset * 40);
          const scale = isActive ? 1.06 : 0.86;
          const opacity =
            absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : absOffset === 2 ? 0.35 : 0;
          const zIndex = 10 - absOffset;

          return (
            <motion.div
              key={project.slug}
              className="absolute w-[300px] md:w-[340px]"
              animate={{
                x: tx,
                scale,
                opacity,
                zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              style={{ zIndex }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  isActive
                    ? router.push(`/work/${project.slug}`)
                    : setActiveIndex(i)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    isActive
                      ? router.push(`/work/${project.slug}`)
                      : setActiveIndex(i);
                  }
                }}
                className="block w-full text-left cursor-pointer"
                aria-label={
                  isActive ? `Open ${project.title}` : `Select ${project.title}`
                }
              >
                <div
                  className={`rounded-[20px] overflow-hidden p-5 md:p-6 backdrop-blur-3xl transition-colors duration-300 ${
                    isActive
                      ? "bg-white/[0.055] border border-white/10"
                      : "bg-white/[0.025] border border-white/[0.04]"
                  }`}
                >
                  {/* Date + Title */}
                  <div className="mb-3.5">
                    <div className="text-[11px] text-white/30 tracking-[1px] uppercase mb-1.5">
                      {project.date}
                    </div>
                    <div className="font-display text-[17px] font-semibold text-white/90 leading-snug">
                      {project.title}
                    </div>
                  </div>

                  {/* Preview placeholder */}
                  <div className="w-full h-[200px] bg-white/[0.03] rounded-[14px] border border-white/[0.05] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8" />
                        <path d="M12 17v4" />
                      </svg>
                      <span className="text-[10px] text-white/10 tracking-[1.5px] uppercase">
                        Project Preview
                      </span>
                    </div>
                  </div>

                  {/* Tools used */}
                  <div className="mt-3.5 flex items-center gap-2.5">
                    {project.tools.map((toolKey) => {
                      const tool = tools[toolKey];
                      if (!tool) return null;
                      const Icon = tool.icon;
                      return (
                        <Icon
                          key={toolKey}
                          title={tool.label}
                          size={14}
                          color="rgba(255,255,255,0.35)"
                        />
                      );
                    })}
                  </div>

                  {/* Like button */}
                  <div className="mt-3.5 flex items-center">
                    <motion.button
                      onClick={(e) => toggleLike(project.slug, e)}
                      whileTap={{ scale: 0.8 }}
                      animate={{
                        scale: likedSlugs[project.slug] ? [1, 1.3, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      aria-label={
                        likedSlugs[project.slug]
                          ? "Unlike this project"
                          : "Like this project"
                      }
                      className="flex items-center justify-center"
                    >
                      {likedSlugs[project.slug] ? (
                        <FaHeart size={16} color="#f43f5e" />
                      ) : (
                        <FaRegHeart size={16} color="rgba(255,255,255,0.35)" />
                      )}
                    </motion.button>
                  </div>

                  {/* Metric */}
                  <div className="mt-3.5 flex items-center justify-end">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17l9.2-9.2" />
                        <path d="M17 17V7H7" />
                      </svg>
                      <span className="text-[13px] text-white/40">
                        {project.metric} {project.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to project ${i + 1}`}
            className="transition-all duration-400 rounded-full h-1.5"
            style={{
              width: i === activeIndex ? 24 : 6,
              backgroundColor:
                i === activeIndex
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
