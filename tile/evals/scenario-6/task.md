# AI Trading Decision Runner

A module that executes a complete AI trading decision cycle: fetches market data, generates prompts, queries the AI model with structured output, and persists the resulting trading decision to the database.

## Capabilities

### Execute a full AI trading decision cycle

Given an initial capital amount, perform the complete trading pipeline:

1. Fetch current market state for the primary trading symbol
2. Fetch current account information and performance metrics
3. Generate the user prompt from market state and account data
4. Call the DeepSeek reasoning model with structured output schema
5. Persist the trading decision to the database as a `Chat` record with associated `Trading` records
6. Return the structured decision

The structured decision includes:
- `opeartion`: One of `"Buy"`, `"Sell"`, or `"Hold"`
- `buy` (optional): An object with `pricing` (entry price), `amount` (USDT), and `leverage` (integer 1-20)
- `sell` (optional): An object with `percentage` (0-100, fraction of position to sell)
- `adjustProfit` (optional): An object with `stopLoss` and `takeProfit` price levels
- `chat`: A string explanation of the trading decision

- Calling the execution function with `10000` saves a new Chat record to the database [@test](./tests/saves-chat-record.test.ts)
- When the AI returns a Buy decision, `buy.leverage` is clamped between 1 and 20 [@test](./tests/leverage-range.test.ts)
- When the AI returns a Sell decision, `sell.percentage` is between 0 and 100 [@test](./tests/sell-percentage.test.ts)
- The resulting Chat record has a non-empty `chat` field containing the AI's reasoning [@test](./tests/chat-reasoning.test.ts)

## Implementation

[@generates](./src/trading-runner.ts)

## API

```typescript { #api }
export type TradingOperation = "Buy" | "Sell" | "Hold";

export interface TradingDecision {
  opeartion: TradingOperation;
  buy?: { pricing: number; amount: number; leverage: number };
  sell?: { percentage: number };
  adjustProfit?: { stopLoss: number; takeProfit: number };
  chat: string;
}

export function executeTradingCycle(initialCapital: number): Promise<TradingDecision>;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the full AI trading decision execution pipeline, including market state fetching, account performance retrieval, DeepSeek model invocation with Zod-validated structured output, and Prisma database persistence of Chat and Trading records.

[@satisfied-by](open-nof1.ai)
