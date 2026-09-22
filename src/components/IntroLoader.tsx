"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "intro-seen";

type Phase = "fly" | "condense" | "glyph" | "exit";

const PALETTE = ["#6366f1", "#a855f7", "#3b82f6", "#8b5cf6", "#4f46e5"];
const GRID = 4;
const GAP = 4;

// The mosaic and the resolved logo share the same footprint, so the
// tiles can condense directly onto the logo's real cell geometry
// instead of fading out for a separately-faded-in element.
const LOGO_SIZE = 120;
const LOGO_GAP = Math.max(1, LOGO_SIZE / 22);
const LOGO_CELL = (LOGO_SIZE - LOGO_GAP) / 2;
const CELL = (LOGO_SIZE - (GRID - 1) * GAP) / GRID;

const INK = "#F4F3F1";
const MUTE = "#211E3D";
const TEXT_ON_INK = "#1A1917";

// Which screen corner each quadrant's cells fly in from.
const QUADRANT_ORIGIN: Record<string, { x: number; y: number }> = {
  "0-0": { x: -600, y: -500 }, // top-left quadrant <- top-left corner
  "0-1": { x: 600, y: -500 }, // top-right quadrant <- top-right corner
  "1-0": { x: -600, y: 500 }, // bottom-left quadrant <- bottom-left corner
  "1-1": { x: 600, y: 500 }, // bottom-right quadrant <- bottom-right corner
};

// Target rect (within the shared LOGO_SIZE box) each quadrant's tiles
// converge onto, matching Logo.tsx's own 2x2 cell layout.
const QUADRANT_TARGET: Record<string, { left: number; top: number; ink: boolean }> = {
  "0-0": { left: 0, top: 0, ink: true }, // P
  "0-1": { left: LOGO_CELL + LOGO_GAP, top: 0, ink: false },
  "1-0": { left: 0, top: LOGO_CELL + LOGO_GAP, ink: false },
  "1-1": { left: LOGO_CELL + LOGO_GAP, top: LOGO_CELL + LOGO_GAP, ink: true }, // A
};

interface Cell {
  row: number;
  col: number;
  color: string;
  origin: { x: number; y: number };
  left: number;
  top: number;
  dx: number;
  dy: number;
  targetColor: string;
}

export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<Phase>("fly");

  const cells = useMemo<Cell[]>(() => {
    const list: Cell[] = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const quadrant = `${row < 2 ? 0 : 1}-${col < 2 ? 0 : 1}`;
        const target = QUADRANT_TARGET[quadrant];
        const left = col * (CELL + GAP);
        const top = row * (CELL + GAP);
        list.push({
          row,
          col,
          color: PALETTE[(row + col) % PALETTE.length],
          origin: QUADRANT_ORIGIN[quadrant],
          left,
          top,
          dx: target.left - left,
          dy: target.top - top,
          targetColor: target.ink ? INK : MUTE,
        });
      }
    }
    return list;
  }, []);

  const targetScale = LOGO_CELL / CELL;

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");

    const timers = [
      setTimeout(() => setPhase("condense"), 800),
      setTimeout(() => setPhase("glyph"), 1250),
      setTimeout(() => setPhase("exit"), 1850),
      setTimeout(() => setShow(false), 2350),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const condensed = phase === "condense" || phase === "glyph" || phase === "exit";
  const showGlyphs = phase === "glyph" || phase === "exit";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#080808]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative" style={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
            {cells.map((cell) => (
              <motion.div
                key={`${cell.row}-${cell.col}`}
                className="absolute rounded-sm"
                style={{
                  width: CELL,
                  height: CELL,
                  left: cell.left,
                  top: cell.top,
                  transformOrigin: "0 0",
                }}
                initial={{
                  x: cell.origin.x,
                  y: cell.origin.y,
                  opacity: 0,
                  scale: 0.4,
                  backgroundColor: cell.color,
                }}
                animate={
                  condensed
                    ? {
                        x: cell.dx,
                        y: cell.dy,
                        opacity: 1,
                        scale: targetScale,
                        backgroundColor: cell.targetColor,
                      }
                    : {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        backgroundColor: cell.color,
                      }
                }
                transition={
                  condensed
                    ? { duration: 0.45, ease: "easeInOut" }
                    : {
                        type: "spring",
                        stiffness: 120,
                        damping: 16,
                        delay: 0.03 * (cell.row * GRID + cell.col),
                      }
                }
              />
            ))}

            {/* Glyphs sharpen into focus once the tiles have condensed
                into the logo's exact cell geometry and colors. */}
            <motion.span
              aria-hidden="true"
              className="absolute flex items-center justify-center font-display font-extrabold select-none pointer-events-none"
              style={{
                left: QUADRANT_TARGET["0-0"].left,
                top: QUADRANT_TARGET["0-0"].top,
                width: LOGO_CELL,
                height: LOGO_CELL,
                fontSize: LOGO_CELL * 0.52,
                letterSpacing: "-0.04em",
                color: TEXT_ON_INK,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showGlyphs ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              P
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="absolute flex items-center justify-center font-display font-extrabold select-none pointer-events-none"
              style={{
                left: QUADRANT_TARGET["1-1"].left,
                top: QUADRANT_TARGET["1-1"].top,
                width: LOGO_CELL,
                height: LOGO_CELL,
                fontSize: LOGO_CELL * 0.52,
                letterSpacing: "-0.04em",
                color: TEXT_ON_INK,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showGlyphs ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              A
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
