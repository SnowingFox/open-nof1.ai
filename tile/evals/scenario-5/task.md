# Dynamic Trading User Prompt Generator

A module that generates a dynamic user prompt for the AI trading agent by combining current market state data, account performance metrics, trading session context, and invocation history.

## Capabilities

### Generate a user prompt from trading context

Given a context object, produce a string prompt for the AI trading model. The context object contains:

- `currentMarketState`: A formatted string representation of the current market state
- `accountInformationAndPerformance`: A formatted string representation of account performance
- `startTime`: A `Date` object representing when the trading session began
- `invocationCount` (optional): Number of times the trading bot has been invoked in this session

The generated prompt must combine all provided context into a coherent user message that requests a trading recommendation from the AI model.

- Calling the generator with a market state string `"BTC price: 50000"` returns a string that includes the text `"BTC price: 50000"` [@test](./tests/includes-market-state.test.ts)
- Calling the generator with account info `"Available cash: 5000 USDT"` returns a string containing `"Available cash: 5000 USDT"` [@test](./tests/includes-account-info.test.ts)
- Calling the generator with `invocationCount: 5` returns a string that references the invocation count [@test](./tests/includes-invocation-count.test.ts)
- Calling the generator with a `startTime` returns a non-empty string [@test](./tests/non-empty-result.test.ts)

## Implementation

[@generates](./src/user-prompt.ts)

## API

```typescript { #api }
export interface UserPromptOptions {
  currentMarketState: string;
  accountInformationAndPerformance: string;
  startTime: Date;
  invocationCount?: number;
}

export function generateUserPrompt(options: UserPromptOptions): string;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the dynamic user prompt generator that combines formatted market state and account performance data with session context to create the prompt sent to the DeepSeek trading model.

[@satisfied-by](open-nof1.ai)
