import SupportAdStrip from "@/components/SupportAdStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Rss,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface NewsItem {
  id: string;
  title: string;
  body: string;
  url: string;
  imageurl: string;
  source: string;
  published_on: number;
  categories: string;
}

const SKELETON_IDS = [
  "skel-1",
  "skel-2",
  "skel-3",
  "skel-4",
  "skel-5",
  "skel-6",
];

async function fetchCryptoNews(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    // Primary: CoinGecko news API — free, no key, no geo-block
    const res = await fetch("https://api.coingecko.com/api/v3/news", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const articles: any[] = Array.isArray(json) ? json : (json.data ?? []);
      if (articles.length > 0) {
        return articles.map((item: any, i: number) => {
          // Support both flat and nested (attributes) response shapes
          const attr = item.attributes ?? item;
          return {
            id: String(item.id ?? i),
            title: attr.title ?? "",
            body: attr.description
              ? String(attr.description)
                  .replace(/<[^>]*>/g, "")
                  .slice(0, 400)
              : "",
            url: attr.url ?? "",
            imageurl: attr.thumb_2x ?? attr.image_url ?? "",
            source: attr.news_site ?? attr.author ?? "CoinGecko",
            published_on: attr.published_at
              ? Math.floor(new Date(attr.published_at).getTime() / 1000)
              : Date.now() / 1000,
            categories: "Crypto",
          };
        });
      }
    }
  } catch (_) {
    clearTimeout(timeout);
  }

  // Fallback: single CoinTelegraph RSS via rss2json (only one request, avoids rate limiting)
  const fallbackController = new AbortController();
  const fallbackTimeout = setTimeout(() => fallbackController.abort(), 10000);
  try {
    const rssUrl = encodeURIComponent("https://cointelegraph.com/rss");
    const res2 = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=20`,
      { signal: fallbackController.signal },
    );
    clearTimeout(fallbackTimeout);
    if (res2.ok) {
      const data = await res2.json();
      if (
        data.status === "ok" &&
        Array.isArray(data.items) &&
        data.items.length > 0
      ) {
        return data.items.map((item: any, i: number) => ({
          id: `ct-${i}-${item.pubDate}`,
          title: item.title ?? "",
          body: item.description
            ? String(item.description)
                .replace(/<[^>]*>/g, "")
                .slice(0, 400)
            : "",
          url: item.link ?? "",
          imageurl: item.thumbnail ?? item.enclosure?.link ?? "",
          source: "CoinTelegraph",
          published_on: item.pubDate
            ? Math.floor(new Date(item.pubDate).getTime() / 1000)
            : Date.now() / 1000,
          categories: "Markets",
        }));
      }
    }
  } catch (_) {
    clearTimeout(fallbackTimeout);
  }

  throw new Error("Unable to load news. Please try again shortly.");
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)}d ago`;
}

const SOURCE_COLORS: Record<string, string> = {
  CoinTelegraph: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  CoinDesk: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Decrypt: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  CoinGecko: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

const CATEGORY_COLORS: Record<string, string> = {
  Bitcoin: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  ETH: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Markets: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  DeFi: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Crypto: "bg-primary/15 text-primary border-primary/25",
};

function getBadgeClasses(item: NewsItem): { label: string; classes: string } {
  const srcColor = SOURCE_COLORS[item.source];
  if (srcColor) return { label: item.source, classes: srcColor };
  const catColor = CATEGORY_COLORS[item.categories];
  if (catColor) return { label: item.categories, classes: catColor };
  return {
    label: item.source || "Crypto",
    classes: "bg-primary/15 text-primary border-primary/25",
  };
}

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-primary/20 via-secondary to-secondary/50 flex items-center justify-center ${className ?? ""}`}
    >
      <Newspaper className="w-10 h-10 text-primary/30" />
    </div>
  );
}

function HeroCard({ article }: { article: NewsItem }) {
  const badge = getBadgeClasses(article);
  const bodyText =
    article.body.length > 200
      ? `${article.body.slice(0, 200)}...`
      : article.body;
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300"
    >
      <div className="relative aspect-[21/9] overflow-hidden bg-secondary">
        {article.imageurl ? (
          <img
            src={article.imageurl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <PlaceholderImage />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge
            className={`mb-3 text-xs font-semibold border ${badge.classes}`}
          >
            {badge.label}
          </Badge>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-2 line-clamp-2">
            {article.title}
          </h2>
          {bodyText && (
            <p className="text-white/70 text-sm line-clamp-2 mb-4 hidden md:block">
              {bodyText}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 font-medium">
                {article.source}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-white/70">
                {getRelativeTime(article.published_on)}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/20 border border-primary/30 px-3 py-1 rounded-full group-hover:bg-primary/30 transition-colors">
              Read Article <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function NewsCard({ article, index }: { article: NewsItem; index: number }) {
  const badge = getBadgeClasses(article);
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {article.imageurl ? (
          <img
            src={article.imageurl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <PlaceholderImage />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge
          className={`absolute top-3 left-3 text-xs font-semibold border ${badge.classes}`}
        >
          {badge.label}
        </Badge>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1">
          {article.body}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">
            {article.source}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getRelativeTime(article.published_on)}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function SkeletonHero() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-[21/9] w-full" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export default function CryptoNewsPage() {
  const {
    data: articles,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery<NewsItem[]>({
    queryKey: ["cryptoNews"],
    queryFn: fetchCryptoNews,
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
    retry: 1,
    retryDelay: 3000,
  });

  const heroArticle = articles?.[0];
  const gridArticles = articles?.slice(1, 13) ?? [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                  Crypto News
                </h1>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                Real-time crypto headlines
                {dataUpdatedAt
                  ? ` • Updated ${getRelativeTime(dataUpdatedAt / 1000)}`
                  : ""}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* News Feed */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Error State */}
            {isError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                <p className="text-destructive font-medium mb-1">
                  Failed to load news.
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {(error as Error)?.message ??
                    "Please check your connection and try again."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                <SkeletonHero />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SKELETON_IDS.map((id) => (
                    <SkeletonCard key={id} />
                  ))}
                </div>
              </div>
            )}

            {/* Hero Article */}
            {!isLoading && !isError && heroArticle && (
              <HeroCard article={heroArticle} />
            )}

            {/* News Grid */}
            {!isLoading && !isError && gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gridArticles.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Market Intelligence Info Card */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">
                    Market Intelligence
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stay ahead with real-time crypto market news, in-depth
                  analysis, and breaking stories from top financial publishers
                  worldwide.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    { icon: TrendingUp, label: "CoinGecko News" },
                    { icon: Newspaper, label: "CoinTelegraph" },
                    { icon: Rss, label: "Live Headlines" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary/70" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad Slots */}
              <SupportAdStrip />
              <SupportAdStrip />
            </div>
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8">
          <SupportAdStrip />
        </div>
      </motion.div>
    </div>
  );
}
