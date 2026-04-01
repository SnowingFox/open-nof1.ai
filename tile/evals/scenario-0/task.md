# Cryptocurrency Market State Fetcher

A utility that retrieves comprehensive market state data for a given cryptocurrency trading pair from the Binance perpetual futures exchange.

## Capabilities

### Fetch full market state for a symbol

Given a cryptocurrency symbol string (e.g. `"BTC/USDT:USDT"`), retrieve a structured market state object that includes:

- `current_price`: The latest market price
- `current_ema20`: The current 20-period Exponential Moving Average
- `current_macd`: The current MACD value
- `current_rsi`: The current 7-period RSI
- `open_interest`: An object with `latest` and `average` open interest values
- `funding_rate`: The current perpetual funding rate
- `intraday`: An object with arrays for `mid_prices`, `ema_20`, `macd`, `rsi_7`, `rsi_14` (1-minute timeframe, last 10 candles)
- `longer_term`: An object with scalars for `ema_20`, `ema_50`, `atr_3`, `atr_14`, `current_volume`, `average_volume`, `macd`, `rsi_14` (4-hour timeframe)

- Calling the fetch function with `"BTC/USDT:USDT"` returns an object with a numeric `current_price` greater than 0 [@test](./tests/btc-price.test.ts)
- Calling the fetch function with `"ETH/USDT:USDT"` returns an object where `intraday.mid_prices` is an array of 10 numbers [@test](./tests/eth-intraday.test.ts)
- Calling the fetch function with `"SOL/USDT:USDT"` returns an object where `longer_term.ema_20` and `longer_term.ema_50` are both finite numbers [@test](./tests/sol-longer-term.test.ts)
- Calling the fetch function with `"BTC/USDT:USDT"` returns `open_interest` with both `latest` and `average` properties as numbers [@test](./tests/btc-open-interest.test.ts)

## Implementation

[@generates](./src/market-state.ts)

## API

```typescript { #api }
export interface MarketState {
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
    macd: number;
    rsi_14: number;
  };
}

export function fetchMarketState(symbol: string): Promise<MarketState>;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the market state retrieval logic, Binance futures integration via CCXT, and technical indicator computation utilities.

[@satisfied-by](open-nof1.ai)
