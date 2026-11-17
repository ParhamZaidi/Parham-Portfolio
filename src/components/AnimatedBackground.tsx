"use client";

import { useTheme } from "@/context/ThemeContext";

const NIGHT_COLORS = [
  "rgba(99,102,241,0.3)",
  "rgba(168,85,247,0.28)",
  "rgba(59,130,246,0.26)",
  "rgba(139,92,246,0.25)",
  "rgba(79,70,229,0.25)",
];

const DAY_COLORS = [
  "rgba(99,102,241,0.16)",
  "rgba(236,72,153,0.14)",
  "rgba(59,130,246,0.14)",
  "rgba(250,204,21,0.16)",
  "rgba(249,115,22,0.13)",
];

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const isDay = theme === "day";
  const colors = isDay ? DAY_COLORS : NIGHT_COLORS;
  const blend = isDay ? "multiply" : "screen";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg transition-colors duration-500">
      {/* Blob 1 */}
      <div
        className="absolute top-[10%] left-[5%] w-[650px] h-[650px] rounded-full animate-drift-1"
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
          filter: "blur(120px)",
          mixBlendMode: blend,
        }}
      />
      {/* Blob 2 */}
      <div
        className="absolute top-[25%] right-[10%] w-[600px] h-[600px] rounded-full animate-drift-2"
        style={{
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
          filter: "blur(120px)",
          mixBlendMode: blend,
        }}
      />
      {/* Blob 3 */}
      <div
        className="absolute bottom-[5%] left-[25%] w-[700px] h-[700px] rounded-full animate-drift-3"
        style={{
          background: `radial-gradient(circle, ${colors[2]} 0%, transparent 70%)`,
          filter: "blur(120px)",
          mixBlendMode: blend,
        }}
      />
      {/* Blob 4 */}
      <div
        className="absolute top-[45%] left-[45%] w-[600px] h-[600px] rounded-full animate-drift-4"
        style={{
          background: `radial-gradient(circle, ${colors[3]} 0%, transparent 70%)`,
          filter: "blur(120px)",
          mixBlendMode: blend,
        }}
      />
      {/* Blob 5 */}
      <div
        className="absolute bottom-[15%] right-[20%] w-[600px] h-[600px] rounded-full animate-drift-5"
        style={{
          background: `radial-gradient(circle, ${colors[4]} 0%, transparent 70%)`,
          filter: "blur(120px)",
          mixBlendMode: blend,
        }}
      />
    </div>
  );
}
