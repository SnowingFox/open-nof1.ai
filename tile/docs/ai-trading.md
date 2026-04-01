# AI Trading

The AI trading module orchestrates the complete trading cycle: fetching market data, constructing AI prompts, calling DeepSeek models for decisions, and storing results.

## Capabilities

### Trading Execution Loop

```typescript { .api }
/**
 * Executes one complete AI trading cycle.
 * 1. Fetches current BTC/USDT market state (technical indicators)
 * 2. Retrieves account balance and performance from Binance
 * 3. Constructs prompt with market data and account info
 * 4. Calls DeepSeek R1 for structured trading decision
 * 5. Stores chat record and trading decision in database
 *
 * @param initialCapital - Starting capital in USDT (from START_MONEY env var)
 * @returns Promise that resolves when the cycle completes
 * @throws If Binance API or DeepSeek API is unavailable
 */
async function run(initialCapital: number): Promise<void>;
```

**Import**:
```typescript
import { run } from "@/lib/ai/run";
```

**Usage**:
```typescript
const initialCapital = parseFloat(process.env.START_MONEY!);
await run(initialCapital);
```

### AI Model Instances

Pre-configured language model instances for use with Vercel AI SDK (`generateObject`, `streamText`, etc.).

```typescript { .api }
/**
 * DeepSeek R1 0528 via OpenRouter — primary trading model
 * Model ID: deepseek/deepseek-r1-0528
 */
const deepseekR1: LanguageModelV1;

/**
 * DeepSeek V3.2 experimental via OpenRouter
 * Model ID: deepseek/deepseek-v3.2-exp
 */
const deepseekv31: LanguageModelV1;

/**
 * DeepSeek chat model via native DeepSeek provider
 * Model ID: deepseek-chat
 */
const deepseek: LanguageModelV1;

/**
 * DeepSeek reasoner model via native DeepSeek provider
 * Model ID: deepseek-reasoner
 */
const deepseekThinking: LanguageModelV1;
```

**Import**:
```typescript
import { deepseekR1, deepseek, deepseekThinking, deepseekv31 } from "@/lib/ai/model";
```

**Usage** (with Vercel AI SDK):
```typescript
import { generateObject } from "ai";
import { deepseekR1 } from "@/lib/ai/model";
import { z } from "zod";

const { object } = await generateObject({
  model: deepseekR1,
  schema: z.object({
    opeartion: z.enum(["Buy", "Sell", "Hold"]),
    chat: z.string(),
  }),
  system: tradingPrompt,
  prompt: userPrompt,
});
```

### Trading Prompts

System and user prompts for AI-driven cryptocurrency trading analysis.

```typescript { .api }
/**
 * System-level prompt instructing the AI on cryptocurrency trading analysis.
 * Contains instructions for market analysis, risk management, and decision making.
 */
const tradingPrompt: string;

/**
 * Generates a contextual user prompt combining current market state and account performance.
 * @param options.currentMarketState - Current market indicators for BTC/USDT
 * @param options.accountInformationAndPerformance - Current account balance and positions
 * @param options.startTime - When the trading session began
 * @param options.invocationCount - Number of trading cycles so far (optional)
 * @returns Formatted string prompt for the AI model
 */
function generateUserPrompt(options: UserPromptOptions): string;

interface UserPromptOptions {
  currentMarketState: MarketState;
  accountInformationAndPerformance: AccountInformationAndPerformance;
  startTime: Date;
  invocationCount?: number;
}
```

**Import**:
```typescript
import { tradingPrompt, generateUserPrompt } from "@/lib/ai/prompt";
```

### AI Decision Schema

The structured output schema produced by the AI model during trading execution:

```typescript { .api }
interface TradingDecision {
  /** Trading operation to execute */
  opeartion: "Buy" | "Sell" | "Hold";
  /** Buy parameters — present only when opeartion === "Buy" */
  buy?: {
    pricing: number;    // Target price in USDT
    amount: number;     // Amount in USDT to allocate
    leverage: number;   // Leverage multiplier, range 1-20
  };
  /** Sell parameters — present only when opeartion === "Sell" */
  sell?: {
    percentage: number; // Percentage of position to close, range 0-100
  };
  /** Risk management adjustment — optional for any operation */
  adjustProfit?: {
    stopLoss?: number;   // Stop loss price in USDT
    takeProfit?: number; // Take profit price in USDT
  };
  /** AI reasoning and analysis in natural language */
  chat: string;
}
```

### Exa Search Tool

Market research search client created in `lib/ai/tool.ts`. The instance is created internally but not currently exported.

```typescript { .api }
// lib/ai/tool.ts creates an Exa client instance (not exported):
// const exa = new Exa(process.env.EXA_API_KEY)
// Requires EXA_API_KEY environment variable.
```
