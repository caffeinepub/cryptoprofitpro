export default function AdBanner() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 h-[50px] md:h-[90px] border-t border-border flex items-center justify-center"
      style={{ background: "oklch(0.12 0.01 220)" }}
      data-ocid="ad.panel"
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-muted-foreground/40 text-muted-foreground uppercase tracking-wider">
          Ad
        </span>
        <span className="text-sm text-muted-foreground">
          Advertisement — Your AdSense code goes here
        </span>
      </div>
    </div>
  );
}
