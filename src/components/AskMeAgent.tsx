"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegCommentDots,
  FaArrowRight,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";
import { projects } from "@/data/projects";

interface Message {
  role: "user" | "agent";
  text: string;
}

interface QAEntry {
  question: string;
  keywords: string[];
  answer: string;
}

const bestProject = projects[0];

const QA: QAEntry[] = [
  {
    question: "What's the best project Parham has worked on?",
    keywords: [
      "best project",
      "favorite project",
      "proudest",
      "top project",
      "which project",
      "project have you",
      "project has parham",
    ],
    answer: `Probably "${bestProject.title}" — ${bestProject.description} It drove ${bestProject.metric} in ${bestProject.metricLabel}.`,
  },
  {
    question: "How many years of experience does Parham have?",
    keywords: [
      "years of experience",
      "how many years",
      "how long has parham",
      "how long have you",
      "experience does parham",
    ],
    answer:
      "[X] years of product design experience, from early junior roles to leading 0-to-1 launches. (Swap in the real number before sharing this widely!)",
  },
  {
    question: "What can Parham do?",
    keywords: [
      "what can parham",
      "what can you do",
      "your skills",
      "good at",
      "capable of",
      "what do you do",
    ],
    answer:
      "Product design end to end — research, systems thinking, and interaction design — with a focus on the details most teams skip: empty states, error messages, onboarding. \"Clarity over cleverness\" is the whole philosophy.",
  },
  {
    question: "What tools does Parham use?",
    keywords: [
      "what tools",
      "what software",
      "tech stack",
      "design tools",
      "which tools",
    ],
    answer:
      "Mainly Figma for design, Framer for interactive prototypes, plus Notion, Sketch, and Miro depending on the project.",
  },
  {
    question: "How can I get in touch with Parham?",
    keywords: [
      "contact",
      "hire parham",
      "available for work",
      "email parham",
      "reach parham",
      "work with parham",
      "get in touch",
    ],
    answer:
      "Head over to the Contact page — there's a direct email link and current availability status there.",
  },
];

function findAnswer(input: string): string | null {
  const normalized = input.toLowerCase();
  let best: { entry: QAEntry; score: number } | null = null;

  for (const entry of QA) {
    const score = entry.keywords.filter((k) =>
      normalized.includes(k.toLowerCase())
    ).length;
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best ? best.entry.answer : null;
}

const FALLBACK =
  "I don't have a canned answer for that one yet — but Parham would love to hear it directly. Try the Contact page!";

export default function AskMeAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ask = (question: string) => {
    const answer = findAnswer(question) ?? FALLBACK;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "agent", text: answer },
    ]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input.trim());
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
      >
        <FaRegCommentDots size={13} />
        Ask me anything about Parham
        <FaArrowRight size={11} />
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full max-w-md rounded-2xl bg-[#0d0d0d] border border-white/10 backdrop-blur-3xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                    <div>
                      <div className="text-[11px] tracking-[1.5px] text-white/30 uppercase mb-1">
                        Ask me anything
                      </div>
                      <div className="font-display text-lg font-semibold text-white/90">
                        About Parham Ailia
                      </div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 min-h-[120px]">
                    {messages.length === 0 && (
                      <p className="text-sm text-white/40 leading-relaxed">
                        Try one of these, or type your own question below.
                      </p>
                    )}
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                          m.role === "user"
                            ? "self-end bg-white/[0.08] text-white/90"
                            : "self-start bg-white/[0.03] border border-white/[0.06] text-white/60"
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>

                  <div className="px-6 pb-4 flex flex-wrap gap-2">
                    {QA.slice(0, 4).map(({ question }) => (
                      <button
                        key={question}
                        onClick={() => ask(question)}
                        className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/50 hover:text-white hover:border-white/20 transition-all"
                      >
                        {question}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 px-6 py-4 border-t border-white/[0.06]"
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2.5 text-[13px] text-white/90 placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
                    />
                    <button
                      type="submit"
                      aria-label="Send"
                      className="w-9 h-9 flex-shrink-0 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all"
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </form>

                  <div className="px-6 pb-5 -mt-1">
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="text-[11px] text-white/25 hover:text-white/50 transition-colors"
                    >
                      Prefer to ask Parham directly? Contact page →
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
