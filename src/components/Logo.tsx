"use client";

import { useState, type CSSProperties } from "react";

interface LogoProps {
  size?: number;
  dark?: boolean;
  letters?: boolean;
}

export default function Logo({ size = 38, dark = false, letters = true }: LogoProps) {
  const [hovered, setHovered] = useState(false);

  const gap = Math.max(1, size / 22);
  const cell = (size - gap) / 2;
  const ink = dark ? "#F4F3F1" : "#1A1917";
  const paper = dark ? "#1A1917" : "#F4F3F1";
  const mute = dark ? "#211E3D" : "#DDD9D2";
  const glyph = letters && size >= 20;

  const filledBg = hovered ? mute : ink;
  const filledText = hovered ? ink : paper;
  const mutedBg = hovered ? ink : mute;

  const box: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: filledBg,
    color: filledText,
    fontWeight: 800,
    fontSize: cell * 0.52,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    transition: "background-color 180ms ease, color 180ms ease",
  };
  const emptyCell: CSSProperties = {
    background: mutedBg,
    transition: "background-color 180ms ease",
  };
  const grid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `${cell}px ${cell}px`,
    gridTemplateRows: `${cell}px ${cell}px`,
    gap: `${gap}px`,
    flexShrink: 0,
  };

  return (
    <span
      aria-label="Parham Ailia"
      role="img"
      style={grid}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={box}>{glyph ? "P" : ""}</span>
      <span style={emptyCell} />
      <span style={emptyCell} />
      <span style={box}>{glyph ? "A" : ""}</span>
    </span>
  );
}
