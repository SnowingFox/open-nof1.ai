# 🤖 Open-nof1.ai

> An open-source implementation of [nof1.ai](https://nof1.ai)'s Alpha Arena - A benchmark platform for evaluating AI models' cryptocurrency trading capabilities with real money in real markets.

![Screenshot 2](./screen-shot-2.png)

## 🌟 What is Alpha Arena?

Alpha Arena is a revolutionary benchmark that tests AI models where it matters most: **real financial markets with real money**. Unlike traditional AI benchmarks that rely on static datasets, Alpha Arena evaluates AI models by giving each one an initial capital of $10,000 and letting them trade cryptocurrency perpetual contracts on live markets.

**Why markets are the ultimate test of intelligence:**
- Markets are dynamic, adversarial, and open-ended
- They challenge AI in ways that static benchmarks cannot
- Real-time decision-making under uncertainty reveals true capabilities
- Risk management and strategic thinking are essential

## 🎯 Features

This open-source implementation currently focuses on running the **DeepSeek** trading model with the following capabilities:

- 🔄 **Real-time Trading**: Automated cryptocurrency trading on Binance via CCXT
- 📊 **Live Dashboard**: Beautiful real-time charts showing account performance
- 🧠 **AI Decision Making**: Complete chain-of-thought reasoning for every trade
- 💹 **Multi-Asset Support**: Trade BTC, ETH, SOL, BNB, and DOGE
- 📈 **Performance Tracking**: Detailed metrics, trade history, and profit/loss tracking
- 🔍 **Full Transparency**: Every decision, prompt, and reasoning is logged and visible
- ⚡ **Cron Jobs**: Automated 20-second metric collection and 3-minute trading intervals

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router & Turbopack
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/) with DeepSeek integration
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Trading**: [CCXT](https://github.com/ccxt/ccxt) for exchange connectivity
- **Charts**: [Recharts](https://recharts.org/) with [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Runtime**: [Bun](https://bun.sh/) for fast package management

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database
- Binance API credentials (for live trading)
- DeepSeek API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snowingfox/open-nof1.ai.git
   cd open-nof1.ai
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your `.env` file:
   ```env
   # Application
   NEXT_PUBLIC_URL="http://localhost:3000"

   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/nof1"

   # AI Models
   DEEPSEEK_API_KEY="your_deepseek_api_key"
   OPENROUTER_API_KEY="your_openrouter_api_key"  # Optional: for additional models
   REQUESTY_API_KEY="your_requesty_api_key"  # Optional: Requesty (https://router.requesty.ai/v1) for additional models
   
   # Market Research (Optional)
   EXA_API_KEY="your_exa_api_key"  # For enhanced market analysis

   # Trading (Binance)
   BINANCE_API_KEY="your_binance_api_key"
   BINANCE_API_SECRET="your_binance_secret"
   BINANCE_USE_SANDBOX="true"  # Set to "false" for live trading
   
   # Trading Configuration
   START_MONEY=10000  # Initial capital in USDT (e.g., 10000 = $10,000 USDT)

   # Cron Job Authentication
   CRON_SECRET_KEY="your_secret_token"
   ```

4. **Set up the database**
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

5. **Run the development server**
   ```bash
   bun dev
   ```

6. **Set up cron jobs** (for automated trading)

   You'll need to set up external cron jobs or use a service like [Vercel Cron](https://vercel.com/docs/cron-jobs) to call these endpoints:

   - `POST /api/cron/20-seconds-metrics-interval` - Collect metrics every 20 seconds
   - `POST /api/cron/3-minutes-run-interval` - Execute trading logic every 3 minutes

   Example crontab:
   ```bash
   # Metrics collection (every 20 seconds)
   * * * * * curl -X POST http://localhost:3000/api/cron/20-seconds-metrics-interval -H "Authorization: Bearer YOUR_CRON_SECRET_KEY"
   * * * * * sleep 20 && curl -X POST http://localhost:3000/api/cron/20-seconds-metrics-interval -H "Authorization: Bearer YOUR_CRON_SECRET_KEY"
   * * * * * sleep 40 && curl -X POST http://localhost:3000/api/cron/20-seconds-metrics-interval -H "Authorization: Bearer YOUR_CRON_SECRET_KEY"

   # Trading execution (every 3 minutes)
   */3 * * * * curl -X POST http://localhost:3000/api/cron/3-minutes-run-interval -H "Authorization: Bearer YOUR_CRON_SECRET_KEY"
   ```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
open-nof1.ai/
├── app/
│   ├── api/
│   │   ├── cron/              # Automated job endpoints
│   │   ├── metrics/           # Metrics data API
│   │   ├── pricing/           # Crypto pricing API
│   │   └── model/chat/        # Chat history API
│   ├── page.tsx               # Main dashboard
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── metrics-chart.tsx      # Account value chart
│   ├── models-view.tsx        # Trade & chat history
│   └── crypto-card.tsx        # Price display cards
├── lib/
│   ├── ai/
│   │   ├── agent/             # AI agent logic
│   │   ├── model.ts           # Model configurations
│   │   ├── prompt.ts          # Trading prompts
│   │   └── tool.ts            # AI tools/functions
│   ├── trading/
│   │   ├── buy.ts             # Buy execution
│   │   ├── sell.ts            # Sell execution
│   │   ├── current-market-state.ts
│   │   └── account-information-and-performance.ts
│   └── types/                 # TypeScript types
└── prisma/
    └── schema.prisma          # Database schema
```

## 🎮 How It Works

1. **Data Collection**: Every 20 seconds, the system collects account metrics (balance, positions, PnL)
2. **AI Decision Making**: Every 3 minutes, the AI analyzes market data and makes trading decisions
3. **Execution**: Approved trades are executed via Binance API
4. **Transparency**: All reasoning, prompts, and decisions are stored in the database
5. **Visualization**: The dashboard displays real-time performance and trade history

### ⚙️ Configuration

**Starting Capital** (`START_MONEY`)
- Set your initial trading capital in USDT (Tether stablecoin)
- Example: `START_MONEY=10000` means you start with $10,000 USDT
- Recommended for testing: Start with small amounts (e.g., `START_MONEY=30`)
- The AI will make trading decisions based on this available capital
- All profits and losses are calculated relative to this starting amount

## 🤝 AI Models

Currently supported:
- **DeepSeek V3 Chat** - Primary trading model
- **DeepSeek R1** - Advanced reasoning model (optional)

Want to add more models? Check out the [AI SDK providers](https://sdk.vercel.ai/providers/ai-sdk-providers) and add them to `lib/ai/model.ts`!

## 📊 Dashboard Features

- **Live Crypto Prices**: Real-time prices for BTC, ETH, SOL, BNB, DOGE
- **Account Performance Chart**: Interactive chart showing total account value over time
- **Completed Trades**: Detailed history of all buy/sell operations
- **Model Chat**: Full transparency into AI's chain-of-thought and decision-making
- **Positions**: Current open positions (coming soon)

## ⚠️ Disclaimer

**This is educational/research software. Trading cryptocurrencies involves substantial risk of loss.**

- Start with small amounts or paper trading
- The AI model may make poor decisions
- Past performance doesn't guarantee future results
- You are responsible for any financial losses
- Review and test thoroughly before using real money

## 🤔 Why Open Source?

The original [nof1.ai](https://nof1.ai) Alpha Arena is a closed competition. This open-source version aims to:

1. **Democratize AI trading research** - Anyone can experiment with AI trading agents
2. **Educational purposes** - Learn how AI agents make financial decisions
3. **Transparency** - Full visibility into prompts, reasoning, and execution
4. **Community innovation** - Improve and iterate on trading strategies together

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Inspired by [nof1.ai](https://nof1.ai)'s Alpha Arena
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [DeepSeek](https://www.deepseek.com/) AI models
- Trading via [CCXT](https://github.com/ccxt/ccxt)

## 🔗 Links

- [nof1.ai Official Site](https://nof1.ai)
- [Alpha Arena](https://nof1.ai)
- [DeepSeek](https://www.deepseek.com/)

---

**⚡ Built with Bun + Next.js 15 + DeepSeek + CCXT**

*Markets are the ultimate test of intelligence. Let's find out if LLMs are good enough.*
