import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import CalculatorPage from "@/pages/CalculatorPage";
import ConverterPage from "@/pages/ConverterPage";
import CryptoNewsPage from "@/pages/CryptoNewsPage";
import HomePage from "@/pages/HomePage";
import LivePricesPage from "@/pages/LivePricesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import SupportUsPage from "@/pages/SupportUsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

function RootLayout() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <WatchlistProvider>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 pb-[90px] md:pb-[90px]">
                <Outlet />
              </main>
              <Footer />
              <AdBanner />
            </div>
            <Toaster />
          </QueryClientProvider>
        </WatchlistProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calculator",
  component: CalculatorPage,
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live",
  component: LivePricesPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: CryptoNewsPage,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: SupportUsPage,
});

const converterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/converter",
  component: ConverterPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio",
  component: PortfolioPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  calculatorRoute,
  liveRoute,
  newsRoute,
  supportRoute,
  converterRoute,
  portfolioRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
