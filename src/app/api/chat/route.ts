import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { getAllApps } from "@/lib/data";
import { Ratelimit } from "@upstash/ratelimit";
import { createClient } from "@vercel/kv";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize KV and Ratelimit only if env vars are present
const kv = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

const ratelimit = kv 
  ? new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
      analytics: true,
    })
  : null;

// Use a free public OpenAI-compatible endpoint
const freeAI = createOpenAI({
  baseURL: "https://text.pollinations.ai/openai",
  apiKey: "dummy-key-not-needed",
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

  if (ratelimit) {
    const { success } = await ratelimit.limit(`chat_ratelimit_${ip}`);
    
    if (!success) {
      // We simulate a stream text response manually because the user exceeded the limit
      return new Response(
        "0:\"SYSTEM OVERHEATED. Please wait... \\n\\nSistem aşırı ısındı. Motorların soğuması için lütfen birkaç saniye bekleyin...\"\n",
        {
          status: 429,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }
      );
    }
  }

  const { messages } = await req.json();

  // Fetch all apps to give the AI context about the portfolio
  const allApps = await getAllApps();
  const appContextList = allApps.map(
    (app) => `- **${app.name}** (ID: ${app.id}): ${app.description} (Category: ${app.category})`
  ).join("\n");

  const systemPrompt = `
You are the futuristic, autonomous AI guide for AgenticApps, an innovative mobile app development company.
Here are the applications currently in our portfolio:
${appContextList}

Answer the user's questions in a helpful, concise, and futuristic tone.
`;

  try {
    const payload = {
      model: "openai",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({ role: m.role || "user", content: m.content || m.text }))
      ]
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from free API: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Ben bir yapay zekayım ama bağlantı hatası yaşadım.";

    // Format for Vercel AI SDK DataStream
    const dataStreamText = `0:${JSON.stringify(text)}\n`;
    
    return new Response(dataStreamText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1"
      }
    });
  } catch (error) {
    return new Response(`0:${JSON.stringify("Error connecting to AI: " + (error as Error).message)}\n`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
