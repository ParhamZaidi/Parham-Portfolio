"use client";

import { useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { usePathname } from "next/navigation";

// TODO: replace with your own Formspree form endpoint (sign up free at
// formspree.io, create a form, and paste its endpoint URL here) — notes
// won't be emailed to you until this is set.
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const STORAGE_KEY = "sticky-feedback-notes";

const PAPER_LIGHT = "#FCE87A";
const PAPER = "#F6D93B";
const PAPER_DARK = "#E8C428";
const INK = "#3A2E00";

const NAV_CLEARANCE = 100;
const TOOLBAR_CLEARANCE = 100;
const VIEWPORT_MARGIN = 16;
const ANCHOR_GAP = 32;
const TRIGGER_SIZE = 60;

interface PlacedNote {
  id: string;
  path: string;
  x: number;
  y: number;
  text: string;
}

interface ActiveNote {
  id: string;
  x: number;
  y: number;
  text: string;
}

function genId() {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function fitsViewport(x: number, y: number, w: number, h: number) {
  return (
    x > Math.max(VIEWPORT_MARGIN, TOOLBAR_CLEARANCE) &&
    x + w < window.innerWidth - VIEWPORT_MARGIN &&
    y > NAV_CLEARANCE &&
    y + h < window.innerHeight - VIEWPORT_MARGIN
  );
}

// Spawns the note beside the page's own heading block (never overlapping
// it) — right or left, whichever fits, so it can never land on top of
// other content. Returns null if neither side has room.
function computeSpawnPosition(): { x: number; y: number } | null {
  const anchor = document.getElementById("page-heading");
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2 - TRIGGER_SIZE / 2;

  const right = { x: rect.right + ANCHOR_GAP, y: centerY };
  const left = { x: rect.left - ANCHOR_GAP - TRIGGER_SIZE, y: centerY };
  const candidates = Math.random() < 0.5 ? [right, left] : [left, right];

  for (const c of candidates) {
    if (fitsViewport(c.x, c.y, TRIGGER_SIZE, TRIGGER_SIZE)) return c;
  }
  return null;
}

// Folded bottom-right corner: a shadowed "gap" triangle plus a lighter
// "peeled flap" triangle on top, giving the paper a lifted, real feel.
function CurledCorner({ size }: { size: number }) {
  const fold = Math.max(10, Math.min(22, size * 0.22));
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: fold,
          height: fold,
          background: "rgba(0,0,0,0.3)",
          clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: fold,
          height: fold,
          background: `linear-gradient(135deg, ${PAPER} 40%, ${PAPER_LIGHT} 100%)`,
          clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
          boxShadow: "-1px -1px 3px rgba(0,0,0,0.22)",
        }}
      />
    </>
  );
}

function StickyNotePaper({
  width,
  height,
  rotate,
  className,
  style,
  children,
}: {
  width: number;
  height: number;
  rotate: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 2,
        background: `linear-gradient(160deg, ${PAPER_LIGHT} 0%, ${PAPER} 55%, ${PAPER_DARK} 100%)`,
        boxShadow: "0 10px 24px rgba(0,0,0,0.45), 0 2px 5px rgba(0,0,0,0.3)",
        color: INK,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
      <CurledCorner size={width} />
    </div>
  );
}

export default function StickyNoteFeedback() {
  const pathname = usePathname();
  const [trigger, setTrigger] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [notes, setNotes] = useState<PlacedNote[]>([]);
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [hydrated, setHydrated] = useState(false);

  const trySpawn = () => {
    const pos = computeSpawnPosition();
    if (pos) {
      setTrigger(pos);
    } else {
      setTimeout(trySpawn, 3000);
    }
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      // Ignore corrupt/blocked storage — feature degrades to session-only in memory.
    }
    setHydrated(true);

    const spawnTimer = setTimeout(trySpawn, 2500);
    return () => clearTimeout(spawnTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The heading anchor changes per route — drop anything stale and
  // re-spawn beside the new page's own heading.
  useEffect(() => {
    setTrigger(null);
    setActiveNote(null);
    const spawnTimer = setTimeout(trySpawn, 800);
    return () => clearTimeout(spawnTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Best-effort persistence only.
    }
  }, [notes, hydrated]);

  useEffect(() => {
    const onScroll = () => setScrollPos({ x: window.scrollX, y: window.scrollY });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function sendNote(text: string) {
    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ message: text, page: pathname, url: window.location.href }),
      });
    } catch {
      // Delivery is best-effort; the note still stays pinned locally either way.
    }
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    setTrigger(null);
    setActiveNote({
      id: genId(),
      x: info.point.x + window.scrollX - 20,
      y: info.point.y + window.scrollY - 20,
      text: "",
    });
  };

  const openNote = (note: PlacedNote) => {
    setActiveNote({ id: note.id, x: note.x, y: note.y, text: note.text });
  };

  const commitActive = () => {
    if (!activeNote) return;
    const text = activeNote.text.trim();
    if (!text) {
      setNotes((prev) => prev.filter((n) => n.id !== activeNote.id));
      setActiveNote(null);
      if (!trigger) trySpawn();
      return;
    }
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === activeNote.id);
      const updated: PlacedNote = { id: activeNote.id, path: pathname, x: activeNote.x, y: activeNote.y, text };
      return exists ? prev.map((n) => (n.id === activeNote.id ? updated : n)) : [...prev, updated];
    });
    sendNote(text);
    setActiveNote(null);
    trySpawn();
  };

  const discardActive = () => {
    if (!activeNote) return;
    setNotes((prev) => prev.filter((n) => n.id !== activeNote.id));
    setActiveNote(null);
    if (!trigger) trySpawn();
  };

  const visibleNotes = notes.filter((n) => n.path === pathname && n.id !== activeNote?.id);

  return (
    <>
      {trigger && (
        <motion.div
          className="fixed z-[9999] cursor-grab select-none active:cursor-grabbing"
          style={{ left: trigger.x, top: trigger.y }}
          drag
          dragMomentum={false}
          dragElastic={0.15}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          animate={dragging ? { rotate: -3, scale: 1.08 } : { rotate: [-6, 6, -6] }}
          transition={dragging ? { duration: 0.15 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          whileDrag={{ scale: 1.12 }}
          title="Grab me — tell us what's wrong, would love to know"
        >
          <StickyNotePaper width={TRIGGER_SIZE} height={TRIGGER_SIZE} rotate={0}>
            <div className="flex h-full w-full items-center justify-center px-1.5 text-center font-display text-[11px] italic leading-tight">
              pick me
            </div>
          </StickyNotePaper>
        </motion.div>
      )}

      {visibleNotes.map((note) => {
        const preview = note.text.length > 32 ? `${note.text.slice(0, 32)}…` : note.text;
        return (
          <motion.button
            key={note.id}
            type="button"
            onClick={() => openNote(note)}
            className="fixed z-[40]"
            style={{ left: note.x - scrollPos.x, top: note.y - scrollPos.y }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <StickyNotePaper
              width={76}
              height={68}
              rotate={note.id.charCodeAt(5) % 2 === 0 ? -4 : 4}
              className="p-1.5 text-left text-[9px] leading-snug"
            >
              {preview || "…"}
            </StickyNotePaper>
          </motion.button>
        );
      })}

      {activeNote && (
        <motion.div
          className="fixed z-[9999]"
          style={{ left: activeNote.x - scrollPos.x, top: activeNote.y - scrollPos.y }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <StickyNotePaper width={208} height={176} rotate={-2} className="p-3">
            <button
              type="button"
              onClick={discardActive}
              aria-label="Discard note"
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none opacity-60 hover:opacity-100"
              style={{ color: INK }}
            >
              ×
            </button>
            <textarea
              autoFocus
              value={activeNote.text}
              onChange={(e) => setActiveNote({ ...activeNote, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitActive();
                }
              }}
              placeholder="What could be better here?"
              className="h-[140px] w-full resize-none bg-transparent text-[13px] leading-snug outline-none placeholder:opacity-50"
              style={{ color: INK }}
            />
          </StickyNotePaper>
        </motion.div>
      )}
    </>
  );
}
