import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              Crypto<span className="text-primary">ProfitPro</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time crypto profit calculator and tax estimator. Free to use.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Navigation
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Dashboard", path: "/" },
              { label: "Calculator", path: "/calculator" },
              { label: "Live Prices", path: "/live" },
              { label: "Support Us", path: "/support" },
            ].map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Partners
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.binance.com/en/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Binance
            </a>
            <a
              href="https://www.coinbase.com/join"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Coinbase
            </a>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Caffeine AI
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          Not financial advice. DYOR.
        </p>
      </div>
    </footer>
  );
}
