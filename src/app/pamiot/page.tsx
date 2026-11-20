"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";
import {
  PiMicrophoneSlashFill,
  PiKeyboardFill,
  PiSpeakerHighFill,
  PiSpeakerSlashFill,
  PiListBulletsFill,
} from "react-icons/pi";
import AnimatedBackground from "@/components/AnimatedBackground";
import ThemeToggle from "@/components/ThemeToggle";
import PamiotAvatar from "@/components/PamiotAvatar";
import EqualizerBars from "@/components/EqualizerBars";
import {
  pamiotTopics,
  pamiotFallback,
  matchPamiotTopic,
} from "@/data/pamiotTopics";

type Phase = "intro" | "active";
type TalkState = "idle" | "recalling" | "talking";

interface Turn {
  question: string;
  answer: string;
}

const REVEAL_MS = 16;
const INTRO_LINE =
  "Hey — I'm Pamiot. Go on, ask me something about Parham: what he builds, how he works, or just poke around.";

// Common male voice names across Chrome/Edge/Safari/Windows/macOS.
const MALE_VOICE_PATTERN =
  /Google UK English Male|Microsoft David|Microsoft Mark|Microsoft Guy|Microsoft Ryan|Daniel|Alex|Fred|Male/i;

function pickMaleVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((v) => MALE_VOICE_PATTERN.test(v.name) && v.lang?.toLowerCase().startsWith("en")) ||
    voices.find((v) => MALE_VOICE_PATTERN.test(v.name)) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
    voices[0] ||
    null
  );
}

// Splits into sentence-sized chunks so each SpeechSynthesisUtterance stays
// short — long single utterances are the usual cause of speech randomly
// cutting out partway through in Chrome, and short chunks with natural
// sentence pauses between them also sound less robotic.
function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]*(\s+|$)/g) || [text];
  return parts.map((s) => s.trim()).filter(Boolean);
}

export default function PamiotPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [greeting, setGreeting] = useState("Hello.");
  const [input, setInput] = useState("");
  const [talkState, setTalkState] = useState<TalkState>("idle");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recallTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening."
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setVoiceSupported(true);

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Chrome's speech synthesis service can silently stall on longer
  // sessions; nudging it with pause/resume keeps it from going quiet.
  useEffect(() => {
    if (!voiceSupported) return;
    const watchdog = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 4000);
    return () => clearInterval(watchdog);
  }, [voiceSupported]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
      if (recallTimeout.current) clearTimeout(recallTimeout.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (audioStopRef.current) audioStopRef.current();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const clearTimers = () => {
    if (revealTimer.current) clearInterval(revealTimer.current);
    if (recallTimeout.current) clearTimeout(recallTimeout.current);
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
  };

  const stopGeminiAudio = () => {
    if (audioStopRef.current) {
      audioStopRef.current();
      audioStopRef.current = null;
    }
  };

  // Reveals the answer with a plain timer-based typewriter — used when
  // voice is muted, or as a fallback if speech synthesis isn't supported.
  const revealWithTypewriter = (answer: string) => {
    let i = 0;
    revealTimer.current = setInterval(() => {
      i++;
      setDisplayed(answer.slice(0, i));
      if (i >= answer.length) {
        if (revealTimer.current) clearInterval(revealTimer.current);
        idleTimeout.current = setTimeout(() => setTalkState("idle"), 400);
      }
    }, REVEAL_MS);
  };

  // Speaks the answer out loud via the browser's built-in Speech
  // Synthesis API, queueing one short utterance per sentence (steadier
  // than one long utterance) and syncing the caption reveal to each
  // utterance's word boundaries — no backend or API key needed.
  const revealWithVoice = (answer: string) => {
    window.speechSynthesis.cancel();
    const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
    const voice = pickMaleVoice(voices);

    const sentences = splitSentences(answer);
    let offset = 0;

    sentences.forEach((sentence, idx) => {
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.rate = 0.98;
      utter.pitch = 1.0;
      if (voice) utter.voice = voice;

      const baseOffset = offset;
      offset += sentence.length + 1;

      utter.onboundary = (e) => {
        if (typeof e.charIndex === "number") {
          setDisplayed(answer.slice(0, Math.min(answer.length, baseOffset + e.charIndex + 1)));
        }
      };

      if (idx === sentences.length - 1) {
        utter.onend = () => {
          setDisplayed(answer);
          idleTimeout.current = setTimeout(() => setTalkState("idle"), 250);
        };
        utter.onerror = () => {
          setDisplayed(answer);
          setTalkState("idle");
        };
      }

      window.speechSynthesis.speak(utter);
    });
  };

  // Plays Pamiot's real voice — Gemini's own text-to-speech — decoded into
  // a Web Audio buffer and played directly, no <audio> tag needed. The
  // caption reveal is timed against the clip's actual duration so the two
  // stay in sync. Returns false if the API isn't configured or the request
  // fails, so the caller can fall back to the browser's built-in voice.
  const revealWithGeminiVoice = async (answer: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/pamiot/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: answer }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data.audio) return false;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const binary = atob(data.audio as string);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      let buffer: AudioBuffer;
      if (data.isRawPcm) {
        // Older TTS models returned bare PCM samples with no container.
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;
        const sampleRate: number = data.sampleRate || 24000;
        buffer = audioCtx.createBuffer(1, float32.length, sampleRate);
        buffer.copyToChannel(float32, 0);
      } else {
        // Current model returns a proper WAV file — let the browser do the
        // decoding instead of hand-rolling it.
        buffer = await audioCtx.decodeAudioData(bytes.buffer);
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      // Only flip to the "talking" state now that playback is genuinely
      // about to start — staying on "recalling" until then avoids a gap
      // where the equalizer says "talking" but nothing is happening yet.
      setTalkState("talking");

      const durationMs = buffer.duration * 1000;
      const start = performance.now();
      const captionTimer = setInterval(() => {
        const ratio = Math.min(1, (performance.now() - start) / durationMs);
        setDisplayed(answer.slice(0, Math.round(answer.length * ratio)));
      }, 40);

      const finish = () => {
        clearInterval(captionTimer);
        setDisplayed(answer);
        audioStopRef.current = null;
        idleTimeout.current = setTimeout(() => setTalkState("idle"), 200);
      };

      source.onended = finish;
      audioStopRef.current = () => {
        clearInterval(captionTimer);
        try {
          source.onended = null;
          source.stop();
        } catch {
          // already stopped
        }
        audioCtx.close();
      };

      source.start();
      return true;
    } catch {
      return false;
    }
  };

  const revealAnswer = (answer: string) => {
    setCurrentAnswer(answer);
    setDisplayed("");
    // Stays on "recalling" (already set by the caller) until whichever
    // reveal path is actually ready to go — revealWithGeminiVoice flips
    // to "talking" itself right as playback starts.
    if (!voiceEnabled) {
      setTalkState("talking");
      revealWithTypewriter(answer);
      return;
    }
    revealWithGeminiVoice(answer).then((started) => {
      if (started) return;
      setTalkState("talking");
      if (voiceSupported) {
        revealWithVoice(answer);
      } else {
        revealWithTypewriter(answer);
      }
    });
  };

  // Used for the canned intro line only — a short simulated "recall" beat
  // before speaking, to match the pacing of a real answer.
  const speakLocal = (answer: string) => {
    clearTimers();
    stopGeminiAudio();
    if (voiceSupported) window.speechSynthesis.cancel();
    setTalkState("recalling");
    setCurrentAnswer("");
    setDisplayed("");
    recallTimeout.current = setTimeout(() => revealAnswer(answer), 550);
  };

  const skip = () => {
    stopGeminiAudio();
    if (voiceSupported) window.speechSynthesis.cancel();
    if (revealTimer.current) clearInterval(revealTimer.current);
    setDisplayed(currentAnswer);
    setTalkState("idle");
  };

  // Tries the real Pamiot endpoint (Gemini, server-side) first; falls back
  // to the scripted topic matching if no key is configured yet, the
  // request fails, or a rate limit is hit — so this always works.
  const ask = async (question: string) => {
    clearTimers();
    stopGeminiAudio();
    if (voiceSupported) window.speechSynthesis.cancel();
    setTalkState("recalling");
    setCurrentAnswer("");
    setDisplayed("");

    let answer: string;
    try {
      const res = await fetch("/api/pamiot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history: history.slice(-6) }),
      });
      if (!res.ok) throw new Error("bad_status");
      const data = await res.json();
      if (!data.answer) throw new Error("no_answer");
      answer = data.answer as string;
    } catch {
      const topic = matchPamiotTopic(question);
      answer = topic ? topic.answer : pamiotFallback;
    }

    setHistory((h) => [...h, { question, answer }]);
    revealAnswer(answer);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(q);
  };

  const handleChip = (topicId: string) => {
    const topic = pamiotTopics.find((t) => t.id === topicId);
    if (!topic) return;
    ask(topic.label);
  };

  const handleStart = () => {
    setPhase("active");
    speakLocal(INTRO_LINE);
  };

  const handleEnd = () => {
    clearTimers();
    stopGeminiAudio();
    if (voiceSupported) window.speechSynthesis.cancel();
    setPhase("intro");
    setTalkState("idle");
    setCurrentAnswer("");
    setDisplayed("");
    setInput("");
  };

  const toggleVoice = () => {
    stopGeminiAudio();
    if (voiceSupported) window.speechSynthesis.cancel();
    setVoiceEnabled((v) => !v);
  };

  const isSpeaking = talkState === "talking";

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg transition-colors duration-500 flex flex-col">
      <AnimatedBackground />

      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fg/[0.05] border border-fg/10 text-sm text-fg/80 hover:text-fg hover:border-fg/20 transition-all"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Portfolio
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16 -mt-10">
        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center max-w-[560px]"
            >
              <PamiotAvatar variant="full" size={200} />
              <h1 className="font-display text-3xl md:text-[40px] font-bold text-fg mt-8 mb-4">
                {greeting}
              </h1>
              <p className="text-[15px] font-light text-fg/55 leading-relaxed max-w-[440px] mb-8">
                I&rsquo;ve got opinions on Parham&rsquo;s work, how he thinks
                through a screen, and a few things he&rsquo;d rather I not
                bring up. Type below and find out.
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="px-7 py-3 rounded-full bg-[#FACC15] text-black text-sm font-semibold hover:brightness-110 transition-all"
              >
                Start chatting
              </button>
              <p className="mt-5 text-[11px] tracking-[1px] uppercase text-fg/25">
                Voice input coming soon &middot; type to chat, Pamiot talks back
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center w-full max-w-[640px]"
            >
              {/* Status pill */}
              <div className="h-6 mb-2 flex items-center justify-center text-[11px] tracking-[1.5px] uppercase text-[#FACC15]">
                <AnimatePresence mode="wait">
                  {talkState === "recalling" && (
                    <motion.span
                      key="recalling"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <EqualizerBars active />
                      Pamiot is recalling&hellip;
                    </motion.span>
                  )}
                  {talkState === "talking" && (
                    <motion.button
                      key="talking"
                      type="button"
                      onClick={skip}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <EqualizerBars active />
                      Pamiot is talking &middot; tap to skip
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Caption */}
              <div className="min-h-[72px] mb-6 px-4">
                <p className="font-display text-lg md:text-2xl font-semibold text-fg leading-snug">
                  {displayed}
                  {talkState === "talking" && (
                    <span className="inline-block w-[2px] h-5 bg-fg/60 ml-0.5 align-middle animate-pulse" />
                  )}
                </p>
              </div>

              <PamiotAvatar variant="full" size={180} speaking={isSpeaking} />

              {/* Quick replies */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-7 mb-5">
                {pamiotTopics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleChip(t.id)}
                    className="px-4 py-2 rounded-full bg-fg/[0.04] border border-fg/10 text-[12px] text-fg/60 hover:text-fg hover:border-fg/20 transition-all"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-full bg-fg/[0.04] border border-fg/10"
              >
                <span className="text-fg/30 text-sm">&gt;</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Pamiot about Parham&hellip;"
                  className="flex-1 bg-transparent outline-none text-sm text-fg placeholder:text-fg/30"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="w-8 h-8 rounded-full bg-fg text-bg flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                >
                  <FaArrowUp size={12} />
                </button>
              </form>

              {/* Control bar */}
              <div className="flex items-center gap-2 mt-5 p-1.5 rounded-full bg-fg/[0.04] border border-fg/10">
                <button
                  type="button"
                  disabled
                  aria-label="Voice input (coming soon)"
                  data-cursor="Voice input coming soon"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-fg/20 cursor-not-allowed"
                >
                  <PiMicrophoneSlashFill size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Typing mode"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FACC15]/15 text-[#FACC15]"
                >
                  <PiKeyboardFill size={15} />
                </button>
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={voiceEnabled ? "Mute Pamiot's voice" : "Unmute Pamiot's voice"}
                  data-cursor={voiceEnabled ? "Mute Pamiot" : "Unmute Pamiot"}
                  aria-pressed={!voiceEnabled}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-fg/50 hover:text-fg transition-colors"
                >
                  {voiceEnabled ? (
                    <PiSpeakerHighFill size={15} />
                  ) : (
                    <PiSpeakerSlashFill size={15} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTranscript((v) => !v)}
                  aria-label="Toggle transcript"
                  aria-pressed={showTranscript}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    showTranscript ? "bg-fg/10 text-fg" : "text-fg/50 hover:text-fg"
                  }`}
                >
                  <PiListBulletsFill size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleEnd}
                  className="px-4 h-9 rounded-full bg-fg/[0.06] text-[12px] text-fg/70 hover:text-fg hover:bg-fg/10 transition-all"
                >
                  End
                </button>
              </div>

              {/* Transcript */}
              <AnimatePresence>
                {showTranscript && history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full mt-6 overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto text-left px-2">
                      {history.map((turn, i) => (
                        <div key={i} className="text-[13px]">
                          <div className="text-fg/40 mb-0.5">You asked</div>
                          <div className="text-fg/80 mb-1.5">{turn.question}</div>
                          <div className="text-fg/40 mb-0.5">Pamiot</div>
                          <div className="text-fg/70">{turn.answer}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
