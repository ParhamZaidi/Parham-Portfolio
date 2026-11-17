"use client";

import { motion } from "framer-motion";

interface PamiotAvatarProps {
  variant?: "full" | "head";
  size?: number;
  speaking?: boolean;
  className?: string;
}

// Approximate antenna-tip position (as % of the image box) for each crop,
// so the glow overlay lines up with the actual glowing tip in the artwork.
const ANTENNA_POS: Record<"full" | "head", { left: string; top: string }> = {
  full: { left: "38.7%", top: "9.2%" },
  head: { left: "52%", top: "15%" },
};

const SRC: Record<"full" | "head", string> = {
  full: "/pamiot/full.png",
  head: "/pamiot/head-icon.png",
};

export default function PamiotAvatar({
  variant = "full",
  size = 220,
  speaking = false,
  className = "",
}: PamiotAvatarProps) {
  const antenna = ANTENNA_POS[variant];

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Ambient glow halo */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,0.35) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
        animate={
          speaking
            ? { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }
            : { opacity: [0.35, 0.5, 0.35], scale: [1, 1.03, 1] }
        }
        transition={{
          duration: speaking ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC[variant]}
        alt="Pamiot"
        className="relative w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />

      {/* Antenna-tip blink overlay */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: antenna.left,
          top: antenna.top,
          width: size * 0.07,
          height: size * 0.07,
          marginLeft: -(size * 0.035),
          marginTop: -(size * 0.035),
          background: "#FDE68A",
          filter: "blur(3px)",
          mixBlendMode: "screen",
        }}
        animate={
          speaking
            ? { opacity: [0.3, 1, 0.3], scale: [0.9, 1.3, 0.9] }
            : { opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }
        }
        transition={{
          duration: speaking ? 0.5 : 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
