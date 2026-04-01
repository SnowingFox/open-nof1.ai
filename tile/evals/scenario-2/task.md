# Account Performance Retrieval Module

A module that retrieves live account information and performance metrics from the Binance perpetual futures exchange, including position data, cash balances, return on investment, and risk-adjusted return.

## Capabilities

### Fetch account information and performance metrics

Given an initial capital amount in USDT, retrieve a structured account performance object containing:

- `currentPositionsValue`: Sum of initial margin and unrealized PnL across open positions
- `contractValue`: Total number of contracts currently held
- `totalCashValue`: Total USDT balance in the futures account
- `availableCash`: Free USDT available for trading
- `currentTotalReturn`: Return on investment as a percentage relative to initial capital
- `positions`: Array of current open position objects from CCXT
- `sharpeRatio`: Risk-adjusted return metric (number or null if insufficient history)

- Calling the account fetch function with `10000` as initial capital returns an object with a numeric `totalCashValue` [@test](./tests/total-cash.test.ts)
- The returned object has an `availableCash` field that is a non-negative number [@test](./tests/available-cash.test.ts)
- The `positions` field is an array (may be empty if no open positions) [@test](./tests/positions-array.test.ts)
- `currentTotalReturn` is computed as `((totalCashValue - initialCapital) / initialCapital) * 100` [@test](./tests/total-return-formula.test.ts)

## Implementation

[@generates](./src/account-performance.ts)

## API

```typescript { #api }
export interface AccountInformationAndPerformance {
  currentPositionsValue: number;
  contractValue: number;
  totalCashValue: number;
  availableCash: number;
  currentTotalReturn: number | null;
  positions: object[];
  sharpeRatio: number | null;
}

export function fetchAccountPerformance(initialCapital: number): Promise<AccountInformationAndPerformance>;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the account information retrieval logic including Binance futures account balance queries, position data retrieval via CCXT, and Sharpe ratio computation from historical metrics stored in the database.

[@satisfied-by](open-nof1.ai)
