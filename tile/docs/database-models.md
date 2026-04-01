# Database Models

The application uses PostgreSQL with Prisma ORM. A singleton Prisma client is exported from `lib/prisma.ts`.

## Prisma Client

```typescript { .api }
/**
 * PrismaClient instance for PostgreSQL.
 * Requires DATABASE_URL environment variable.
 */
const prisma: PrismaClient;
```

**Import**:
```typescript
import { prisma } from "@/lib/prisma";
```

**Usage**:
```typescript
import { prisma } from "@/lib/prisma";

// Query metrics
const metrics = await prisma.metrics.findFirst({
  orderBy: { createdAt: "desc" }
});

// Query chat history with trades
const chats = await prisma.chat.findMany({
  include: { tradings: true },
  orderBy: { createdAt: "desc" },
  take: 10
});
```

## Models

### Metrics

Stores periodic snapshots of account performance metrics (collected every 10-20 seconds by cron).

```typescript { .api }
interface MetricsRecord {
  id: string;           // UUID primary key
  name: string;         // Session identifier name
  model: ModelType;     // AI model used for trading
  metrics: Json[];      // Array of MetricData JSON objects
  createdAt: Date;      // Record creation timestamp
  updatedAt: Date;      // Last update timestamp
}

// Prisma operations
prisma.metrics.findFirst(args?)
prisma.metrics.findMany(args?)
prisma.metrics.create(args)
prisma.metrics.update(args)
prisma.metrics.upsert(args)
prisma.metrics.delete(args)
```

The `metrics` field stores an array of `MetricData` objects:

```typescript
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
```

### Chat

Stores AI model chat records including reasoning, user prompts, and associated trading decisions.

```typescript { .api }
interface ChatRecord {
  id: string;           // UUID primary key
  model: ModelType;     // AI model that generated this response (default: Deepseek)
  chat: string;         // AI analysis text (default: "<no chat>")
  reasoning: string;    // AI chain-of-thought reasoning
  userPrompt: string;   // The user prompt sent to the model
  tradings: Trading[];  // Associated trading decisions (one-to-many)
  createdAt: Date;
  updatedAt: Date;
}

// Prisma operations
prisma.chat.findFirst(args?)
prisma.chat.findMany(args?)
prisma.chat.create(args)
prisma.chat.update(args)
prisma.chat.delete(args)
```

**Example query**:
```typescript
const recentChats = await prisma.chat.findMany({
  include: { tradings: true },
  orderBy: { createdAt: "desc" },
  take: 10
});
```

### Trading

Stores individual trading decisions associated with AI chat records.

```typescript { .api }
interface TradingRecord {
  id: string;             // UUID primary key
  symbol: Symbol;         // Traded cryptocurrency symbol
  /** Note: field name is intentionally misspelled ("opeartion") in the schema */
  opeartion: Opeartion;   // Trading operation: Buy, Sell, or Hold
  leverage?: number;      // Leverage multiplier (1-20), null for Hold
  amount?: number;        // Position size in USDT, null for Sell/Hold
  pricing?: number;       // Target price in USDT
  stopLoss?: number;      // Stop loss price in USDT
  takeProfit?: number;    // Take profit price in USDT
  createdAt: Date;
  updatedAt: Date;
  Chat?: ChatRecord;      // Parent chat record (optional)
  chatId?: string;        // Foreign key to Chat (onDelete: Cascade)
}

// Prisma operations
prisma.trading.findFirst(args?)
prisma.trading.findMany(args?)
prisma.trading.create(args)
prisma.trading.update(args)
prisma.trading.delete(args)
```

## Enums

```typescript { .api }
/** Trading operation type (note: intentional typo "opeartion" matches DB schema) */
enum Opeartion {
  Buy  = "Buy",
  Sell = "Sell",
  Hold = "Hold"
}

/** Supported cryptocurrency symbols */
enum Symbol {
  BTC  = "BTC",
  ETH  = "ETH",
  BNB  = "BNB",
  SOL  = "SOL",
  DOGE = "DOGE"
}

/** AI model type identifiers */
enum ModelType {
  Deepseek         = "Deepseek",
  DeepseekThinking = "DeepseekThinking",
  Qwen             = "Qwen",
  Doubao           = "Doubao"
}
```

## Schema Migrations

```bash
# Apply migrations
bunx prisma migrate dev

# Generate Prisma client after schema changes
bunx prisma generate

# Open Prisma Studio (DB browser)
bunx prisma studio
```
