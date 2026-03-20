import SupportAdStrip from "@/components/SupportAdStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useGetCryptoPrices } from "@/hooks/useQueries";
import {
  PlusCircle,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Holding {
  symbol: string;
  quantity: number;
}

function loadHoldings(): Holding[] {
  try {
    const stored = localStorage.getItem("portfolio");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHoldings(holdings: Holding[]) {
  localStorage.setItem("portfolio", JSON.stringify(holdings));
}

export default function PortfolioPage() {
  const { data: prices, isLoading } = useGetCryptoPrices();
  const { formatPrice } = useCurrency();
  const [holdings, setHoldings] = useState<Holding[]>(loadHoldings);
  const [addSymbol, setAddSymbol] = useState("BTCUSDT");
  const [addQty, setAddQty] = useState("");

  const addHolding = () => {
    const qty = Number.parseFloat(addQty);
    if (!addSymbol || Number.isNaN(qty) || qty <= 0) return;
    const next = [...holdings];
    const existing = next.findIndex((h) => h.symbol === addSymbol);
    if (existing >= 0) {
      next[existing] = {
        ...next[existing],
        quantity: next[existing].quantity + qty,
      };
    } else {
      next.push({ symbol: addSymbol, quantity: qty });
    }
    setHoldings(next);
    saveHoldings(next);
    setAddQty("");
  };

  const removeHolding = (symbol: string) => {
    const next = holdings.filter((h) => h.symbol !== symbol);
    setHoldings(next);
    saveHoldings(next);
  };

  const enriched = holdings.map((h) => {
    const coin = prices?.find((p) => p.symbol === h.symbol);
    const price = coin?.price ?? 0;
    const totalValue = price * h.quantity;
    const changePercent = coin?.changePercent ?? 0;
    const name = coin?.name || h.symbol.replace("USDT", "");
    const sym = h.symbol.replace("USDT", "");
    return {
      ...h,
      price,
      totalValue,
      changePercent,
      name,
      sym,
      image: coin?.image,
    };
  });

  const totalPortfolioValue = enriched.reduce(
    (sum, h) => sum + h.totalValue,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Portfolio Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your crypto holdings and total value in real-time.
          </p>
        </div>

        {/* Total Value */}
        <div
          className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-lg"
          data-ocid="portfolio.card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
              Total Portfolio Value
            </p>
          </div>
          <p className="text-5xl font-bold font-display text-foreground">
            {isLoading ? (
              <span className="text-muted-foreground text-2xl">Loading...</span>
            ) : (
              formatPrice(totalPortfolioValue)
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {enriched.length} asset{enriched.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Add Holding Form */}
        <div
          className="bg-card border border-border rounded-2xl p-5 mb-6"
          data-ocid="portfolio.panel"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Add Holding
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Coin
              </Label>
              <Select value={addSymbol} onValueChange={setAddSymbol}>
                <SelectTrigger
                  className="bg-secondary/50 border-border h-10"
                  data-ocid="portfolio.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {prices?.map((p) => {
                    const s = p.symbol.replace("USDT", "");
                    return (
                      <SelectItem key={p.symbol} value={p.symbol}>
                        {p.name || s} ({s})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-36">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Quantity
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                className="bg-secondary/50 border-border h-10 text-foreground"
                data-ocid="portfolio.input"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addHolding}
                disabled={!addQty || Number.parseFloat(addQty) <= 0}
                className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/80"
                data-ocid="portfolio.primary_button"
              >
                <PlusCircle className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Holdings List */}
        {enriched.length === 0 ? (
          <div
            className="bg-card border border-border rounded-2xl p-12 text-center"
            data-ocid="portfolio.empty_state"
          >
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">
              Your portfolio is empty
            </p>
            <p className="text-muted-foreground text-sm">
              Add your first holding to track your portfolio
            </p>
          </div>
        ) : (
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="portfolio.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3">Asset</th>
                    <th className="text-right px-5 py-3">Quantity</th>
                    <th className="text-right px-5 py-3">Price</th>
                    <th className="text-right px-5 py-3">Value</th>
                    <th className="text-right px-5 py-3">24h</th>
                    <th className="text-right px-5 py-3">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {enriched.map((h, i) => {
                    const isPos = h.changePercent >= 0;
                    return (
                      <tr
                        key={h.symbol}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                        data-ocid={`portfolio.item.${i + 1}`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {h.image && (
                              <img
                                src={h.image}
                                alt={h.sym}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-foreground text-sm">
                                {h.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {h.sym}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-sm text-foreground">
                            {h.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-sm text-foreground">
                            {formatPrice(h.price)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="font-semibold text-foreground">
                            {formatPrice(h.totalValue)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${isPos ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}
                          >
                            {isPos ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {isPos ? "+" : ""}
                            {h.changePercent.toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeHolding(h.symbol)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            data-ocid={`portfolio.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8">
          <SupportAdStrip />
        </div>
      </motion.div>
    </div>
  );
}
