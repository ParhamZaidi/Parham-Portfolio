"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080808]">
      {/* Blob 1 — indigo */}
      <div
        className="absolute top-[10%] left-[5%] w-[650px] h-[650px] rounded-full animate-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Blob 2 — purple */}
      <div
        className="absolute top-[25%] right-[10%] w-[600px] h-[600px] rounded-full animate-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Blob 3 — blue */}
      <div
        className="absolute bottom-[5%] left-[25%] w-[700px] h-[700px] rounded-full animate-drift-3"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.26) 0%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Blob 4 — violet */}
      <div
        className="absolute top-[45%] left-[45%] w-[600px] h-[600px] rounded-full animate-drift-4"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Blob 5 — royal blue */}
      <div
        className="absolute bottom-[15%] right-[20%] w-[600px] h-[600px] rounded-full animate-drift-5"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
