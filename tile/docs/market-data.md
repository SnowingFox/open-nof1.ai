# Market Data

The market data module fetches real-time cryptocurrency market state from Binance Futures, computing technical indicators (EMA, MACD, RSI, ATR) for use in AI trading decisions. Uses 1-minute candles for intraday data and 4-hour candles for longer-term context.

## Capabilities

### Fetch Market State

```typescript { .api }
/**
 * Fetches OHLCV data from Binance Futures and computes comprehensive technical indicators.
 * Uses both intraday (1-minute candles) and longer-term (1-hour candles) timeframes.
 *
 * @param symbol - Trading pair symbol, e.g. "BTC/USDT"
 *                 Supported: "BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "DOGE/USDT"
 * @returns Promise resolving to comprehensive market state with technical indicators
 * @throws If Binance API is unavailable or the symbol is invalid
 */
async function getCurrentMarketState(symbol: string): Promise<MarketState>;
```

**Import**:
```typescript
import { getCurrentMarketState } from "@/lib/trading/current-market-state";
```

**Usage**:
```typescript
const state = await getCurrentMarketState("BTC/USDT");
console.log(state.current_price);       // e.g. 67500.5
console.log(state.current_rsi);         // e.g. 58.3
console.log(state.funding_rate);        // e.g. 0.0001
```

### Format Market State

```typescript { .api }
/**
 * Formats a MarketState object as a human-readable string suitable for AI prompts.
 *
 * @param state - MarketState object returned by getCurrentMarketState
 * @returns Multi-line string representation of the market state
 */
function formatMarketState(state: MarketState): string;
```

**Import**:
```typescript
import { formatMarketState } from "@/lib/trading/current-market-state";
```

## Types

```typescript { .api }
interface MarketState {
  /** Current mid-price in USDT */
  current_price: number;
  /** Current 20-period EMA from intraday data */
  current_ema20: number;
  /** Current MACD value from intraday data */
  current_macd: number;
  /** Current 7-period RSI from intraday data */
  current_rsi: number;
  /** Open interest from Binance Futures */
  open_interest: {
    latest: number;   // Most recent open interest value
    average: number;  // Average open interest over the period
  };
  /** Current funding rate for the perpetual contract */
  funding_rate: number;
  /** Intraday technical indicator arrays (last 10 values, 1-minute candles) */
  intraday: {
    mid_prices: number[];  // Array of mid-prices
    ema_20: number[];      // 20-period EMA values
    macd: number[];        // MACD histogram values
    rsi_7: number[];       // 7-period RSI values
    rsi_14: number[];      // 14-period RSI values
  };
  /** Longer-term technical indicators (last 10 values, 4-hour candles) */
  longer_term: {
    ema_20: number;          // 20-period EMA (scalar)
    ema_50: number;          // 50-period EMA (scalar)
    atr_3: number;           // 3-period ATR (Average True Range)
    atr_14: number;          // 14-period ATR
    current_volume: number;  // Most recent volume
    average_volume: number;  // Average volume over the period
    macd: number[];          // MACD histogram values array
    rsi_14: number[];        // 14-period RSI values array
  };
}
```

## Binance Client

The CCXT Binance Futures client used internally for all market data and trading operations.

```typescript { .api }
/**
 * Pre-configured CCXT Binance Futures client (defaultType: "future").
 * Automatically uses sandbox/testnet when BINANCE_USE_SANDBOX=true.
 * Requires BINANCE_API_KEY and BINANCE_API_SECRET environment variables.
 */
const binance: ccxt.binance;
```

**Import**:
```typescript
import { binance } from "@/lib/trading/binance";
```

**Usage**:
```typescript
import { binance } from "@/lib/trading/binance";

// Fetch account balance
const balance = await binance.fetchBalance();

// Fetch order book
const orderBook = await binance.fetchOrderBook("BTC/USDT:USDT");

// Create a market order
await binance.createOrder("BTC/USDT:USDT", "market", "buy", 0.001);
```

## Supported Symbols

The application tracks these perpetual contract symbols:

| Symbol Enum | CCXT Symbol | Asset |
|---|---|---|
| BTC | BTC/USDT | Bitcoin |
| ETH | ETH/USDT | Ethereum |
| SOL | SOL/USDT | Solana |
| BNB | BNB/USDT | BNB Chain |
| DOGE | DOGE/USDT | Dogecoin |

## Technical Indicators Reference

The module computes the following indicators using the `technicalindicators` package:

| Indicator | Description | Periods |
|---|---|---|
| EMA | Exponential Moving Average | 20-period (1m candles), 20 & 50-period (4h candles) |
| MACD | Moving Average Convergence Divergence | Standard 12/26/9 (1m and 4h candles) |
| RSI | Relative Strength Index | 7 & 14-period (1m candles), 14-period (4h candles) |
| ATR | Average True Range | 3 & 14-period (4h candles) |
