import SupportAdStrip from "@/components/SupportAdStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import type { CryptoPriceExtended } from "@/hooks/useQueries";
import { useGetCryptoPrices } from "@/hooks/useQueries";
import {
  RefreshCw,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const skeletonKeys = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
  "sk-j",
];

function CoinIcon({ coin }: { coin: CryptoPriceExtended }) {
  const sym = coin.symbol.replace("USDT", "").toLowerCase();
  const cdnSrc = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${sym}.svg`;
  return (
    <img
      src={coin.image || cdnSrc}
      alt={sym}
      className="w-8 h-8 rounded-full flex-shrink-0"
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

export default function LivePricesPage() {
  const [search, setSearch] = useState("");
  const {
    data: prices,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCryptoPrices();
  const { formatPrice } = useCurrency();
  const { watchlist, toggleWatch, isWatched } = useWatchlist();

  const filtered = prices?.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (p.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const watchedCoins =
    prices?.filter((p) => watchlist.includes(p.symbol)) ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Live Crypto Prices
            </h1>
            <p className="text-muted-foreground">
              Top 50 cryptocurrencies — updated every minute.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
            data-ocid="prices.secondary_button"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Watchlist section */}
        <div className="mb-6">
          {watchedCoins.length === 0 ? (
            <div
              className="bg-card/50 border border-border/50 rounded-xl px-5 py-3 text-sm text-muted-foreground flex items-center gap-2"
              data-ocid="watchlist.empty_state"
            >
              <Star className="w-4 h-4" />
              Star coins to add to your watchlist
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Watchlist
              </p>
              <div className="flex flex-wrap gap-2">
                {watchedCoins.map((coin) => {
                  const sym = coin.symbol.replace("USDT", "");
                  const isPos = coin.changePercent >= 0;
                  return (
                    <div
                      key={coin.symbol}
                      className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5 text-sm"
                      data-ocid="watchlist.card"
                    >
                      <CoinIcon coin={coin} />
                      <span className="font-semibold text-foreground">
                        {sym}
                      </span>
                      <span className="font-mono text-foreground">
                        {formatPrice(coin.price)}
                      </span>
                      <span
                        className={`text-xs ${isPos ? "text-success" : "text-destructive"}`}
                      >
                        {isPos ? "+" : ""}
                        {coin.changePercent.toFixed(2)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWatch(coin.symbol)}
                        className="ml-1 text-yellow-400 hover:text-muted-foreground transition-colors"
                      >
                        <Star className="w-3 h-3 fill-yellow-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground"
            data-ocid="prices.search_input"
          />
        </div>

        <div
          className="bg-card border border-border rounded-xl overflow-hidden mb-8"
          data-ocid="prices.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Coin</th>
                  <th className="text-right px-5 py-3">Price</th>
                  <th className="text-right px-5 py-3">24h Change</th>
                  <th className="text-right px-5 py-3 hidden sm:table-cell">
                    Volume
                  </th>
                  <th className="text-right px-5 py-3 hidden lg:table-cell">
                    Chart
                  </th>
                  <th className="text-center px-3 py-3">★</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  skeletonKeys.map((k) => (
                    <tr key={k} className="border-b border-border/50">
                      <td colSpan={7} className="px-5 py-3">
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))}

                {isError && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center">
                      <p
                        className="text-destructive"
                        data-ocid="prices.error_state"
                      >
                        Failed to load prices.
                      </p>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  filtered?.map((coin, i) => {
                    const sym = coin.symbol.replace("USDT", "");
                    const isPos = coin.changePercent >= 0;
                    const watched = isWatched(coin.symbol);
                    return (
                      <tr
                        key={coin.symbol}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        data-ocid={`prices.item.${i + 1}`}
                      >
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <CoinIcon coin={coin} />
                            <div>
                              <p className="font-semibold text-foreground">
                                {coin.name || sym}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sym}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="font-semibold text-foreground">
                            {formatPrice(coin.price)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${
                              isPos
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                          >
                            {isPos ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {isPos ? "+" : ""}
                            {coin.changePercent.toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            ${(coin.volume / 1_000_000).toFixed(1)}M
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right hidden lg:table-cell">
                          <div className="flex justify-end">
                            <iframe
                              loading="lazy"
                              src={`https://www.tradingview.com/miniwidget/?symbol=BINANCE:${sym}USDT&theme=dark`}
                              className="w-32 h-12 border-0 rounded"
                              title={`${sym} mini chart`}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleWatch(coin.symbol)}
                            className="p-1 rounded hover:bg-secondary transition-colors"
                            aria-label={watched ? "Unwatch" : "Watch"}
                            data-ocid={`prices.toggle.${i + 1}`}
                          >
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                watched
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                {!isLoading && !isError && filtered?.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center"
                      data-ocid="prices.empty_state"
                    >
                      <p className="text-muted-foreground">
                        No coins match your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <SupportAdStrip />
      </motion.div>
    </div>
  );
}
