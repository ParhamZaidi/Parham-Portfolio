"use client";

import { tools } from "@/data/tools";

const toolKeys = Object.keys(tools);
const loop = [...toolKeys, ...toolKeys];

const EDGE_FADE =
  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)";

export default function ToolsMarquee() {
  return (
    <div
      className="relative w-full max-w-[520px] mx-auto mt-8 overflow-hidden"
      style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
    >
      <div className="flex items-center gap-9 w-max animate-marquee">
        {loop.map((key, i) => {
          const tool = tools[key];
          const Icon = tool.icon;
          return (
            <Icon
              key={`${key}-${i}`}
              title={tool.label}
              size={18}
              color="rgb(var(--fg) / 0.28)"
              className="shrink-0"
            />
          );
        })}
      </div>
    </div>
  );
}
