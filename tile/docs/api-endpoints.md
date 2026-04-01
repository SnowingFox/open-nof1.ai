# HTTP API Endpoints

The application exposes several REST API endpoints via Next.js App Router. All endpoints use GET method and return JSON.

## Endpoints

### GET /api/metrics

Returns sampled account performance metrics (max 50 data points for chart rendering).

```typescript { .api }
// GET /api/metrics
// No parameters required

// Response (200 OK):
interface MetricsResponse {
  data: {
    /** Sampled array of metric data points (max 50 items) */
    metrics: MetricData[];
    /** Total number of metric records in database */
    totalCount: number;
    /** AI model used for trading */
    model: ModelType;
    /** Metrics session name */
    name: string;
    /** Session creation timestamp (ISO string) */
    createdAt: string;
    /** Session last update timestamp (ISO string) */
    updatedAt: string;
  };
  success: boolean;
}
```

**Usage** (from frontend):
```typescript
const response = await fetch("/api/metrics");
const { data, success } = await response.json();
if (success) {
  console.log(data.metrics);    // MetricData[]
  console.log(data.totalCount); // total records
}
```

### GET /api/metric

Returns sampled metrics with current BTC market pricing. Useful for dashboard views needing both chart data and live price.

```typescript { .api }
// GET /api/metric
// No parameters required

// Response (200 OK):
interface MetricWithPricingResponse {
  data: {
    metrics: MetricData[];
    totalCount: number;
    model: ModelType;
    name: string;
    createdAt: string;
    updatedAt: string;
    /** Current BTC market state for reference pricing */
    pricing: {
      btc: MarketState;
    };
  };
  message: string;
  success: boolean;
}
```

### GET /api/pricing

Returns current market state for all tracked cryptocurrencies. Fetches data in parallel from Binance Futures.

```typescript { .api }
// GET /api/pricing
// No parameters required

// Response (200 OK):
interface PricingResponse {
  data: {
    pricing: {
      btc: MarketState;
      eth: MarketState;
      sol: MarketState;
      doge: MarketState;
      bnb: MarketState;
    };
  };
  success: boolean;
}
```

**Usage**:
```typescript
const response = await fetch("/api/pricing");
const { data } = await response.json();
console.log(data.pricing.btc.current_price); // BTC price in USDT
```

### GET /api/model/chat

Returns the 10 most recent AI trading decisions with full chat and reasoning history.

```typescript { .api }
// GET /api/model/chat
// No parameters required

// Response (200 OK):
interface ChatResponse {
  data: Chat[];
}

interface Chat {
  id: string;
  model: ModelType;
  /** AI analysis text response */
  chat: string;
  /** AI chain-of-thought reasoning (from deepseek-reasoner) */
  reasoning: string;
  /** The user prompt that was sent to the AI */
  userPrompt: string;
  /** Associated trading decisions */
  tradings: Trading[];
  createdAt: string;
  updatedAt: string;
}

interface Trading {
  id: string;
  symbol: "BTC" | "ETH" | "BNB" | "SOL" | "DOGE";
  /** Note: field is intentionally misspelled in the schema */
  opeartion: "Buy" | "Sell" | "Hold";
  leverage?: number;
  amount?: number;
  pricing?: number;
  stopLoss?: number;
  takeProfit?: number;
  createdAt: string;
  updatedAt: string;
  chatId?: string;
}
```

### GET /api/cron/20-seconds-metrics-interval

Triggers account metrics collection. Secured with JWT authentication.

```typescript { .api }
// GET /api/cron/20-seconds-metrics-interval?token={JWT}
//
// Query Parameters:
//   token (string, required): JWT signed with CRON_SECRET_KEY
//
// Response: Plain text confirmation message
// Auth Error (401): Returns error text if token is invalid/missing
```

**JWT Generation** (used internally by cron.ts):
```typescript
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { sub: "cron-token" },
  process.env.CRON_SECRET_KEY || ""
);
const url = `${process.env.NEXT_PUBLIC_URL}/api/cron/20-seconds-metrics-interval?token=${token}`;
```

### GET /api/cron/3-minutes-run-interval

Triggers the AI trading execution cycle. Secured with JWT authentication.

```typescript { .api }
// GET /api/cron/3-minutes-run-interval?token={JWT}
//
// Query Parameters:
//   token (string, required): JWT signed with CRON_SECRET_KEY
//
// Response: Plain text confirmation message
// Auth Error: Returns error text if token is invalid/missing
```

## Uniform Sampling Utility

Used internally by cron endpoints to keep metrics arrays bounded:

```typescript { .api }
/**
 * Samples an array to at most maxSize elements using uniform distribution,
 * always including the first and last elements (boundaries).
 *
 * @param data - Array of items to sample
 * @param maxSize - Maximum number of items to keep
 * @returns Sampled array with at most maxSize elements
 */
function uniformSampleWithBoundaries<T>(data: T[], maxSize: number): T[];
```

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
```
