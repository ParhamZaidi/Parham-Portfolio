import { NextRequest, NextResponse } from "next/server";

const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts";
// Prebuilt Gemini voices worth trying for a friendly male tone:
// "Puck" (upbeat), "Charon" (deep/informative), "Orus" (firm), "Fenrir" (excitable).
const TTS_VOICE = process.env.GEMINI_TTS_VOICE || "Puck";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const text = (body.text || "").trim().slice(0, 1000);
  if (!text) {
    return NextResponse.json({ error: "empty_text" }, { status: 400 });
  }

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Say in a warm, friendly, upbeat voice: ${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } },
            },
          },
        }),
      }
    );

    if (!resp.ok) {
      return NextResponse.json({ error: "upstream_error" }, { status: 502 });
    }

    const data = await resp.json();
    const part = data?.candidates?.[0]?.content?.parts?.[0];
    const audioB64: string | undefined = part?.inlineData?.data;
    const mimeType: string = part?.inlineData?.mimeType || "";

    if (!audioB64) {
      return NextResponse.json({ error: "empty_audio" }, { status: 502 });
    }

    const rateMatch = mimeType.match(/rate=(\d+)/);
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

    // Newer TTS models return a proper WAV container (mimeType "audio/wav"),
    // which decodeAudioData can handle directly; older ones returned raw
    // PCM samples with no container, needing the manual path on the client.
    const isRawPcm = mimeType.startsWith("audio/L16");

    return NextResponse.json({ audio: audioB64, sampleRate, isRawPcm });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
