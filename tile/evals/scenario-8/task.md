# Multi-Asset Cryptocurrency Pricing API

A Next.js API route that fetches and returns current market state data for all supported cryptocurrency assets in parallel.

## Capabilities

### Fetch market state for all supported assets simultaneously

Implement a GET endpoint at `/api/pricing` that:

- Fetches market state for all 5 supported cryptocurrency perpetual futures pairs in parallel: BTC, ETH, SOL, DOGE, and BNB
- Returns a JSON response with a `data.pricing` object where each key is a lowercase symbol name mapping to its full `MarketState`
- Returns a `success: true` field in the response on success

The response structure:
```json
{
  "data": {
    "pricing": {
      "btc": { ...MarketState },
      "eth": { ...MarketState },
      "sol": { ...MarketState },
      "doge": { ...MarketState },
      "bnb": { ...MarketState }
    }
  },
  "success": true
}
```

- A GET request returns a JSON response with `success: true` [@test](./tests/success-flag.test.ts)
- The response `data.pricing` object has exactly 5 keys: `btc`, `eth`, `sol`, `doge`, `bnb` [@test](./tests/five-assets.test.ts)
- Each asset's market state includes a numeric `current_price` [@test](./tests/has-prices.test.ts)
- All 5 assets are fetched concurrently (not sequentially) using `Promise.all` [@test](./tests/concurrent-fetch.test.ts)

## Implementation

[@generates](./src/app/api/pricing/route.ts)

## API

```typescript { #api }
// GET /api/pricing
// Response: { data: { pricing: Record<string, MarketState> }, success: boolean }
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the market state fetching function and the set of supported trading symbols (BTC/USDT:USDT, ETH/USDT:USDT, SOL/USDT:USDT, DOGE/USDT:USDT, BNB/USDT:USDT) for the Binance perpetual futures exchange.

[@satisfied-by](open-nof1.ai)
