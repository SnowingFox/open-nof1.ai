# Cron Scheduler

The `cron.ts` file is a standalone process that schedules automated metric collection and AI trading execution. It runs independently of the Next.js server and communicates with it via authenticated HTTP requests.

## Running the Scheduler

```bash
# Start the cron scheduler as a separate process
bun run cron.ts
```

The scheduler is designed to run alongside the Next.js server. The Next.js server must be running and accessible at `NEXT_PUBLIC_URL` for the cron jobs to work.

## Scheduled Tasks

### Metrics Collection

```typescript { .api }
// Schedule: every 10 seconds (cron: "*/10 * * * * *")
// Function: runMetricsInterval()
// Calls: GET {NEXT_PUBLIC_URL}/api/cron/20-seconds-metrics-interval?token={JWT}
```

Collects current account performance data and stores it in the database.

### AI Trading Execution

```typescript { .api }
// Schedule: every 3 minutes (cron: "*/3 * * * *")
// Function: runChatInterval()
// Calls: GET {NEXT_PUBLIC_URL}/api/cron/3-minutes-run-interval?token={JWT}
```

Triggers the AI trading cycle (fetches market data, calls DeepSeek, stores decisions). **Runs once immediately on process startup**, then every 3 minutes.

## JWT Authentication

Cron requests are authenticated with short-lived JWTs signed using the `CRON_SECRET_KEY` environment variable:

```typescript { .api }
// Token generation pattern used internally:
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { sub: "cron-token" },
  process.env.CRON_SECRET_KEY || ""
);
```

The API endpoints verify this token against `CRON_SECRET_KEY` before executing. Requests with missing or invalid tokens are rejected.

## Environment Variables Used

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_URL` | Base URL of the running Next.js app (e.g. `http://localhost:3000`) |
| `CRON_SECRET_KEY` | Shared secret for JWT signing/verification |
| `START_MONEY` | Initial capital in USDT passed to the trading run function |

## Dependencies

- `node-cron` (v4.x): Cron expression scheduling
- `jsonwebtoken`: JWT token generation for request authentication
