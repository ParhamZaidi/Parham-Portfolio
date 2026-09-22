"use client";

import { useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { usePathname } from "next/navigation";

// TODO: replace with your own Formspree form endpoint (sign up free at
// formspree.io, create a form, and paste its endpoint URL here) — notes
// won't be emailed to you until this is set.
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const STORAGE_KEY = "sticky-feedback-notes";
const PAPER = "#FFD966";
const PAPER_EDGE = "#F2C24C";
const INK = "#3A2E00";

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

function randomTriggerPosition() {
  const navBand = 110;
  const toolbarBand = 110;
  const margin = 50;
  const maxX = window.innerWidth - margin;
  const maxY = window.innerHeight - margin;

  let x = margin;
  let y = navBand;
  for (let attempt = 0; attempt < 8; attempt++) {
    x = margin + Math.random() * Math.max(1, maxX - margin);
    y = navBand + Math.random() * Math.max(1, maxY - navBand);
    if (x > toolbarBand + margin) break;
  }
  return { x, y };
}

function paperStyle(rotate: number, scale = 1): React.CSSProperties {
  return {
    background: `linear-gradient(160deg, ${PAPER} 0%, ${PAPER_EDGE} 100%)`,
    boxShadow: "0 10px 22px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)",
    color: INK,
    transform: `rotate(${rotate}deg) scale(${scale})`,
  };
}

export default function StickyNoteFeedback() {
  const pathname = usePathname();
  const [trigger, setTrigger] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeNote, setActiveNote] = useState<ActiveNote | null>(null);
  const [notes, setNotes] = useState<PlacedNote[]>([]);
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      // Ignore corrupt/blocked storage — feature degrades to session-only in memory.
    }
    setHydrated(true);

    const spawnTimer = setTimeout(() => setTrigger(randomTriggerPosition()), 2500);
    return () => clearTimeout(spawnTimer);
  }, []);

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
      if (!trigger) setTrigger(randomTriggerPosition());
      return;
    }
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === activeNote.id);
      const updated: PlacedNote = { id: activeNote.id, path: pathname, x: activeNote.x, y: activeNote.y, text };
      return exists ? prev.map((n) => (n.id === activeNote.id ? updated : n)) : [...prev, updated];
    });
    sendNote(text);
    setActiveNote(null);
    setTrigger(randomTriggerPosition());
  };

  const discardActive = () => {
    if (!activeNote) return;
    setNotes((prev) => prev.filter((n) => n.id !== activeNote.id));
    setActiveNote(null);
    if (!trigger) setTrigger(randomTriggerPosition());
  };

  const visibleNotes = notes.filter((n) => n.path === pathname && n.id !== activeNote?.id);

  return (
    <>
      {trigger && (
        <motion.div
          className="fixed z-[9999] flex h-12 w-12 cursor-grab select-none items-center justify-center rounded-sm text-center text-[9px] font-semibold leading-tight active:cursor-grabbing"
          style={{ left: trigger.x, top: trigger.y, ...paperStyle(-6) }}
          drag
          dragMomentum={false}
          dragElastic={0.15}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          animate={dragging ? { rotate: -3, scale: 1.08 } : { rotate: [-6, 6, -6] }}
          transition={dragging ? { duration: 0.15 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          whileDrag={{ scale: 1.12, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}
          title="Grab me — tell us what's wrong, would love to know"
        >
          pick note
        </motion.div>
      )}

      {visibleNotes.map((note) => {
        const preview = note.text.length > 32 ? `${note.text.slice(0, 32)}…` : note.text;
        return (
          <motion.button
            key={note.id}
            type="button"
            onClick={() => openNote(note)}
            className="fixed z-[40] w-[70px] rounded-sm p-1.5 text-left text-[9px] leading-snug"
            style={{
              left: note.x - scrollPos.x,
              top: note.y - scrollPos.y,
              ...paperStyle(note.id.charCodeAt(5) % 2 === 0 ? -4 : 4, 1),
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {preview || "…"}
          </motion.button>
        );
      })}

      {activeNote && (
        <motion.div
          className="fixed z-[9999] w-[200px] rounded-sm p-3"
          style={{ left: activeNote.x - scrollPos.x, top: activeNote.y - scrollPos.y, ...paperStyle(-2) }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: -2 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
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
            className="h-[130px] w-full resize-none bg-transparent text-[13px] leading-snug outline-none placeholder:opacity-50"
            style={{ color: INK }}
          />
        </motion.div>
      )}
    </>
  );
}
