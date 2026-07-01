import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createRequesty } from "@requesty/ai-sdk";

const deepseekModel = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const requesty = createRequesty({
  apiKey: process.env.REQUESTY_API_KEY,
});

export const deepseekv31 = openrouter("deepseek/deepseek-v3.2-exp");

export const deepseekR1 = openrouter("deepseek/deepseek-r1-0528");

export const deepseek = deepseekModel("deepseek-chat");

export const deepseekThinking = deepseekModel("deepseek-reasoner");

// Requesty-backed models (https://router.requesty.ai/v1).
// Uses verified live Requesty model ids.
export const requestyDeepseek = requesty("deepseek/deepseek-chat");

export const requestyDeepseekReasoner = requesty("deepseek/deepseek-reasoner");

export const requestyGpt4oMini = requesty("openai/gpt-4o-mini");
