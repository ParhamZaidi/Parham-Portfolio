"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { projects } from "@/data/projects";

const STORAGE_KEY = "intro-seen";

type Phase = "enter" | "absorb" | "emit" | "hold" | "exit";

export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");

    const timers = [
      setTimeout(() => setPhase("absorb"), 650),
      setTimeout(() => setPhase("emit"), 1000),
      setTimeout(() => setPhase("hold"), 1500),
      setTimeout(() => setPhase("exit"), 1900),
      setTimeout(() => setShow(false), 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const project = projects[0];
  const result = project.results[0];

  const showBrief = phase === "enter" || phase === "absorb";
  const showResult = phase === "emit" || phase === "hold" || phase === "exit";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#080808]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          <div className="relative w-full max-w-md h-24 flex items-center justify-center">
            <AnimatePresence>
              {showBrief && (
                <motion.div
                  className="absolute px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl w-[220px]"
                  style={{ left: "50%", top: "50%", marginLeft: -110, marginTop: -34 }}
                  initial={{ opacity: 0, x: -170, scale: 1 }}
                  animate={
                    phase === "absorb"
                      ? { opacity: 0, x: 0, scale: 0.15 }
                      : { opacity: 1, x: -80, scale: 1 }
                  }
                  transition={{
                    duration: phase === "absorb" ? 0.35 : 0.6,
                    ease: phase === "absorb" ? "easeIn" : "easeOut",
                  }}
                >
                  <div className="text-[9px] tracking-[2px] text-white/30 uppercase mb-1.5">
                    Brief
                  </div>
                  <div className="text-[13px] text-white/70 leading-snug line-clamp-3">
                    {project.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="relative z-10"
              animate={{ scale: phase === "absorb" ? 1.18 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Logo size={64} dark />
            </motion.div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  className="absolute px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl text-center w-[180px]"
                  style={{ left: "50%", top: "50%", marginLeft: -90, marginTop: -38 }}
                  initial={{ opacity: 0, x: 0, scale: 0.2 }}
                  animate={{ opacity: 1, x: 90, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <div className="font-display text-3xl font-bold text-white">
                    {result.value}
                  </div>
                  <div className="text-[10px] tracking-[1.5px] text-white/40 uppercase mt-1.5">
                    {result.label}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
