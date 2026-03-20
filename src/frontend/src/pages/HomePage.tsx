import SupportAdStrip from "@/components/SupportAdStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CryptoPriceExtended } from "@/hooks/useQueries";
import { useGetCryptoPrices } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  Calculator,
  DollarSign,
  Globe,
  Heart,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

function CoinIcon({ coin }: { coin: CryptoPriceExtended }) {
  const sym = coin.symbol.replace("USDT", "").toLowerCase();
  const cdnSrc = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${sym}.svg`;
  return (
    <img
      src={coin.image || cdnSrc}
      alt={sym}
      className="w-7 h-7 rounded-full"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src !== cdnSrc) {
          img.src = cdnSrc;
        } else {
          img.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%231F2A32'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239AA6B2' font-size='12'%3E%3F%3C/text%3E%3C/svg%3E";
        }
      }}
    />
  );
}

const shortcutTiles = [
  {
    icon: Calculator,
    label: "P&L Calc",
    path: "/calculator",
    color: "text-primary",
  },
  {
    icon: BarChart2,
    label: "Live Markets",
    path: "/live",
    color: "text-success",
  },
  {
    icon: DollarSign,
    label: "Tax Estimator",
    path: "/calculator",
    color: "text-yellow-400",
  },
  {
    icon: TrendingUp,
    label: "Top Gainers",
    path: "/live",
    color: "text-success",
  },
  {
    icon: TrendingDown,
    label: "Top Losers",
    path: "/live",
    color: "text-destructive",
  },
  {
    icon: ShieldCheck,
    label: "Tax Safe",
    path: "/calculator",
    color: "text-primary",
  },
  {
    icon: Globe,
    label: "Global Rates",
    path: "/calculator",
    color: "text-purple-400",
  },
  {
    icon: Heart,
    label: "Support Us",
    path: "/support",
    color: "text-pink-400",
  },
];

const chartBars = [
  { id: "bar-a", h: 40 },
  { id: "bar-b", h: 55 },
  { id: "bar-c", h: 45 },
  { id: "bar-d", h: 65 },
  { id: "bar-e", h: 50 },
  { id: "bar-f", h: 70 },
  { id: "bar-g", h: 60 },
  { id: "bar-h", h: 75 },
  { id: "bar-i", h: 65 },
  { id: "bar-j", h: 80 },
];

const skeletonRows = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export default function HomePage() {
  const { data: prices, isLoading, isError } = useGetCryptoPrices();
  const displayPrices = prices?.slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Real-time data • Free to use
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
              Track Crypto Profits,{" "}
              <span className="text-primary">Optimize Taxes</span>, Instantly.
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Real-time market analysis, profit/loss calculator, and smart tax
              estimator — all in one place. No sign-up required.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/calculator">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 gap-2"
                  data-ocid="hero.primary_button"
                >
                  Calculate Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/live">
                <Button
                  variant="outline"
                  size="lg"
                  data-ocid="hero.secondary_button"
                >
                  Live Prices
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex justify-center"
          >
            <div className="relative w-80 h-72">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10 shadow-teal" />
              <div className="absolute top-6 left-6 right-6 bottom-6 bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    BTC/USDT
                  </span>
                  <span className="text-xs text-success font-medium">
                    +2.34%
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground font-display">
                  $67,420.50
                </p>
                <p className="text-xs text-muted-foreground mb-4">Bitcoin</p>
                <div className="grid grid-cols-3 gap-2">
                  {["ETH", "SOL", "BNB"].map((c) => (
                    <div
                      key={c}
                      className="bg-secondary rounded-lg p-2 text-center"
                    >
                      <p className="text-xs font-bold text-foreground">{c}</p>
                      <p className="text-[10px] text-success">+1.2%</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-12 flex items-end gap-1">
                  {chartBars.map((bar) => (
                    <div
                      key={bar.id}
                      className="flex-1 bg-primary/30 rounded-t"
                      style={{ height: `${bar.h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shadow-teal">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Markets table */}
      <section
        className="container mx-auto px-4 mb-12"
        data-ocid="market.table"
      >
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Live Crypto Markets
            </h2>
            <Link to="/live">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary cursor-pointer hover:bg-primary/10 transition-colors"
              >
                View All 50
              </Badge>
            </Link>
          </div>

          {isLoading && (
            <div className="p-6 space-y-3" data-ocid="market.loading_state">
              {skeletonRows.map((id) => (
                <Skeleton key={id} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-8 text-center" data-ocid="market.error_state">
              <p className="text-destructive">
                Failed to load prices. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !isError && displayPrices && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left px-6 py-3">#</th>
                    <th className="text-left px-6 py-3">Coin</th>
                    <th className="text-right px-6 py-3">Price</th>
                    <th className="text-right px-6 py-3">24h %</th>
                    <th className="text-right px-6 py-3 hidden md:table-cell">
                      Volume
                    </th>
                    <th className="text-right px-6 py-3 hidden lg:table-cell">
                      Chart
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayPrices.map((coin, i) => {
                    const sym = coin.symbol.replace("USDT", "");
                    const isPos = coin.changePercent >= 0;
                    return (
                      <tr
                        key={coin.symbol}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        data-ocid={`market.item.${i + 1}`}
                      >
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <CoinIcon coin={coin} />
                            <div>
                              <p className="font-semibold text-foreground text-sm">
                                {coin.name || sym}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sym}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="font-semibold text-foreground text-sm">
                            $
                            {coin.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span
                            className={`text-sm font-medium flex items-center justify-end gap-1 ${
                              isPos ? "text-success" : "text-destructive"
                            }`}
                          >
                            {isPos ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {isPos ? "+" : ""}
                            {coin.changePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            ${(coin.volume / 1_000_000).toFixed(1)}M
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right hidden lg:table-cell">
                          <div className="flex justify-end">
                            <iframe
                              loading="lazy"
                              src={`https://www.tradingview.com/miniwidget/?symbol=BINANCE:${sym}USDT&theme=dark`}
                              className="w-28 h-10 border-0 rounded"
                              title={`${sym} chart`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && displayPrices?.length === 0 && (
            <div className="p-8 text-center" data-ocid="market.empty_state">
              <p className="text-muted-foreground">No price data available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Shortcut tiles */}
      <section className="container mx-auto px-4 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {shortcutTiles.map((tile) => (
            <Link key={tile.label} to={tile.path}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <tile.icon className={`w-5 h-5 ${tile.color}`} />
                </div>
                <span className="text-xs text-muted-foreground text-center leading-tight">
                  {tile.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Support Ad Strip */}
      <div className="container mx-auto px-4">
        <SupportAdStrip />
      </div>
    </div>
  );
}
