# Intraday Technical Analysis Module

A module that computes intraday (1-minute timeframe) technical indicators for cryptocurrency trading from OHLCV data fetched from the Binance perpetual futures exchange.

## Capabilities

### Compute EMA-20 series for intraday data

From 1-minute OHLCV candle data (last 100 candles), compute the EMA-20 series and return the most recent 10 values as an array.

- Computing EMA-20 from a 1-minute candle series returns an array of exactly 10 numbers [@test](./tests/ema-series-length.test.ts)
- Each value in the EMA-20 array is a finite positive number [@test](./tests/ema-positive.test.ts)

### Compute MACD for intraday data

From 1-minute OHLCV data, compute the MACD (Moving Average Convergence Divergence) indicator series and return the most recent 10 values.

- The MACD array returned has exactly 10 elements [@test](./tests/macd-length.test.ts)
- MACD values can be positive or negative finite numbers [@test](./tests/macd-finite.test.ts)

### Compute RSI-7 and RSI-14 for intraday data

From 1-minute OHLCV data, compute both the 7-period and 14-period RSI series and return the most recent 10 values of each.

- The RSI-7 array has 10 elements, all between 0 and 100 [@test](./tests/rsi7-range.test.ts)
- The RSI-14 array has 10 elements, all between 0 and 100 [@test](./tests/rsi14-range.test.ts)

### Compute mid-prices array

From 1-minute OHLCV data, derive mid-prices (average of high and low for each candle) for the most recent 10 candles.

- Mid-prices array has exactly 10 elements [@test](./tests/midprices-length.test.ts)
- Each mid-price is the average of the candle's high and low prices [@test](./tests/midprices-value.test.ts)

## Implementation

[@generates](./src/intraday-indicators.ts)

## API

```typescript { #api }
export interface IntradayIndicators {
  mid_prices: number[];
  ema_20: number[];
  macd: number[];
  rsi_7: number[];
  rsi_14: number[];
}

export function computeIntradayIndicators(symbol: string): Promise<IntradayIndicators>;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the intraday technical indicator computation logic using 1-minute OHLCV data from the Binance perpetual futures exchange, including EMA, MACD, and RSI calculations via the technicalindicators library.

[@satisfied-by](open-nof1.ai)
