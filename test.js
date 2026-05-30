import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const freeAI = createOpenAI({
  baseURL: "https://text.pollinations.ai/openai",
  apiKey: "dummy",
});

async function run() {
  const result = await streamText({
    model: freeAI("openai"),
    prompt: "Say hello",
  });
  
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
}
run();
