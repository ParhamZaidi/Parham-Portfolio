"use client";

import { motion } from "framer-motion";

export default function EqualizerBars({
  active = true,
}: {
  active?: boolean;
}) {
  const bars = [0, 1, 2];
  return (
    <span className="inline-flex items-end gap-[2px] h-3">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] h-3 rounded-full bg-current origin-bottom"
          animate={
            active
              ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }
              : { scaleY: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  );
}
