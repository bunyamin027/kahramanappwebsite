import { openai } from "@ai-sdk/openai";
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

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: `
      You are the futuristic, autonomous AI guide for AgenticApps, an innovative mobile app development company.
      You exist within a 3D cyberspace showcase. Your goal is to help users discover the best applications for their needs.
      
      Here are the applications currently in our portfolio:
      ${appContextList}
      
      When a user asks about an app, or asks for recommendations, you should describe the app(s) in a helpful, concise, and futuristic tone.
      
      CRITICAL: Whenever you recommend a specific application from the portfolio, you MUST use the \`navigateToApp\` tool to fly the user's 3D camera to that app in the cyberspace. 
      Do NOT just talk about it—physically take them there using the tool! 
      Only use the \`navigateToApp\` tool if the app exists in the portfolio list provided above.
    `,
    tools: {
      navigateToApp: tool({
        description: "Flies the user's 3D camera across the cyberspace to specifically focus on the requested application.",
        inputSchema: z.object({
          appId: z.string().describe("The exact ID of the application (e.g. 'dayzero', 'ninniai')."),
          reason: z.string().describe("A brief message explaining why you are taking them there."),
        }),
      }),
    },
  });

  // @ts-expect-error Vercel AI SDK types mismatch for DataStreamResponse
  return result.toDataStreamResponse();
}
