# Chat History API Endpoint

A Next.js API route that retrieves the most recent AI trading decisions and their associated trade operations from the database.

## Capabilities

### Retrieve recent AI trading chat history

Implement a GET endpoint at `/api/model/chat` that:

- Queries the database for the last 10 `Chat` records belonging to the `Deepseek` model
- Orders results by creation time descending (most recent first)
- Includes associated `Trading` records (up to 10 per chat entry, ordered by creation time descending)
- Returns the results wrapped in a JSON response object under a `data` key

Each chat record in the response includes: `id`, `model`, `chat`, `reasoning`, `userPrompt`, `tradings` (array), `createdAt`, `updatedAt`.

Each trading record in the `tradings` array includes: `id`, `symbol`, `opeartion`, `leverage`, `amount`, `pricing`, `stopLoss`, `takeProfit`, `chatId`, `createdAt`, `updatedAt`.

- A GET request to the endpoint returns a 200 response with a JSON body containing a `data` array [@test](./tests/returns-data-array.test.ts)
- The `data` array contains at most 10 items [@test](./tests/max-ten-items.test.ts)
- Each item in `data` has a `tradings` array property [@test](./tests/has-tradings.test.ts)
- Items in `data` are ordered by `createdAt` descending [@test](./tests/ordered-by-date.test.ts)

## Implementation

[@generates](./src/app/api/model/chat/route.ts)

## API

```typescript { #api }
// GET /api/model/chat
// Response: { data: ChatRecord[] }
export interface ChatRecord {
  id: string;
  model: string;
  chat: string;
  reasoning: string;
  userPrompt: string;
  tradings: TradingRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TradingRecord {
  id: string;
  symbol: string;
  opeartion: string;
  leverage: number | null;
  amount: number | null;
  pricing: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the Prisma client singleton and the Chat/Trading database models used to query AI trading history, as well as the ModelType enum where `"Deepseek"` is the primary trading model.

[@satisfied-by](open-nof1.ai)
