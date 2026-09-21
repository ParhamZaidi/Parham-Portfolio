"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiSparkleFill } from "react-icons/pi";
import { tools } from "@/data/tools";

const HIDDEN_DURATION = 1000;
const VISIBLE_DURATION = 2000;

const burstIcons = [
  { key: "figma", color: "#6366f1", x: -34, y: -46, rotate: -8 },
  { key: "framer", color: "#a855f7", x: 0, y: -58, rotate: 4 },
  { key: "notion", color: "#3b82f6", x: 34, y: -46, rotate: 10 },
];

export default function NameStarBurst() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const cycle = (show: boolean) => {
      setVisible(show);
      timeoutId = setTimeout(
        () => cycle(!show),
        show ? VISIBLE_DURATION : HIDDEN_DURATION
      );
    };

    timeoutId = setTimeout(() => cycle(true), HIDDEN_DURATION);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span className="relative inline-flex items-center justify-center">
      <PiSparkleFill size={40} color="#8b5cf6" />
      <AnimatePresence>
        {visible &&
          burstIcons.map(({ key, color, x, y, rotate }, i) => {
            const tool = tools[key];
            if (!tool) return null;
            const Icon = tool.icon;
            return (
              <motion.span
                key={key}
                className="absolute flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -16,
                  marginTop: -16,
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}55`,
                }}
                initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, x, y, rotate }}
                exit={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.08,
                  ease: "backOut",
                }}
              >
                <Icon size={16} color={color} />
              </motion.span>
            );
          })}
      </AnimatePresence>
    </span>
  );
}
