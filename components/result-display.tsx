"use client";
import { Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResult } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface ResultDisplayProps {
  result: CalculationResult | null;
  showKm?: boolean;
}

export function ResultDisplay({ result, showKm = false }: ResultDisplayProps) {
  if (!result) return null;

  // Format the number to include spaces as thousand separators and only show decimals when necessary
  const formatNumber = (num: number) => {
    // First determine if we need decimals
    const needsDecimals = !Number.isInteger(num);

    // Format with appropriate decimal places
    const formatted = needsDecimals ? num.toFixed(2) : num.toString();

    // Add spaces as thousand separators
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Convert value to kilometers if needed for display
  const displayValue = showKm
    ? result.promillemeter / 1000
    : result.promillemeter;
  const formattedValue = formatNumber(displayValue);

  const copyToClipboard = async () => {
    const shareText = `Min Promillemeter er ${formattedValue} ${
      showKm ? "‰km" : "‰m"
    }
    
    Sjekk din promillemeter på https://promillemeter.aslak.io`;

    await navigator.clipboard.writeText(shareText);
    toast({
      title: "Kopiert til utklippstavlen",
      description: "Ditt resultat har blitt kopiert til utklippstavlen.",
    });
  };

  const shareResults = async () => {
    const shareText = `Min Promillemeter er ${formattedValue} ${
      showKm ? "‰km" : "‰m"
    }
    
    Sjekk din på https://promillemeter.aslak.io`;

    try {
      await navigator.share({
        title: "Promillemeter Resultat",
        text: shareText,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Din promillemeter</span>
          <div className="flex gap-2">
            {typeof navigator !== "undefined" && navigator.share && (
              <Button variant="outline" size="icon" onClick={shareResults}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Del resultat</span>
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Kopier til utklippstavlen</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground mb-2">
            Promillemeter
          </span>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tabular-nums">
              {formattedValue}
            </span>
            <span className="text-xl ml-2">{showKm ? "‰km" : "‰m"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
