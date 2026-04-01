# open-nof1.ai

open-nof1.ai is an open-source AI-powered cryptocurrency trading benchmark platform that implements nof1.ai's Alpha Arena concept. AI models (primarily DeepSeek R1) are given an initial capital allocation and autonomously trade cryptocurrency perpetual contracts on Binance Futures. The platform provides a real-time Next.js dashboard with live prices, account performance charts, AI chain-of-thought transparency, and full trade history.

## Package Information

- **Package Name**: open-nof1.ai
- **Package Type**: GitHub Application
- **Language**: TypeScript
- **Runtime**: Bun / Node.js
- **Framework**: Next.js 15
- **Setup**: `git clone https://github.com/SnowingFox/open-nof1.ai && cd open-nof1.ai && bun install`

## Core Imports

```typescript
// AI module
import { deepseekR1, deepseek, deepseekThinking, deepseekv31 } from "@/lib/ai/model";
import { run } from "@/lib/ai/run";
import { tradingPrompt, generateUserPrompt } from "@/lib/ai/prompt";

// Trading module
import { binance } from "@/lib/trading/binance";
import { getCurrentMarketState, formatMarketState } from "@/lib/trading/current-market-state";
import { getAccountInformationAndPerformance, formatAccountPerformance } from "@/lib/trading/account-information-and-performance";
import { buy } from "@/lib/trading/buy";
import { sell } from "@/lib/trading/sell";

// Database
import { prisma } from "@/lib/prisma";

// Utilities
import { cn } from "@/lib/utils";
import { ArcticonsDeepseek } from "@/lib/icons";
```

## Basic Usage

```typescript
// Execute AI trading cycle
import { run } from "@/lib/ai/run";

const initialCapital = parseFloat(process.env.START_MONEY!);
await run(initialCapital);
```

```typescript
// Fetch market state for BTC/USDT
import { getCurrentMarketState, formatMarketState } from "@/lib/trading/current-market-state";

const state = await getCurrentMarketState("BTC/USDT");
console.log(formatMarketState(state));
```

## Environment Variables

Required environment variables for operation:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_URL` | Yes | Public URL of the deployed application |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek AI API key |
| `OPENROUTER_API_KEY` | No | OpenRouter API key (for R1/V3.1 models) |
| `EXA_API_KEY` | No | Exa search API key for market research |
| `BINANCE_API_KEY` | Yes | Binance Futures API key |
| `BINANCE_API_SECRET` | Yes | Binance Futures API secret |
| `BINANCE_USE_SANDBOX` | No | `"true"` to use Binance testnet/sandbox |
| `START_MONEY` | Yes | Initial capital in USDT (e.g., `"1000"`) |
| `CRON_SECRET_KEY` | Yes | Secret for JWT authentication of cron endpoints |

## Setup & Initialization

```bash
# Install dependencies
bun install

# Generate Prisma client and run migrations
bunx prisma generate
bunx prisma migrate dev

# Start development server
bun run dev

# Start cron job runner (separate process)
bun run cron.ts
```

## Architecture

open-nof1.ai is organized into several key layers:

- **Next.js App Router**: HTTP API routes under `app/api/` and UI pages under `app/`
- **AI Layer** (`lib/ai/`): Model instances, trading prompts, and main trading execution loop
- **Trading Layer** (`lib/trading/`): Binance exchange client, market data, account management
- **Database Layer** (`lib/prisma.ts`): Singleton Prisma client for PostgreSQL persistence
- **Cron Scheduler** (`cron.ts`): Standalone process for automated metrics and trading intervals
- **Frontend** (`components/`, `app/page.tsx`): Real-time React dashboard

## Capabilities

### AI Trading Execution

The core AI trading loop that fetches market data, queries DeepSeek models, and executes trading decisions.

```typescript { .api }
/**
 * Executes one AI trading cycle: fetches market state, queries DeepSeek,
 * stores decision in DB, and executes trade on Binance.
 * @param initialCapital - Starting capital in USDT for return calculation
 */
async function run(initialCapital: number): Promise<void>;
```

[AI Trading](./ai-trading.md)

### Market Data

Fetches real-time cryptocurrency market state including technical indicators from Binance Futures.

```typescript { .api }
/**
 * Fetches current market state with technical indicators for a trading pair.
 * @param symbol - Binance Futures symbol, e.g. "BTC/USDT:USDT"
 * @returns Comprehensive market state including OHLCV, EMA, MACD, RSI, ATR, open interest, funding rate
 */
async function getCurrentMarketState(symbol: string): Promise<MarketState>;

/**
 * Formats a MarketState object as a human-readable string for AI prompts.
 */
function formatMarketState(state: MarketState): string;

interface MarketState {
  current_price: number;
  current_ema20: number;
  current_macd: number;
  current_rsi: number;
  open_interest: { latest: number; average: number };
  funding_rate: number;
  intraday: {
    mid_prices: number[];
    ema_20: number[];
    macd: number[];
    rsi_7: number[];
    rsi_14: number[];
  };
  longer_term: {
    ema_20: number;
    ema_50: number;
    atr_3: number;
    atr_14: number;
    current_volume: number;
    average_volume: number;
    macd: number[];
    rsi_14: number[];
  };
}
```

[Market Data](./market-data.md)

### Account & Performance

Retrieves account balance, open positions, and performance metrics from Binance Futures.

```typescript { .api }
/**
 * Fetches account state and computes performance metrics.
 * @param initialCapital - Initial USDT capital for return/Sharpe calculation
 */
async function getAccountInformationAndPerformance(
  initialCapital: number
): Promise<AccountInformationAndPerformance>;

/**
 * Formats account performance as a human-readable string for AI prompts.
 */
function formatAccountPerformance(
  accountPerformance: AccountInformationAndPerformance
): string;

interface AccountInformationAndPerformance {
  currentPositionsValue: number;
  contractValue: number;
  totalCashValue: number;
  availableCash: number;
  currentTotalReturn: number;
  positions: Position[];
  sharpeRatio: number;
}

// Position is ccxt.Position — key fields used by this application:
interface Position {
  symbol: string;
  side: string;
  contracts: number;       // Position size in contracts
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  unrealizedPnl: number;
  leverage: number;
  notional: number;        // Notional value in USDT
  stopLossPrice: number;
  takeProfitPrice: number;
}
```

[Account & Performance](./account-performance.md)

### HTTP API Endpoints

REST API routes for metrics, pricing, cron execution, and chat history.

```typescript { .api }
// GET /api/metrics
// Returns sampled account metrics (max 50 data points)
// Response: { data: { metrics: MetricData[], totalCount: number, model: ModelType, name: string, createdAt: string, updatedAt: string }, success: boolean }

// GET /api/metric
// Returns sampled account metrics with current BTC pricing
// Response: { data: { metrics: MetricData[], totalCount: number, model: ModelType, name: string, createdAt: string, updatedAt: string, pricing: { btc: MarketState } }, message: string, success: boolean }

// GET /api/pricing
// Returns current prices for BTC, ETH, SOL, DOGE, BNB
// Response: { data: { pricing: { btc: MarketState, eth: MarketState, sol: MarketState, doge: MarketState, bnb: MarketState } }, success: boolean }

// GET /api/model/chat
// Returns up to 10 most recent AI chat records with trading decisions
// Response: { data: Chat[] }

// GET /api/cron/20-seconds-metrics-interval?token={JWT}
// Triggers metrics collection (cron-authenticated)

// GET /api/cron/3-minutes-run-interval?token={JWT}
// Triggers AI trading execution cycle (cron-authenticated)
```

[API Endpoints](./api-endpoints.md)

### Database Models

PostgreSQL database models via Prisma for storing metrics, AI chat history, and trading decisions.

```typescript { .api }
// Prisma singleton
import { prisma } from "@/lib/prisma";
// prisma: PrismaClient
```

[Database Models](./database-models.md)

### React Components

Frontend UI components for the real-time trading dashboard.

```typescript { .api }
import { MetricsChart } from "@/components/metrics-chart";
import { ModelsView } from "@/components/models-view";
import { CryptoCard } from "@/components/crypto-card";
import { AnimatedNumber } from "@/components/animated-number";
```

[React Components](./components.md)

### Cron Scheduler

Standalone process (`cron.ts`) for automated metric collection and trading execution.

```typescript { .api }
// Run standalone: bun run cron.ts
// Schedules:
//   - Metrics collection: every 10 seconds
//   - AI trading execution: every 3 minutes (also runs once on startup)
```

[Cron Scheduler](./cron-scheduler.md)

## Types

```typescript { .api }
interface MetricData {
  positions: Position[];
  sharpeRatio: number | null;
  availableCash: number;
  contractValue: number;
  totalCashValue: number;
  currentTotalReturn: number | null;
  currentPositionsValue: number;
  createdAt: string;
}

type ModelType = "Deepseek" | "DeepseekThinking" | "Qwen" | "Doubao";

type CryptoPricing = {
  btc: MarketState;
  eth: MarketState;
  sol: MarketState;
  doge: MarketState;
  bnb: MarketState;
};
```
