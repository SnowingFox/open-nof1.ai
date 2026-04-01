# Account & Performance

The account performance module retrieves Binance Futures account state, open positions, and computes portfolio performance metrics including total return and Sharpe ratio.

## Capabilities

### Fetch Account Information and Performance

```typescript { .api }
/**
 * Fetches account balance and open positions from Binance Futures,
 * then computes performance metrics relative to the initial capital.
 *
 * @param initialCapital - Starting capital in USDT (used to compute total return and Sharpe ratio)
 * @returns Promise resolving to account state with computed performance metrics
 * @throws If Binance API is unavailable
 */
async function getAccountInformationAndPerformance(
  initialCapital: number
): Promise<AccountInformationAndPerformance>;
```

**Import**:
```typescript
import { getAccountInformationAndPerformance } from "@/lib/trading/account-information-and-performance";
```

**Usage**:
```typescript
const initialCapital = parseFloat(process.env.START_MONEY!);
const performance = await getAccountInformationAndPerformance(initialCapital);

console.log(performance.totalCashValue);      // e.g. 1050.25
console.log(performance.currentTotalReturn);  // e.g. 0.0502 (5.02%)
console.log(performance.sharpeRatio);         // e.g. 1.23
console.log(performance.positions.length);    // number of open positions
```

### Format Account Performance

```typescript { .api }
/**
 * Formats an AccountInformationAndPerformance object as a human-readable
 * string suitable for inclusion in AI trading prompts.
 *
 * @param accountPerformance - Account performance object from getAccountInformationAndPerformance
 * @returns Multi-line formatted string representation
 */
function formatAccountPerformance(
  accountPerformance: AccountInformationAndPerformance
): string;
```

**Import**:
```typescript
import { formatAccountPerformance } from "@/lib/trading/account-information-and-performance";
```

## Types

```typescript { .api }
interface AccountInformationAndPerformance {
  /** Total value of all open futures positions in USDT */
  currentPositionsValue: number;
  /** Total contract value (notional value of all positions) in USDT */
  contractValue: number;
  /** Total account value: available cash + positions value, in USDT */
  totalCashValue: number;
  /** Available cash (unrealized P&L not yet withdrawn) in USDT */
  availableCash: number;
  /** Total return as a decimal (e.g. 0.05 = 5% return) */
  currentTotalReturn: number;
  /** Array of currently open positions */
  positions: Position[];
  /** Sharpe ratio computed from historical returns (risk-adjusted performance) */
  sharpeRatio: number;
}

// Position is ccxt.Position — key fields used by this application:
interface Position {
  /** Trading symbol, e.g. "BTC/USDT" */
  symbol: string;
  /** Position side: "long" or "short" */
  side: string;
  /** Position size in contracts */
  contracts: number;
  /** Average entry price in USDT */
  entryPrice: number;
  /** Current mark price in USDT */
  markPrice: number;
  /** Liquidation price in USDT */
  liquidationPrice: number;
  /** Unrealized profit and loss in USDT */
  unrealizedPnl: number;
  /** Leverage multiplier applied to this position */
  leverage: number;
  /** Notional value in USDT */
  notional: number;
  /** Stop loss price in USDT (if set) */
  stopLossPrice: number;
  /** Take profit price in USDT (if set) */
  takeProfitPrice: number;
}
```

## Trading Execution Placeholders

The buy and sell execution modules are currently placeholders for future implementation.

```typescript { .api }
/**
 * Placeholder for buy order execution logic.
 * Not yet implemented — trading decisions are currently handled in lib/ai/run.ts.
 */
function buy(): void;

/**
 * Placeholder for sell order execution logic.
 * Not yet implemented — trading decisions are currently handled in lib/ai/run.ts.
 */
function sell(): void;
```

**Import**:
```typescript
import { buy } from "@/lib/trading/buy";
import { sell } from "@/lib/trading/sell";
```
