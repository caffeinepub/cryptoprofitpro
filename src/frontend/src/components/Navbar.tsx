import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart2, Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", path: "/" },
  { label: "Calculator", path: "/calculator" },
  { label: "Live Prices", path: "/live" },
  { label: "News", path: "/news" },
  { label: "Support Us", path: "/support" },
];

export default function Navbar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
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

        <div className="hidden md:flex items-center gap-3">
          <Link to="/calculator">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              data-ocid="nav.primary_button"
            >
              Get Started
            </Button>
          </Link>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </div>
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
        </div>
      )}
    </header>
  );
}
