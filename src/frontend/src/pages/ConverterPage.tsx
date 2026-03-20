import SupportAdStrip from "@/components/SupportAdStrip";
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
import type { Currency } from "@/contexts/CurrencyContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useGetCryptoPrices } from "@/hooks/useQueries";
import {
  ArrowLeftRight,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "JPY", "INR"];
const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};
const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  INR: 83.2,
};

export default function ConverterPage() {
  const { data: prices, isLoading } = useGetCryptoPrices();
  const { currency: globalCurrency } = useCurrency();
  const [fromSymbol, setFromSymbol] = useState("BTCUSDT");
  const [amount, setAmount] = useState("1");
  const [toCurrency, setToCurrency] = useState<Currency>(globalCurrency);

  const selectedCoin = useMemo(
    () => prices?.find((p) => p.symbol === fromSymbol),
    [prices, fromSymbol],
  );

  const usdValue = selectedCoin
    ? selectedCoin.price * (Number.parseFloat(amount) || 0)
    : 0;
  const converted = usdValue * RATES[toCurrency];
  const sym = SYMBOLS[toCurrency];

  const formatConverted = (n: number) => {
    if (toCurrency === "JPY" || toCurrency === "INR") {
      return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const reverseRate =
    converted > 0 ? (Number.parseFloat(amount) || 1) / converted : 0;
  const coinSymbol = fromSymbol.replace("USDT", "");
  const isPos = (selectedCoin?.changePercent ?? 0) >= 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Crypto Converter
          </h1>
          <p className="text-muted-foreground">
            Convert any cryptocurrency to your preferred currency instantly.
          </p>
        </div>

        <div
          className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          data-ocid="converter.panel"
        >
          {/* From */}
          <div className="space-y-2 mb-4">
            <Label className="text-sm font-medium text-muted-foreground">
              From (Crypto)
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                {isLoading ? (
                  <div className="h-11 bg-secondary/50 rounded-md animate-pulse" />
                ) : (
                  <Select value={fromSymbol} onValueChange={setFromSymbol}>
                    <SelectTrigger
                      className="bg-secondary/50 border-border h-11"
                      data-ocid="converter.select"
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
                )}
              </div>
              <Input
                type="number"
                placeholder="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 bg-secondary/50 border-border h-11 text-foreground"
                data-ocid="converter.input"
              />
            </div>
            {selectedCoin && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  1 {coinSymbol} = $
                  {selectedCoin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
                <span
                  className={`flex items-center gap-0.5 ${isPos ? "text-success" : "text-destructive"}`}
                >
                  {isPos ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {isPos ? "+" : ""}
                  {selectedCoin.changePercent.toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          {/* Swap button */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center hover:bg-primary/25 transition-colors"
              onClick={() => {
                const prev = amount;
                setAmount(converted > 0 ? converted.toFixed(6) : prev);
              }}
              data-ocid="converter.toggle"
            >
              <ArrowLeftRight className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-2 mb-6">
            <Label className="text-sm font-medium text-muted-foreground">
              To (Currency)
            </Label>
            <Select
              value={toCurrency}
              onValueChange={(v) => setToCurrency(v as Currency)}
            >
              <SelectTrigger
                className="bg-secondary/50 border-border h-11"
                data-ocid="converter.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {SYMBOLS[c]} {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result */}
          {isLoading ? (
            <div
              className="flex items-center gap-2 justify-center py-4"
              data-ocid="converter.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading prices...</span>
            </div>
          ) : (
            <div
              className="rounded-xl bg-primary/8 border border-primary/20 p-5 text-center"
              data-ocid="converter.success_state"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Result
              </p>
              <p className="text-4xl font-bold font-display text-primary">
                {formatConverted(converted)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {amount || "1"} {coinSymbol} = {formatConverted(converted)}
              </p>
              {converted > 0 && (
                <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2">
                  1 {toCurrency} ≈ {reverseRate.toFixed(8)} {coinSymbol}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <SupportAdStrip />
        </div>
      </motion.div>
    </div>
  );
}
