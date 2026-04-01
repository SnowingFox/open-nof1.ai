# Sharpe Ratio Calculator from Trading Metrics

A module that computes a Sharpe ratio from historical account performance metrics stored in the database. The Sharpe ratio measures risk-adjusted return by dividing the mean return by the standard deviation of returns.

## Capabilities

### Compute Sharpe ratio from historical metrics

Using historical `totalCashValue` data points from the Metrics database table (for the Deepseek model), calculate the Sharpe ratio as follows:

1. Fetch the metrics record for the `"Deepseek"` model from the database
2. Extract the `totalCashValue` time series from the stored metrics JSON array
3. Compute sequential returns: `return[i] = (value[i] - value[i-1]) / value[i-1]`
4. Calculate mean return and standard deviation of returns
5. Return `meanReturn / stdDeviation`, or `null` if fewer than 2 data points exist

- Given a metrics array with fewer than 2 data points, the Sharpe ratio returns `null` [@test](./tests/insufficient-data.test.ts)
- Given a metrics array `[{totalCashValue: 10000}, {totalCashValue: 10100}, {totalCashValue: 10200}]`, the computed returns are `[0.01, ~0.0099]` and Sharpe ratio is their mean divided by std deviation [@test](./tests/sharpe-formula.test.ts)
- Given a metrics array where all values are identical (zero volatility), the function returns `null` or handles division by zero gracefully [@test](./tests/zero-volatility.test.ts)

## Implementation

[@generates](./src/sharpe-ratio.ts)

## API

```typescript { #api }
export function computeSharpeRatio(): Promise<number | null>;
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the Sharpe ratio computation integrated with the Prisma database client, fetching historical metrics from the Metrics table where model is "Deepseek" and computing the risk-adjusted return from the stored totalCashValue time series.

[@satisfied-by](open-nof1.ai)
