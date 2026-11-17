"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

export default function CustomCursor() {
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const handleMove = (e: MouseEvent) => {
      // Direct 1:1 tracking, no spring smoothing — the cursor must never lag behind the real pointer.
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[10000] pointer-events-none"
      style={{ x, y }}
    >
      <div className="relative">
        <BsCursorFill
          size={18}
          color="#FACC15"
          style={{ filter: "drop-shadow(0 0 4px rgba(250,204,21,0.55))" }}
        />
        <AnimatePresence>
          {label && (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{ duration: 0.08, ease: "easeOut" }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-full bg-[#FACC15] px-3 py-1.5 text-[11px] font-semibold text-black/80 shadow-[0_0_10px_rgba(250,204,21,0.45)]"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
