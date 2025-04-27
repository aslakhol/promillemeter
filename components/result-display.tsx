"use client"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalculationResult } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface ResultDisplayProps {
  result: CalculationResult | null
  showKm?: boolean
}

export function ResultDisplay({ result, showKm = false }: ResultDisplayProps) {
  if (!result) return null

  // Format the number to include spaces as thousand separators and only show decimals when necessary
  const formatNumber = (num: number) => {
    // First determine if we need decimals
    const needsDecimals = !Number.isInteger(num)

    // Format with appropriate decimal places
    const formatted = needsDecimals ? num.toFixed(2) : num.toString()

    // Add spaces as thousand separators
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  // Determine the unit based on showKm
  const unit = showKm ? "‰km" : "‰m"

  // Format the value based on showKm
  const value = showKm ? result.promillemeter / 1000 : result.promillemeter
  const formattedValue = formatNumber(value)

  const shareResults = async () => {
    const shareText = `My Promillemeter result: ${formattedValue} ${unit}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Promillemeter Result",
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        fallbackShare(shareText)
      }
    } else {
      fallbackShare(shareText)
    }
  }

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Your result has been copied to the clipboard.",
      })
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Result</span>
          <Button variant="outline" size="icon" onClick={shareResults}>
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share result</span>
          </Button>
        </CardTitle>
        <CardDescription>Based on your input data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground mb-2">Promillemeter</span>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tabular-nums">{formattedValue}</span>
            <span className="text-xl ml-2">{unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
