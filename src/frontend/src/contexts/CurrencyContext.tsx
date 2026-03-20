import { createContext, useContext, useState } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "INR";

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  INR: 83.2,
};

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  convertPrice: (n) => n,
  formatPrice: (n) => `$${n.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem("currency");
    return (RATES[stored as Currency] ? stored : "USD") as Currency;
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  };

  const convertPrice = (usdPrice: number) => usdPrice * RATES[currency];

  const formatPrice = (usdPrice: number) => {
    const converted = usdPrice * RATES[currency];
    const sym = SYMBOLS[currency];
    if (currency === "JPY" || currency === "INR") {
      return `${sym}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `${sym}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: converted < 0.01 ? 8 : 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertPrice, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
