"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const STORAGE_KEY = "intro-seen";

type Phase = "fly" | "hold" | "resolve" | "logoHold" | "exit";

const PALETTE = ["#6366f1", "#a855f7", "#3b82f6", "#8b5cf6", "#4f46e5"];
const GRID = 4;
const CELL = 26;
const GAP = 4;
const SPAN = GRID * CELL + (GRID - 1) * GAP;

// Which screen corner each quadrant's cells fly in from.
const QUADRANT_ORIGIN: Record<string, { x: number; y: number }> = {
  "0-0": { x: -600, y: -500 }, // top-left quadrant <- top-left corner
  "0-1": { x: 600, y: -500 }, // top-right quadrant <- top-right corner
  "1-0": { x: -600, y: 500 }, // bottom-left quadrant <- bottom-left corner
  "1-1": { x: 600, y: 500 }, // bottom-right quadrant <- bottom-right corner
};

interface Cell {
  row: number;
  col: number;
  color: string;
  origin: { x: number; y: number };
}

export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<Phase>("fly");

  const cells = useMemo<Cell[]>(() => {
    const list: Cell[] = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const quadrant = `${row < 2 ? 0 : 1}-${col < 2 ? 0 : 1}`;
        list.push({
          row,
          col,
          color: PALETTE[(row + col) % PALETTE.length],
          origin: QUADRANT_ORIGIN[quadrant],
        });
      }
    }
    return list;
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");

    const timers = [
      setTimeout(() => setPhase("hold"), 800),
      setTimeout(() => setPhase("resolve"), 1050),
      setTimeout(() => setPhase("logoHold"), 1500),
      setTimeout(() => setPhase("exit"), 1850),
      setTimeout(() => setShow(false), 2350),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const showMosaic = phase === "fly" || phase === "hold" || phase === "resolve";
  const showLogo = phase === "resolve" || phase === "logoHold" || phase === "exit";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#080808]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative" style={{ width: SPAN, height: SPAN }}>
            <AnimatePresence>
              {showMosaic && (
                <motion.div
                  className="absolute inset-0"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {cells.map((cell) => (
                    <motion.div
                      key={`${cell.row}-${cell.col}`}
                      className="absolute rounded-sm"
                      style={{
                        width: CELL,
                        height: CELL,
                        left: cell.col * (CELL + GAP),
                        top: cell.row * (CELL + GAP),
                        backgroundColor: cell.color,
                      }}
                      initial={{
                        x: cell.origin.x,
                        y: cell.origin.y,
                        opacity: 0,
                        scale: 0.4,
                      }}
                      animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 16,
                        delay: 0.03 * (cell.row * GRID + cell.col),
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showLogo && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: "backOut" }}
                >
                  <Logo size={120} dark />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
