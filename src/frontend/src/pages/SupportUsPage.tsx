import SupportAdStrip from "@/components/SupportAdStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Heart } from "lucide-react";
import { motion } from "motion/react";

const partners = [
  {
    name: "Binance",
    description:
      "World's largest crypto exchange. Trade 350+ cryptocurrencies with low fees.",
    url: "https://www.binance.com/en/register",
    tag: "Exchange",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    name: "Coinbase",
    description:
      "Easy crypto for beginners. The most trusted platform to buy, sell, and manage crypto.",
    url: "https://www.coinbase.com/join",
    tag: "Exchange",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    name: "Caffeine AI",
    description:
      "Build your own full-stack app with AI. No code needed — just describe and deploy.",
    url: "https://caffeine.ai",
    tag: "Platform",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
];

export default function SupportUsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Support <span className="text-primary">CryptoProfitPro</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This tool is completely free to use. If it helped you, please
            support us by signing up through our partner links below or clicking
            the ad at the bottom. Every click helps keep this tool free for
            everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className={`bg-card border ${p.borderColor} hover:shadow-teal transition-all duration-300 h-full`}
                data-ocid={`support.item.${i + 1}`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`px-2 py-0.5 rounded text-xs font-medium ${p.bgColor} ${p.color} border ${p.borderColor}`}
                    >
                      {p.tag}
                    </div>
                  </div>
                  <h3
                    className={`font-display text-xl font-bold mb-2 ${p.color}`}
                  >
                    {p.name}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-5 leading-relaxed">
                    {p.description}
                  </p>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      className={`w-full gap-2 ${p.bgColor} ${p.color} border ${p.borderColor} hover:opacity-80`}
                      variant="outline"
                      data-ocid="support.primary_button"
                    >
                      Visit {p.name} <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <SupportAdStrip />
        </div>
      </motion.div>
    </div>
  );
}
