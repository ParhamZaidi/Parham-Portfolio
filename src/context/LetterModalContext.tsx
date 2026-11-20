"use client";

import { createContext, useContext, useState } from "react";
import LetterModal from "@/components/LetterModal";

const LetterModalContext = createContext<{ openLetter: () => void }>({
  openLetter: () => {},
});

export function LetterModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <LetterModalContext.Provider value={{ openLetter: () => setOpen(true) }}>
      {children}
      <LetterModal open={open} onClose={() => setOpen(false)} />
    </LetterModalContext.Provider>
  );
}

export function useLetterModal() {
  return useContext(LetterModalContext);
}
