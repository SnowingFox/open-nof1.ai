# Periodic Metrics Collection API Endpoint

A Next.js API route that collects a snapshot of account performance metrics and persists them to the database, designed to be called on a regular interval by an automated scheduler.

## Capabilities

### Authenticate and collect metrics snapshot

Implement a POST endpoint at `/api/cron/20-seconds-metrics-interval` that:

1. Verifies the request bearer token against the `CRON_SECRET_KEY` environment variable using JWT verification
2. Rejects unauthorized requests with a 401 response
3. Fetches current account performance using `START_MONEY` from environment as initial capital
4. Upserts a `Metrics` record in the database for the `"Deepseek"` model named `"Deepseek"`
5. Appends the new metric snapshot to the existing metrics array, keeping a maximum of 100 data points via uniform sampling when the limit is exceeded
6. Returns a JSON response with the current metric count

The uniform sampling algorithm (when >100 points): Select indices evenly distributed across the full metrics array to reduce it to 100 entries.

- An unauthenticated POST request returns a 401 JSON response with `{ message: "Unauthorized" }` [@test](./tests/unauthorized.test.ts)
- An authenticated POST request returns a JSON response with a `data.count` number field [@test](./tests/returns-count.test.ts)
- After 101 metrics are stored, subsequent calls maintain the count at 100 using uniform sampling [@test](./tests/max-100-points.test.ts)
- The stored metric snapshot includes a `createdAt` ISO timestamp [@test](./tests/snapshot-timestamp.test.ts)

## Implementation

[@generates](./src/app/api/cron/20-seconds-metrics-interval/route.ts)

## API

```typescript { #api }
// POST /api/cron/20-seconds-metrics-interval
// Authorization: Bearer <jwt-token>
// Response 401: { message: "Unauthorized" }
// Response 200: { data: { count: number }, message: string, success: boolean }
```

## Dependencies { .dependencies }

### open-nof1.ai 0.1.0 { .dependency }

Provides the account performance retrieval function, Prisma singleton for database access, the Metrics model (with model and name fields for Deepseek), and JWT authentication via jsonwebtoken using CRON_SECRET_KEY.

[@satisfied-by](open-nof1.ai)
