import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CryptoPrice,
  ProfitCalculation,
  TaxCalculation,
} from "../backend.d";
import { useActor } from "./useActor";

// Extended type with optional image/name
export interface CryptoPriceExtended extends CryptoPrice {
  name?: string;
  image?: string;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];
export { SKELETON_KEYS as NEWS_SKELETON_KEYS };

async function fetchCoinGeckoPrices(): Promise<CryptoPriceExtended[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h",
      { signal: controller.signal },
    );
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
    const data: any[] = await res.json();
    return data.map((item) => ({
      symbol: `${item.symbol.toUpperCase()}USDT`,
      price: item.current_price ?? 0,
      changePercent: item.price_change_percentage_24h ?? 0,
      volume: item.total_volume ?? 0,
      name: item.name,
      image: item.image,
    })) as CryptoPriceExtended[];
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export function useGetCryptoPrices() {
  return useQuery<CryptoPriceExtended[]>({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCoinGeckoPrices,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
    retryDelay: 2000,
  });
}

export function useCalculateProfit() {
  const { actor } = useActor();
  return useMutation<
    ProfitCalculation,
    Error,
    { buyPrice: number; sellPrice: number; quantity: number }
  >({
    mutationFn: async ({ buyPrice, sellPrice, quantity }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.calculateProfit(buyPrice, sellPrice, quantity);
    },
  });
}

export function useCalculateTax() {
  const { actor } = useActor();
  return useMutation<
    TaxCalculation,
    Error,
    { profitAmount: number; taxPercent: number }
  >({
    mutationFn: async ({ profitAmount, taxPercent }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.calculateTax(profitAmount, taxPercent);
    },
  });
}
