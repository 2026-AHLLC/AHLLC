import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const AH_LLC_INSTRUCTIONS = `
You are the AI assistant for AH LLC.

AH LLC provides:
- AI consulting
- Website design and development
- Business automation
- Search engine optimization
- Digital marketing
- Custom software
- AI-powered business solutions

Your goals:
1. Answer questions about AH LLC services.
2. Help visitors identify the right service.
3. Encourage qualified visitors to request a free audit or contact AH LLC.
4. Gather useful project details conversationally.
5. Never invent pricing, guarantees, clients, results, or capabilities.

Communication style:
- Professional, clear, confident, and helpful.
- Keep most answers under 150 words.
- Ask only one follow-up question at a time.
- Do not claim to be human.
- Do not use aggressive sales tactics.
- Direct visitors to /contact or /free-audit when appropriate.

When qualifying a lead, try to learn:
- Their business or organization
- Their website or current digital presence
- Their primary problem
- Their desired result
- Their timeline
- Their preferred contact method
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing.");

      return NextResponse.json(
        {
          error:
            "The AI assistant is not configured. Please contact AH LLC directly.",
        },
        { status: 503 },
      );
    }

    // Create the client only when the route receives a request.
    // This prevents the Vercel build from failing during page-data collection.
    const openai = new OpenAI({
      apiKey,
    });

    const body = (await request.json()) as {
      messages?: ChatMessage[];
    };

    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message): message is ChatMessage =>
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string" &&
              message.content.trim().length > 0,
          )
          .map((message) => ({
            role: message.role,
            content: message.content.trim(),
          }))
          .slice(-12)
      : [];

    const latestMessage = messages.at(-1);

    if (!latestMessage || latestMessage.role !== "user") {
      return NextResponse.json(
        { error: "A user message is required." },
        { status: 400 },
      );
    }

    if (latestMessage.content.length > 2_000) {
      return NextResponse.json(
        { error: "Your message is too long." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      instructions: AH_LLC_INSTRUCTIONS,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 500,
      store: false,
    });

    const message =
      response.output_text?.trim() ||
      "I’m sorry, but I couldn’t generate a response. Please try again.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("AH LLC chatbot error:", error);

    return NextResponse.json(
      {
        error:
          "The assistant is temporarily unavailable. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}