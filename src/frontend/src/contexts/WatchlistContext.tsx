import { createContext, useContext, useState } from "react";

interface WatchlistContextType {
  watchlist: string[];
  toggleWatch: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  toggleWatch: () => {},
  isWatched: () => false,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleWatch = (symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem("watchlist", JSON.stringify(next));
      return next;
    });
  };

  const isWatched = (symbol: string) => watchlist.includes(symbol);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatch, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
