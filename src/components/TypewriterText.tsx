"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  active: boolean;
  className?: string;
}

const TYPE_SPEED = 70;
const ERASE_SPEED = 45;
const HOLD_FULL = 900;
const HOLD_EMPTY = 300;

export default function TypewriterText({
  text,
  active,
  className,
}: TypewriterTextProps) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (!active) {
      setLength(0);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const step = (current: number, direction: "typing" | "erasing") => {
      if (direction === "typing") {
        if (current < text.length) {
          setLength(current + 1);
          timeoutId = setTimeout(() => step(current + 1, "typing"), TYPE_SPEED);
        } else {
          timeoutId = setTimeout(() => step(current, "erasing"), HOLD_FULL);
        }
      } else {
        if (current > 0) {
          setLength(current - 1);
          timeoutId = setTimeout(() => step(current - 1, "erasing"), ERASE_SPEED);
        } else {
          timeoutId = setTimeout(() => step(0, "typing"), HOLD_EMPTY);
        }
      }
    };

    timeoutId = setTimeout(() => step(0, "typing"), TYPE_SPEED);

    return () => clearTimeout(timeoutId);
  }, [active, text]);

  if (!active && length === 0) return null;

  return (
    <span className={className} aria-hidden="true">
      {text.slice(0, length)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
