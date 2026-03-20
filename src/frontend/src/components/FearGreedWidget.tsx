import { useQuery } from "@tanstack/react-query";

interface FngData {
  value: string;
  value_classification: string;
  timestamp: string;
}

async function fetchFearGreed(): Promise<FngData> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error("Failed to fetch Fear & Greed index");
  const json = await res.json();
  return json.data[0];
}

function getColor(value: number): string {
  if (value <= 25) return "text-red-500";
  if (value <= 45) return "text-orange-400";
  if (value <= 55) return "text-yellow-400";
  if (value <= 75) return "text-green-400";
  return "text-emerald-400";
}

function getStrokeColor(value: number): string {
  if (value <= 25) return "oklch(0.6 0.25 22)";
  if (value <= 45) return "oklch(0.72 0.18 55)";
  if (value <= 55) return "oklch(0.82 0.17 85)";
  if (value <= 75) return "oklch(0.7 0.2 142)";
  return "oklch(0.65 0.18 155)";
}

function getLabel(value: number): string {
  if (value <= 25) return "Extreme Fear";
  if (value <= 45) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 75) return "Greed";
  return "Extreme Greed";
}

export default function FearGreedWidget() {
  const { data, isLoading, isError } = useQuery<FngData>({
    queryKey: ["fearGreed"],
    queryFn: fetchFearGreed,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });

  const value = data ? Number.parseInt(data.value, 10) : 50;
  const color = getColor(value);
  const strokeColor = getStrokeColor(value);
  const label = data ? data.value_classification : getLabel(value);

  const radius = 52;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 flex flex-col items-center"
      data-ocid="sentiment.card"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
        Market Sentiment
      </p>

      {isLoading && (
        <div
          className="flex flex-col items-center gap-2"
          data-ocid="sentiment.loading_state"
        >
          <div className="w-28 h-16 bg-secondary/50 rounded-full animate-pulse" />
          <div className="w-20 h-4 bg-secondary/50 rounded animate-pulse" />
        </div>
      )}

      {isError && (
        <div className="text-center py-2" data-ocid="sentiment.error_state">
          <p className="text-destructive text-xs">Unable to load</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="relative">
            <svg
              width="128"
              height="72"
              viewBox="0 0 128 72"
              role="img"
              aria-label={`Fear & Greed Index: ${value} - ${label}`}
            >
              <title>{`Fear & Greed Index: ${value} - ${label}`}</title>
              <path
                d="M 8 68 A 56 56 0 0 1 120 68"
                fill="none"
                stroke="oklch(0.22 0.02 220)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 8 68 A 56 56 0 0 1 120 68"
                fill="none"
                stroke={strokeColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end">
              <span className={`text-3xl font-bold font-display ${color}`}>
                {value}
              </span>
            </div>
          </div>
          <span className={`text-sm font-bold mt-1 ${color}`}>{label}</span>
          {data?.timestamp && (
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(
                Number.parseInt(data.timestamp, 10) * 1000,
              ).toLocaleDateString()}
            </span>
          )}
        </>
      )}
    </div>
  );
}
