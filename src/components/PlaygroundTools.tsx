"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaPaintBrush, FaFillDrip, FaSearchPlus, FaHome } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

type Tool = "brush" | "color" | "zoom" | null;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ZoomStyle {
  scale: number;
  originX: number;
  originY: number;
}

const PALETTE = ["#6366f1", "#a855f7", "#3b82f6", "#8b5cf6", "#4f46e5"];
const MAX_ZOOM_SCALE = 3;
const REST_ZOOM: ZoomStyle = { scale: 1, originX: 50, originY: 50 };

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isPointInElement(id: string, x: number, y: number) {
  const el = document.getElementById(id);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

const TOOLS: { id: Exclude<Tool, null>; icon: typeof FaPaintBrush; label: string; cursor: string }[] = [
  { id: "brush", icon: FaPaintBrush, label: "Brush", cursor: "It's brush" },
  { id: "color", icon: FaFillDrip, label: "Color", cursor: "It's color" },
  { id: "zoom", icon: FaSearchPlus, label: "Zoom lens", cursor: "It's zoom" },
];

export default function PlaygroundTools({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [zoomStyle, setZoomStyle] = useState<ZoomStyle>(REST_ZOOM);
  const [dragRect, setDragRect] = useState<Rect | null>(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const resetAll = useCallback(() => {
    setActiveTool(null);
    setZoomStyle(REST_ZOOM);
    setDragRect(null);
    clearCanvas();
  }, [clearCanvas]);

  // Reset on every route change (covers a hard refresh trivially, since
  // component state starts fresh then too — this also catches client-side
  // navigation so a tool never stays "stuck" active on a new page).
  useEffect(() => {
    resetAll();
  }, [pathname, resetAll]);

  // Keep the canvas sized to the viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Fade the canvas back to transparent so brush/color marks never linger.
  // This only needs to run while a tool is active, plus a short tail after
  // deactivation to finish fading out existing marks — not forever, since
  // an always-on full-viewport fillRect every frame is wasted work (and was
  // the actual source of page-wide jank, including the custom cursor feeling
  // laggy) on every page view regardless of whether the canvas had anything
  // on it at all.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const loop = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(loop);
    };

    const ensureRunning = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
    };
    const stopAndClear = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearCanvas();
    };

    let tailTimeout: ReturnType<typeof setTimeout> | null = null;
    if (activeTool) {
      ensureRunning();
    } else {
      ensureRunning();
      tailTimeout = setTimeout(stopAndClear, 2000);
    }

    return () => {
      if (tailTimeout) clearTimeout(tailTimeout);
    };
  }, [activeTool, clearCanvas]);

  // Safety net: cancel the fade loop if this component ever truly unmounts.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const drawDab = useCallback(
    (x: number, y: number, radius: number, color: string, alpha: number) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, hexToRgba(color, alpha));
      gradient.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    },
    []
  );

  const applyZoom = useCallback((rect: Rect) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(MAX_ZOOM_SCALE, Math.min(vw / rect.w, vh / rect.h));
    const centerXViewport = rect.x + rect.w / 2;
    const centerYViewport = rect.y + rect.h / 2;
    const centerYDocument = window.scrollY + centerYViewport;
    const originX = (centerXViewport / vw) * 100;
    const originY = (centerYDocument / wrapper.scrollHeight) * 100;
    setZoomStyle({ scale, originX, originY });
  }, []);

  const handleToggle = useCallback((tool: Exclude<Tool, null>) => {
    setActiveTool((current) => {
      if (current === tool) {
        if (tool === "zoom") setZoomStyle(REST_ZOOM);
        return null;
      }
      return tool;
    });
  }, []);

  const handleLogoReset = useCallback(() => {
    resetAll();
    router.push("/");
  }, [resetAll, router]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPointInElement("site-logo", e.clientX, e.clientY)) {
      handleLogoReset();
      return;
    }

    if (activeTool === "brush") {
      isPointerDownRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      drawDab(e.clientX, e.clientY, 14, selectedColor, 0.5);
    } else if (activeTool === "color") {
      drawDab(e.clientX, e.clientY, 60, selectedColor, 0.35);
    } else if (activeTool === "zoom") {
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      setDragRect({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeTool === "brush" && isPointerDownRef.current) {
      const last = lastPointRef.current;
      if (last) {
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        const steps = Math.max(1, Math.floor(dist / 6));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          drawDab(
            last.x + (e.clientX - last.x) * t,
            last.y + (e.clientY - last.y) * t,
            12,
            selectedColor,
            0.45
          );
        }
      }
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    } else if (activeTool === "color") {
      drawDab(e.clientX, e.clientY, 10, selectedColor, 0.08);
    } else if (activeTool === "zoom" && dragStartRef.current) {
      const start = dragStartRef.current;
      setDragRect({
        x: Math.min(start.x, e.clientX),
        y: Math.min(start.y, e.clientY),
        w: Math.abs(e.clientX - start.x),
        h: Math.abs(e.clientY - start.y),
      });
    }
  };

  const handlePointerUp = () => {
    if (activeTool === "brush") {
      isPointerDownRef.current = false;
      lastPointRef.current = null;
    } else if (activeTool === "zoom") {
      if (dragRect && dragRect.w > 24 && dragRect.h > 24) {
        applyZoom(dragRect);
      }
      setDragRect(null);
      dragStartRef.current = null;
    }
  };

  const showColorPicker = activeTool === "brush" || activeTool === "color";

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          transform: zoomStyle.scale === 1 ? "none" : `scale(${zoomStyle.scale})`,
          transformOrigin: `${zoomStyle.originX}% ${zoomStyle.originY}%`,
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {children}
      </div>

      <div
        className="fixed inset-0 z-[9998]"
        style={{
          pointerEvents: activeTool ? "auto" : "none",
          cursor: activeTool ? "crosshair" : "auto",
          touchAction: activeTool ? "none" : "auto",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: theme === "day" ? "multiply" : "screen" }}
        />
        {dragRect && (
          <div
            className="absolute border border-fg/50 bg-fg/10 rounded-sm"
            style={{
              left: dragRect.x,
              top: dragRect.y,
              width: dragRect.w,
              height: dragRect.h,
            }}
          />
        )}
      </div>

      {/* Anchored below the nav (top-28) instead of vertically centered —
          see the matching comment in SideDock.tsx for why centering was
          wrong on shorter viewports. */}
      <div className="fixed right-4 md:right-6 top-28 z-[9999] flex flex-row-reverse items-center gap-3">
        <div className="flex flex-col gap-3">
          {TOOLS.map(({ id, icon: Icon, label, cursor }) => {
            const isActive = activeTool === id;
            return (
              <button
                key={id}
                onClick={() => handleToggle(id)}
                aria-label={isActive ? `Deselect ${label}` : `Select ${label}`}
                aria-pressed={isActive}
                data-cursor={cursor}
                className={`w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all ${
                  isActive
                    ? "bg-fg/[0.12] border-fg/30 text-fg"
                    : "bg-fg/[0.03] border-fg/10 text-fg/50 hover:text-fg hover:border-fg/20"
                }`}
              >
                <Icon size={16} />
              </button>
            );
          })}
          {activeTool && (
            <>
              <div className="h-px bg-fg/10 mx-1" />
              <button
                onClick={handleLogoReset}
                aria-label="Reset tools and go home"
                className="w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all bg-fg/[0.03] border-fg/10 text-fg/50 hover:text-fg hover:border-fg/20"
              >
                <FaHome size={16} />
              </button>
            </>
          )}
        </div>

        {showColorPicker && (
          <div className="flex flex-col gap-2 p-2 rounded-2xl bg-fg/[0.05] border border-fg/10 backdrop-blur-xl">
            {PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={`Use color ${color}`}
                aria-pressed={selectedColor === color}
                className={`w-7 h-7 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-2 ring-fg ring-offset-2 ring-offset-bg"
                    : "border border-fg/20 hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
