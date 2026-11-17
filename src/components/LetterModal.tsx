"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const FORM_ENDPOINT = "https://formspree.io/f/xaenopay";
const TO_EMAIL = "zedi.parham@gmail.com";
const SUBJECT = "Ask me anything";
const HAND_FONT = "'Caveat', cursive";

const SEAL_SIZE = 70;
const ROPE_RING_BG =
  "repeating-conic-gradient(from 0deg, #8a5a30 0deg 8deg, #4a2c14 8deg 16deg)";
const WAX_BG =
  "radial-gradient(circle at 32% 26%, #c24a34 0%, #8f2418 45%, #5c1210 78%, #3a0a08 100%)";

function SealFace() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: ROPE_RING_BG,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.4)",
        }}
      />
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: 5,
          background: WAX_BG,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.22), inset 0 -4px 8px rgba(0,0,0,0.45)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: 4,
            background:
              "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.35), transparent 45%)",
          }}
        />
        <span
          className="select-none relative"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 19,
            fontWeight: 700,
            color: "#e7b98f",
            textShadow: "0 1px 0 rgba(255,255,255,0.18), 0 -1px 1px rgba(0,0,0,0.45)",
          }}
        >
          PA
        </span>
      </div>
    </>
  );
}

const PAPER_BG =
  "radial-gradient(ellipse at 15% 10%, rgba(101,64,24,0.35), transparent 30%)," +
  "radial-gradient(ellipse at 85% 18%, rgba(76,46,16,0.3), transparent 28%)," +
  "radial-gradient(ellipse at 10% 55%, rgba(101,64,24,0.22), transparent 26%)," +
  "radial-gradient(ellipse at 90% 60%, rgba(76,46,16,0.26), transparent 30%)," +
  "radial-gradient(ellipse at 22% 88%, rgba(101,64,24,0.32), transparent 34%)," +
  "radial-gradient(ellipse at 80% 92%, rgba(76,46,16,0.28), transparent 32%)," +
  "radial-gradient(ellipse at 50% 50%, rgba(170,128,70,0.12), transparent 55%)," +
  "linear-gradient(160deg, #ecd9ab 0%, #ddbd8c 30%, #cca978 60%, #b89564 85%, #a6824f 100%)";

// Fractal-noise grain so the paper reads as fibrous, not a flat gradient.
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  );

const ROLL_CAP_BG =
  "linear-gradient(180deg, #3a2410 0%, #5e3d1f 18%, #8a5f34 38%, #a3763e 50%, #8a5f34 62%, #5e3d1f 82%, #3a2410 100%)";

// Deckled, torn-paper edge — lots of small irregular points down the left and
// right sides only (top/bottom stay straight since the rolled caps sit there).
function buildDeckleClip() {
  const steps = 22;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 100;
    const jitter =
      Math.sin(i * 2.3 + 0.4) * 0.5 + Math.sin(i * 5.7 + 1.8) * 0.3 + Math.sin(i * 1.1) * 0.2;
    const inset = 1.6 + jitter * 1.5; // oscillates roughly between 0% and 3.2%
    left.push(`${inset.toFixed(2)}% ${y.toFixed(2)}%`);
    right.push(`${(100 - inset).toFixed(2)}% ${y.toFixed(2)}%`);
  }
  const points = ["0% 0%", "100% 0%", ...right, "100% 100%", "0% 100%", ...left.slice().reverse()];
  return `polygon(${points.join(", ")})`;
}
const TORN_CLIP = buildDeckleClip();

export default function LetterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [handPos, setHandPos] = useState({ x: 0, y: 2 });
  const [revealed, setRevealed] = useState(false);
  const [sealing, setSealing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      const t1 = setTimeout(() => setRevealed(true), 250);
      const t2 = setTimeout(() => textareaRef.current?.focus(), 1150);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const t = setTimeout(() => {
      setText("");
      setSent(false);
      setSending(false);
      setRevealed(false);
      setSealing(false);
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!markerRef.current || !canvasRef.current) return;
    const markerRect = markerRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setHandPos({
      x: markerRect.left - canvasRect.left,
      y: markerRect.top - canvasRect.top,
    });
  }, [text]);

  const handleSeal = async () => {
    if (!text.trim() || sending || sealing) return;
    setSending(true);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ to: TO_EMAIL, subject: SUBJECT, message: text }),
    }).catch(() => {
      // Delivery is best-effort — the seal ceremony plays either way.
    });

    setSealing(true);
    setRevealed(false);
    setTimeout(() => {
      setSent(true);
    }, 650);
    setTimeout(onClose, 1900);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10050] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-[600px]"
            initial={{ opacity: 0, scale: 0.6, rotate: -10, y: 60 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.2, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 8, y: 40 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
          >
            {/* Unroll mask — clips from a thin middle line out to full height, so the
                paper genuinely reads as unrolling open from its own center seam. */}
            <motion.div
              initial={false}
              animate={{
                clipPath: revealed
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(49.3% 0% 49.3% 0%)",
              }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative"
                style={{ background: PAPER_BG, clipPath: TORN_CLIP }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundImage: `url("${GRAIN_SVG}")`,
                    backgroundSize: "220px 220px",
                    opacity: 0.22,
                  }}
                />

                <div className="relative" style={{ height: 20, background: ROLL_CAP_BG, boxShadow: "0 3px 6px rgba(0,0,0,0.35)" }}>
                  {[8, 18, 30, 70, 82, 92].map((left, i) => (
                    <div
                      key={i}
                      aria-hidden="true"
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        bottom: -5,
                        width: 2,
                        height: 9,
                        background: "#2e1c0c",
                        borderRadius: 1,
                        transform: `rotate(${(i % 2 ? 1 : -1) * (6 + i)}deg)`,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>

                <div className="relative px-8 py-7 md:px-14 md:py-10">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close letter"
                    className="absolute top-3 right-5 text-black/30 hover:text-black/60 text-2xl leading-none transition-colors"
                  >
                    &times;
                  </button>

                  <div
                    className="font-mono text-[11px] tracking-wide text-black/50 space-y-1.5 mb-8 pb-5"
                    style={{ borderBottom: "1px solid rgba(43,34,16,0.25)" }}
                  >
                    <div>To: {TO_EMAIL}</div>
                    <div>Subject: {SUBJECT}</div>
                  </div>

                  <p
                    className="mb-2 select-none"
                    style={{ fontFamily: HAND_FONT, fontSize: 32, color: "#2b2210" }}
                  >
                    Dear Parham,
                  </p>

                  <div
                    ref={canvasRef}
                    className="relative cursor-text"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent, transparent 37px, rgba(43,34,16,0.16) 38px)",
                      minHeight: 190,
                    }}
                    onClick={() => textareaRef.current?.focus()}
                  >
                    <div
                      aria-hidden="true"
                      className="whitespace-pre-wrap break-words pr-2"
                      style={{
                        fontFamily: HAND_FONT,
                        fontSize: 28,
                        lineHeight: "38px",
                        color: "#2b2210",
                        minHeight: 190,
                      }}
                    >
                      {text}
                      <span ref={markerRef} />
                      {!text && (
                        <span style={{ color: "rgba(43,34,16,0.4)" }}>
                          Write something…
                        </span>
                      )}
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={sealing || sent}
                      className="absolute inset-0 w-full h-full resize-none bg-transparent outline-none pr-2"
                      style={{
                        fontFamily: HAND_FONT,
                        fontSize: 28,
                        lineHeight: "38px",
                        color: "transparent",
                        caretColor: "transparent",
                      }}
                    />

                    <motion.div
                      className="absolute pointer-events-none select-none"
                      animate={{
                        left: handPos.x + 4,
                        top: handPos.y - 6,
                        rotate: text ? [0, -8, 5, -2, 0] : 0,
                      }}
                      transition={{
                        left: { type: "spring", stiffness: 520, damping: 34 },
                        top: { type: "spring", stiffness: 520, damping: 34 },
                        rotate: { duration: 0.3, ease: "easeOut" },
                      }}
                      style={{ fontSize: 26, lineHeight: 1 }}
                    >
                      ✍️
                    </motion.div>
                  </div>

                  <div className="h-16" />
                </div>

                <div className="relative" style={{ height: 20, background: ROLL_CAP_BG, boxShadow: "0 -3px 6px rgba(0,0,0,0.35)" }}>
                  {[12, 24, 36, 64, 76, 88].map((left, i) => (
                    <div
                      key={i}
                      aria-hidden="true"
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        top: -5,
                        width: 2,
                        height: 9,
                        background: "#2e1c0c",
                        borderRadius: 1,
                        transform: `rotate(${(i % 2 ? 1 : -1) * (6 + i)}deg)`,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Wax seal — doubles as the Send button. Rests on the letter until
                clicked, then glides to the center seam and stamps down as the
                scroll rolls shut behind it. */}
            {!sealing && (
              <motion.button
                layoutId="wax-seal"
                type="button"
                data-cursor="Seal it"
                onClick={handleSeal}
                disabled={!text.trim() || sending}
                aria-label="Seal and send"
                className="absolute disabled:opacity-40 disabled:grayscale transition-opacity"
                style={{
                  width: SEAL_SIZE,
                  height: SEAL_SIZE,
                  right: 22,
                  bottom: -26,
                  rotate: -9,
                }}
              >
                <SealFace />
              </motion.button>
            )}

            {sealing && (
              <motion.div
                layoutId="wax-seal"
                className="absolute"
                style={{
                  width: SEAL_SIZE,
                  height: SEAL_SIZE,
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ scale: [1, 1.35, 1], rotate: [-9, 0, 0] }}
                transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
              >
                <SealFace />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
