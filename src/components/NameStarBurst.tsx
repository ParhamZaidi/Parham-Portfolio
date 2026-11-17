"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiSparkleFill } from "react-icons/pi";

const HIDDEN_DURATION = 3000;
const VISIBLE_DURATION = 5000;

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
        {visible && (
          <motion.span
            className="absolute overflow-hidden"
            style={{
              left: "50%",
              top: "50%",
              width: 79,
              height: 79,
              marginLeft: -39.5,
              marginTop: -39.5,
              borderRadius: 10,
              border: "2px solid #FACC15",
              boxShadow: "0 0 16px rgba(250,204,21,0.35), 0 8px 24px rgba(0,0,0,0.4)",
              transformOrigin: "15% 100%",
            }}
            initial={{ opacity: 0, scale: 0.15, x: 0, y: 0, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, x: 46, y: -82, rotate: 6 }}
            exit={{ opacity: 0, scale: 0.15, x: 0, y: 0, rotate: -6 }}
            transition={{ duration: 0.45, ease: "backOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headshot.jpg"
              alt="Parham Ailia"
              className="w-full h-full object-cover"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
