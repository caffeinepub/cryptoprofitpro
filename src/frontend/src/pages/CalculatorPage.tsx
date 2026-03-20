import SupportAdStrip from "@/components/SupportAdStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculateProfit, useCalculateTax } from "@/hooks/useQueries";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Coins,
  DollarSign,
  FileText,
  Loader2,
  Lock,
  Percent,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function CalculatorPage() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [showNoTaxDialog, setShowNoTaxDialog] = useState(false);

  const profitMutation = useCalculateProfit();
  const taxMutation = useCalculateTax();

  const handleCalculate = async () => {
    const b = Number.parseFloat(buyPrice);
    const s = Number.parseFloat(sellPrice);
    const q = Number.parseFloat(quantity);
    if (Number.isNaN(b) || Number.isNaN(s) || Number.isNaN(q)) return;
    await profitMutation.mutateAsync({
      buyPrice: b,
      sellPrice: s,
      quantity: q,
    });
  };

  const handleTaxCalc = async () => {
    if (!profitMutation.data) return;
    const tp = Number.parseFloat(taxPercent);
    if (Number.isNaN(tp)) return;
    const result = await taxMutation.mutateAsync({
      profitAmount: profitMutation.data.profitLossAmount,
      taxPercent: tp,
    });
    if (!result.isTaxable) {
      setShowNoTaxDialog(true);
    }
  };

  const profitData = profitMutation.data;
  const taxData = taxMutation.data;
  const isProfit = profitData?.isProfit ?? true;
  const hasPnl = !!profitData;

  const formatUSD = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tight">
            Profit & Tax Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Calculate your crypto gains and estimate your tax liability in
            seconds.
          </p>
        </div>

        {/* Workflow Stepper */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-sm font-semibold text-primary">
              Calculate P&amp;L
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
              hasPnl
                ? "bg-amber-500/15 border-amber-500/30"
                : "bg-secondary border-border"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                hasPnl
                  ? "bg-amber-500 text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </span>
            <span
              className={`text-sm font-semibold ${
                hasPnl ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              Estimate Tax
            </span>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT PANEL — P&L Calculator */}
          <div
            className="rounded-2xl border border-border border-t-2 border-t-primary bg-card overflow-hidden shadow-lg"
            style={{ borderTopColor: "oklch(0.65 0.22 240)" }}
            data-ocid="calculator.panel"
          >
            {/* Panel Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      P&amp;L Calculator
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Profit & Loss Analysis
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/15 text-primary border-primary/25 text-xs">
                  Step 1
                </Badge>
              </div>
            </div>

            {/* Panel Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Buy Price */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="buyPrice"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Buy Price
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-muted-foreground/60" />
                  </div>
                  <Input
                    id="buyPrice"
                    type="number"
                    placeholder="0.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="pl-8 bg-secondary/50 border-border/70 text-foreground text-base h-11 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                    data-ocid="calculator.input"
                  />
                </div>
              </div>

              {/* Sell Price */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="sellPrice"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Sell Price
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-muted-foreground/60" />
                  </div>
                  <Input
                    id="sellPrice"
                    type="number"
                    placeholder="0.00"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="pl-8 bg-secondary/50 border-border/70 text-foreground text-base h-11 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                    data-ocid="calculator.input"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Quantity
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Coins className="w-4 h-4 text-muted-foreground/60" />
                  </div>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0.00"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="pl-8 bg-secondary/50 border-border/70 text-foreground text-base h-11 focus:border-primary/60 focus:ring-primary/20 transition-colors"
                    data-ocid="calculator.input"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={handleCalculate}
                disabled={
                  profitMutation.isPending ||
                  !buyPrice ||
                  !sellPrice ||
                  !quantity
                }
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 240), oklch(0.60 0.20 210))",
                }}
                data-ocid="calculator.submit_button"
              >
                {profitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate P&amp;L
                  </>
                )}
              </Button>

              {/* Result */}
              <AnimatePresence>
                {profitData && (
                  <motion.div
                    key="profit-result"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl p-5 border relative overflow-hidden ${
                      isProfit
                        ? "bg-success/8 border-success/25"
                        : "bg-destructive/8 border-destructive/25"
                    }`}
                    data-ocid="calculator.success_state"
                  >
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 opacity-10 pointer-events-none ${
                        isProfit ? "bg-success" : "bg-destructive"
                      }`}
                      style={{
                        background: isProfit
                          ? "radial-gradient(circle at 50% 0%, oklch(0.7 0.2 145) 0%, transparent 70%)"
                          : "radial-gradient(circle at 50% 0%, oklch(0.65 0.25 25) 0%, transparent 70%)",
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {isProfit ? (
                            <TrendingUp className="w-5 h-5 text-success" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-destructive" />
                          )}
                          <Badge
                            className={`text-xs font-bold tracking-widest px-2.5 ${
                              isProfit
                                ? "bg-success/20 text-success border-success/30"
                                : "bg-destructive/20 text-destructive border-destructive/30"
                            }`}
                          >
                            {isProfit ? "PROFIT" : "LOSS"}
                          </Badge>
                        </div>
                        <span
                          className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                            isProfit
                              ? "bg-success/15 text-success"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {isProfit ? "+" : ""}
                          {profitData.profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                      <p
                        className={`text-4xl font-bold font-mono tracking-tight ${
                          isProfit ? "text-success" : "text-destructive"
                        }`}
                      >
                        {isProfit ? "+" : "-"}$
                        {formatUSD(Math.abs(profitData.profitLossAmount))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Net position · Total value: $
                        {formatUSD(
                          Number.parseFloat(sellPrice) *
                            Number.parseFloat(quantity),
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {profitMutation.isError && (
                <div
                  className="rounded-xl p-4 bg-destructive/10 border border-destructive/20"
                  data-ocid="calculator.error_state"
                >
                  <p className="text-destructive text-sm">
                    Calculation failed. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — Tax Estimator */}
          <div
            className="rounded-2xl border border-border border-t-2 bg-card overflow-hidden shadow-lg relative"
            style={{ borderTopColor: "oklch(0.78 0.17 85)" }}
            data-ocid="tax.panel"
          >
            {/* Panel Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Tax Estimator
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Capital Gains Tax
                    </p>
                  </div>
                </div>
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 text-xs">
                  Step 2
                </Badge>
              </div>
            </div>

            {/* Panel Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Lock overlay when no P&L yet */}
              {!hasPnl && (
                <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 flex flex-col items-center gap-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Complete Step 1 first
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Calculate your P&amp;L to unlock tax estimation
                    </p>
                  </div>
                </div>
              )}

              {/* P&L Reference when available */}
              <AnimatePresence>
                {hasPnl && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 border flex items-center justify-between ${
                      isProfit
                        ? "bg-success/8 border-success/20"
                        : "bg-destructive/8 border-destructive/20"
                    }`}
                  >
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                        P&amp;L Result
                      </p>
                      <p
                        className={`font-bold text-lg font-mono ${
                          isProfit ? "text-success" : "text-destructive"
                        }`}
                      >
                        {isProfit ? "+" : "-"}$
                        {formatUSD(Math.abs(profitData!.profitLossAmount))}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        isProfit
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }`}
                    >
                      {isProfit ? "PROFIT" : "LOSS"}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tax Rate Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="taxPercent"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Your Tax Rate
                </Label>
                <div className="relative">
                  <Input
                    id="taxPercent"
                    type="number"
                    placeholder="e.g. 30"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    min={0}
                    max={100}
                    disabled={!hasPnl}
                    className="pr-10 bg-secondary/50 border-border/70 text-foreground text-base h-11 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors disabled:opacity-50"
                    data-ocid="tax.input"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Percent className="w-4 h-4 text-muted-foreground/60" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your country's capital gains tax rate.
                </p>
              </div>

              {/* Tax Button */}
              <Button
                onClick={handleTaxCalc}
                disabled={taxMutation.isPending || !profitData || !taxPercent}
                className="w-full h-12 text-base font-semibold text-black disabled:opacity-50 transition-all shadow-md"
                style={{
                  background: hasPnl
                    ? "linear-gradient(135deg, oklch(0.80 0.17 85), oklch(0.75 0.15 70))"
                    : undefined,
                }}
                variant={hasPnl ? "default" : "outline"}
                data-ocid="tax.submit_button"
              >
                {taxMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating Tax...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Estimate Tax Owed
                  </>
                )}
              </Button>

              {/* Tax Result */}
              <AnimatePresence>
                {taxData?.isTaxable && (
                  <motion.div
                    key="tax-result"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl p-5 bg-amber-500/8 border border-amber-500/25 relative overflow-hidden"
                    data-ocid="tax.success_state"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-10"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, oklch(0.78 0.17 85) 0%, transparent 70%)",
                      }}
                    />
                    <div className="relative space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                          Estimated Tax Owed
                        </p>
                        <p className="text-4xl font-bold font-mono text-amber-400 tracking-tight">
                          ${formatUSD(taxData.taxAmount)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">
                            Tax Rate
                          </p>
                          <p className="text-sm font-bold text-amber-400">
                            {taxPercent}%
                          </p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">
                            Net After Tax
                          </p>
                          <p className="text-sm font-bold text-success">
                            $
                            {formatUSD(
                              profitData!.profitLossAmount - taxData.taxAmount,
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                        ⚠️ Estimate only. Consult a qualified tax professional
                        for accurate advice.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {taxMutation.isError && (
                <div
                  className="rounded-xl p-4 bg-destructive/10 border border-destructive/20"
                  data-ocid="tax.error_state"
                >
                  <p className="text-destructive text-sm">
                    Tax calculation failed. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SupportAdStrip />
        </div>
      </motion.div>

      {/* No-Tax Dialog */}
      <Dialog open={showNoTaxDialog} onOpenChange={setShowNoTaxDialog}>
        <DialogContent className="bg-card border-border" data-ocid="tax.dialog">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              No Tax on Loss
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-muted-foreground">
              No tax on loss occurred. Capital losses generally do not incur tax
              liability.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Note: Some jurisdictions have different rules. Always consult a
              tax professional.
            </p>
          </div>
          <Button
            onClick={() => setShowNoTaxDialog(false)}
            className="w-full"
            data-ocid="tax.close_button"
          >
            Understood
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
