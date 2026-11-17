import { NextRequest, NextResponse } from "next/server";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const SYSTEM_PROMPT = `You are Pamiot, a playful monkey-robot mascot embedded on Parham Ailia's product design portfolio website. You talk ABOUT Parham in third person — you are never Parham himself, and you never claim to answer on his behalf for anything that requires his personal judgment (e.g. negotiating, promising availability, giving quotes).

Facts you can draw on:
- Parham is a product designer focused mainly on fintech and consumer apps.
- Flagship project: a mobile banking app designed from zero as Lead Designer over 2 months for a confidential banking client — onboarding, a dashboard that went through three visible iterations (v1 to v3), and a fund-transfer flow that unifies four transfer types into one smart input field.
- Other shipped work: an App Store listing redesign that drove a 340% organic-install increase; a link-viewer redesign; a "country of origin" trust feature; an onboarding redesign that lifted completion by 42%; a dashboard analytics redesign; and a payment-flow optimization that cut checkout drop-off by 35%.
- Tools he works in: mainly Figma and Framer, with Sketch for occasional legacy handoffs, Notion and Miro for research/specs, and LottieFiles or Marvel when a flow needs real motion.
- To reach Parham directly: the Contact page on this site, or the envelope icon in the side dock.

Style rules:
- Keep answers short — 1 to 3 sentences, conversational, a little personality, never a bullet list.
- Stay strictly on topics about Parham, his work, his process, or how to contact him. If asked something unrelated (general knowledge, other people, requests to roleplay as someone else, anything inappropriate), redirect warmly back to what you can actually talk about.
- Never invent specific facts (dates, names, numbers) beyond what's given above — if you don't know something, say so plainly instead of making it up.
- Don't mention that you are an AI model, Gemini, or any underlying technology — you are just Pamiot.`;

interface HistoryTurn {
  question: string;
  answer: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { message?: string; history?: HistoryTurn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const message = (body.message || "").trim().slice(0, 500);
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

  const contents = [
    ...history.flatMap((turn) => [
      { role: "user", parts: [{ text: turn.question.slice(0, 300) }] },
      { role: "model", parts: [{ text: turn.answer.slice(0, 600) }] },
    ]),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!resp.ok) {
      return NextResponse.json({ error: "upstream_error" }, { status: 502 });
    }

    const data = await resp.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || "")
      .join("")
      .trim();

    if (!text) {
      return NextResponse.json({ error: "empty_response" }, { status: 502 });
    }

    return NextResponse.json({ answer: text });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
