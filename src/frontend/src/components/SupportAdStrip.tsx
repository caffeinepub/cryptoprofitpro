import { Heart } from "lucide-react";

export default function SupportAdStrip() {
  return (
    <div
      className="mb-6 rounded-xl border border-border overflow-hidden"
      data-ocid="support_ad_strip.panel"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center py-1.5 border-b border-border bg-secondary/30">
        Advertisement
      </p>
      <div
        className="flex flex-col sm:flex-row items-center gap-4 p-4"
        style={{ background: "oklch(0.12 0.01 220)" }}
      >
        <div className="flex items-center gap-3 flex-1 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            If you want to support this page,{" "}
            <span className="text-foreground font-medium">
              click on the ads.
            </span>
          </p>
        </div>
        <div
          className="flex items-center justify-center gap-3 rounded-lg border border-border px-6 py-3 flex-shrink-0 w-full sm:w-auto"
          style={{ background: "oklch(0.10 0.01 220)" }}
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-muted-foreground/40 text-muted-foreground uppercase tracking-wider">
            Ad
          </span>
          <span className="text-sm text-muted-foreground">
            Your AdSense code goes here
          </span>
        </div>
      </div>
    </div>
  );
}
