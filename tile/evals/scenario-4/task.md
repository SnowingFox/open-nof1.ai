# AI Trading Agent System Prompt

A module that exports a static system prompt string for configuring an AI model as an expert cryptocurrency trading analyst.

## Capabilities

### Export a static trading system prompt

Export a string constant that serves as the system prompt for the AI trading agent. The prompt must:

- Instruct the model to act as an expert cryptocurrency trading analyst
- Guide the model to use technical analysis (RSI, MACD, moving averages, support/resistance levels)
- Guide the model to use fundamental analysis considerations
- Include risk assessment and position sizing guidelines
- Require the model's output to include a formatted recommendation in the pattern `**RECOMMENDATION: [BUY/SELL/HOLD]**`
- Require specification of target entry price, stop loss, and take profit targets
- Require a position size suggestion and risk level assessment

- The exported value is a non-empty string [@test](./tests/prompt-non-empty.test.ts)
- The prompt string contains the text `RECOMMENDATION` [@test](./tests/prompt-recommendation.test.ts)
- The prompt string contains references to risk assessment or risk management [@test](./tests/prompt-risk.test.ts)
- The prompt string contains references to both technical and fundamental analysis [@test](./tests/prompt-analysis.test.ts)

## Implementation

[@generates](./src/trading-prompt.ts)

## API

```typescript { #api }
export const tradingSystemPrompt: string;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the trading system prompt string used to configure the DeepSeek AI model as a cryptocurrency trading analyst, including all required output format specifications.

[@satisfied-by](open-nof1.ai)
