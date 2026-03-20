import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Currency } from "@/contexts/CurrencyContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Moon, Sun, TrendingUp, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", path: "/" },
  { label: "Calculator", path: "/calculator" },
  { label: "Converter", path: "/converter" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Live Prices", path: "/live" },
  { label: "News", path: "/news" },
  { label: "Support Us", path: "/support" },
];

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "JPY", "INR"];
const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};

export default function Navbar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Crypto<span className="text-primary">ProfitPro</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {/* Currency Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 transition-colors"
                data-ocid="nav.toggle"
              >
                {SYMBOLS[currency]} {currency}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              {CURRENCIES.map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={c === currency ? "text-primary" : ""}
                >
                  {SYMBOLS[c]} {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            aria-label="Toggle theme"
            data-ocid="nav.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          <Link to="/calculator">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              data-ocid="nav.primary_button"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2 px-3 pt-2 border-t border-border mt-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-muted-foreground"
              data-ocid="nav.toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <span className="ml-auto text-sm font-semibold text-muted-foreground">
              {SYMBOLS[currency]} {currency}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
