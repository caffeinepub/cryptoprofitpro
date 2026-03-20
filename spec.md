# CryptoProfitPro - Part 1 Feature Additions

## Current State
- App has: HomePage (live prices top 10, hero, shortcut tiles), LivePricesPage (top 50 with search/refresh), CalculatorPage (profit/loss + tax estimator), CryptoNewsPage (RSS feeds), SupportUsPage (affiliate links)
- Navbar has 5 links: Dashboard, Calculator, Live Prices, News, Support Us
- Dark theme only (no toggle)
- Prices always shown in USD
- No watchlist, no portfolio tracker, no converter
- useGetCryptoPrices hook fetches from CoinGecko, returns CryptoPriceExtended[]

## Requested Changes (Diff)

### Add
- **Fear & Greed Index widget** on HomePage below the hero section (fetched from alternative.me API: `https://api.alternative.me/fng/`)
- **Crypto Converter page** at `/converter` -- user picks coin from dropdown, enters amount, selects target currency (USD, EUR, GBP, JPY, INR), shows converted result using live prices
- **Portfolio Tracker page** at `/portfolio` -- user adds holdings (coin + quantity), app calculates total value using live prices, persisted in localStorage
- **Watchlist** -- star icon on LivePricesPage and HomePage table rows, starred coins stored in localStorage, watchlist section shown at top of LivePricesPage
- **Currency Switcher** -- global context to switch display currency (USD, EUR, GBP, JPY, INR) using exchange rates from exchangerate.host or hardcoded approximate rates as fallback; affects price display across all pages
- **Dark/Light Mode Toggle** -- button in Navbar to toggle between dark and light theme; persisted in localStorage

### Modify
- **Navbar**: add Converter and Portfolio nav links; add dark/light mode toggle button; add currency switcher dropdown
- **HomePage**: add Fear & Greed widget section; add star/watchlist icons to market table rows
- **LivePricesPage**: add watchlist section at top; add star icons to rows
- **index.css**: add light mode CSS variables
- **useQueries.ts**: add useFearGreedIndex hook; add currency conversion utility

### Remove
- Nothing removed

## Implementation Plan
1. Add light mode CSS variables to index.css
2. Create ThemeContext and CurrencyContext providers in App.tsx
3. Add useFearGreedIndex hook to useQueries.ts
4. Create FearGreedWidget component
5. Create WatchlistContext using localStorage
6. Add star toggle to LivePricesPage and HomePage table rows
7. Create ConverterPage
8. Create PortfolioPage
9. Update Navbar with theme toggle, currency switcher, new nav links
10. Add Fear & Greed widget to HomePage
11. Apply currency conversion to price displays across pages
