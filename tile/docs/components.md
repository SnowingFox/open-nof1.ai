# React Components

The application provides reusable React components for the real-time trading dashboard, built with Tailwind CSS v4 and shadcn/ui.

## Dashboard Components

### MetricsChart

Displays a line chart of account total value over time with animated dot and loading state.

```typescript { .api }
/**
 * Line chart visualizing account total cash value over time.
 * Uses Recharts under the hood with custom animated dot.
 *
 * @param metricsData - Array of MetricData snapshots to plot
 * @param loading - Whether data is currently being fetched
 * @param lastUpdate - ISO timestamp string of last data update
 * @param totalCount - Optional total count of records (shown in header)
 */
function MetricsChart(props: MetricsChartProps): JSX.Element;

interface MetricsChartProps {
  metricsData: MetricData[];
  loading: boolean;
  lastUpdate: string;
  totalCount?: number;
}
```

**Import**:
```typescript
import { MetricsChart } from "@/components/metrics-chart";
```

**Usage**:
```typescript
<MetricsChart
  metricsData={metricsData}
  loading={loading}
  lastUpdate={lastUpdate}
  totalCount={totalCount}
/>
```

### ModelsView

Displays AI chat history, trading decisions, and current positions in a tabbed interface. Fetches its own data from `/api/model/chat` every 30 seconds.

```typescript { .api }
/**
 * Tabbed view showing:
 * - CHAT tab: AI reasoning and analysis for each trading cycle
 * - TRADES tab: History of Buy/Sell/Hold decisions with details
 * - POSITIONS tab: (reserved for position data from ModelsView's own fetch)
 *
 * Fetches from /api/model/chat every 30 seconds automatically.
 * No props required.
 */
function ModelsView(): JSX.Element;
```

**Import**:
```typescript
import { ModelsView } from "@/components/models-view";
```

**Usage**:
```typescript
<ModelsView />
```

### CryptoCard

Displays a single cryptocurrency's current price and optional price change.

```typescript { .api }
/**
 * Card showing a cryptocurrency's current price with icon and optional change indicator.
 * Supports: BTC, ETH, SOL, BNB, DOGE with distinct color coding per asset.
 *
 * @param symbol - Cryptocurrency symbol, e.g. "BTC", "ETH", "SOL", "BNB", "DOGE"
 * @param name - Human-readable name, e.g. "Bitcoin"
 * @param price - Formatted price string, e.g. "$67,500.00"
 * @param change - Optional formatted change string, e.g. "+2.5%"
 */
function CryptoCard(props: CryptoCardProps): JSX.Element;

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: string;
  change?: string;
}
```

**Import**:
```typescript
import { CryptoCard } from "@/components/crypto-card";
```

**Usage**:
```typescript
<CryptoCard
  symbol="BTC"
  name="Bitcoin"
  price="$67,500.00"
  change="+2.5%"
/>
```

### AnimatedNumber

Animates numeric value changes with smooth transitions.

```typescript { .api }
/**
 * Displays a number with animated value transitions.
 *
 * @param value - Numeric or string value to display
 * @param className - Optional CSS class names
 * @param prefix - Optional string to prepend (e.g. "$")
 */
function AnimatedNumber(props: AnimatedNumberProps): JSX.Element;

interface AnimatedNumberProps {
  value: string | number;
  className?: string;
  prefix?: string;
}
```

**Import**:
```typescript
import { AnimatedNumber } from "@/components/animated-number";
```

### ChartLineInteractive

Example interactive line chart component with selectable time range.

```typescript { .api }
/**
 * Interactive line chart example component.
 * Not used in the main dashboard — provided as a reference/example.
 */
function ChartLineInteractive(): JSX.Element;
```

**Import**:
```typescript
import { ChartLineInteractive } from "@/components/chart";
```

---

## UI Components (shadcn/ui)

### Button

```typescript { .api }
/**
 * @param variant - Visual style: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
 * @param size - Size variant: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
 * @param asChild - When true, renders as child element via Radix Slot
 */
function Button(props: ButtonProps): JSX.Element;

/** CVA variant definition for custom button styling */
const buttonVariants: (variants: ButtonVariants) => string;
```

**Import**:
```typescript
import { Button, buttonVariants } from "@/components/ui/button";
```

### Card Components

```typescript { .api }
function Card(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
function CardHeader(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
function CardFooter(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element;
function CardAction(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element;
function CardContent(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
```

**Import**:
```typescript
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
```

**Usage**:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Account Performance</CardTitle>
    <CardDescription>Real-time trading metrics</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### Chart Components (Recharts wrapper)

```typescript { .api }
/**
 * Configuration map for chart series.
 * Keys are data keys; values define label, icon, and color/theme.
 */
type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  );
};

/** Hook to access chart context (must be used inside ChartContainer) */
function useChart(): ChartContextProps;

/** Container that provides ChartContext and applies CSS variables for colors */
function ChartContainer(props: ChartContainerProps): JSX.Element;

/** Re-export of Recharts Tooltip component */
const ChartTooltip: typeof RechartsPrimitive.Tooltip;

/** Styled tooltip content component for charts */
function ChartTooltipContent(props: ChartTooltipContentProps): JSX.Element | null;

/** Re-export of Recharts Legend component */
const ChartLegend: typeof RechartsPrimitive.Legend;

/** Styled legend content component for charts */
function ChartLegendContent(props: ChartLegendContentProps): JSX.Element | null;

/** Injects CSS variables for chart colors into the document */
function ChartStyle(props: { id: string; config: ChartConfig }): JSX.Element | null;
```

**Import**:
```typescript
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart
} from "@/components/ui/chart";
```

## Icons

### ArcticonsDeepseek

```typescript { .api }
/**
 * SVG icon for the DeepSeek AI logo.
 * Accepts all standard SVGElement props (width, height, className, etc.).
 */
function ArcticonsDeepseek(props: SVGProps<SVGSVGElement>): JSX.Element;
```

**Import**:
```typescript
import { ArcticonsDeepseek } from "@/lib/icons";
```

## Utility

### cn (class-name merger)

```typescript { .api }
/**
 * Merges Tailwind CSS class names, resolving conflicts using tailwind-merge.
 * Wraps clsx for conditional class logic.
 *
 * @param inputs - Class names, objects, arrays (any clsx-compatible input)
 * @returns Merged class name string
 */
function cn(...inputs: ClassValue[]): string;
```

**Import**:
```typescript
import { cn } from "@/lib/utils";
```

**Usage**:
```typescript
<div className={cn("base-class", isActive && "active-class", "text-sm")} />
```
