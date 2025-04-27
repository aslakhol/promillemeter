"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrinkInput } from "./drink-input";
import type { Drink } from "@/lib/types";

interface BacInputProps {
  bacInput: number | null;
  drinks: Drink[];
  drinkingDuration: number;
  onBacChange: (bac: number | null) => void;
  onDrinksChange: (drinks: Drink[]) => void;
  onDurationChange: (duration: number) => void;
}

export function BacInput({
  bacInput,
  drinks,
  drinkingDuration,
  onBacChange,
  onDrinksChange,
  onDurationChange,
}: BacInputProps) {
  const [activeTab, setActiveTab] = useState<string>(
    bacInput !== null ? "direct" : "calculate"
  );

  useEffect(() => {
    // If bacInput is null, switch to "calculate" tab
    // If bacInput has a value, switch to "direct" tab
    setActiveTab(bacInput !== null ? "direct" : "calculate");
  }, [bacInput]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "direct") {
      onBacChange(0);
    } else {
      onBacChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculate">Drikke</TabsTrigger>
          <TabsTrigger value="direct">‰</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="bac-direct">Blodalkoholinnhold (‰)</Label>
            <Input
              id="bac-direct"
              type="number"
              min="0"
              step="0.1"
              value={bacInput || ""}
              onChange={(e) =>
                onBacChange(Number.parseFloat(e.target.value) || 0)
              }
              placeholder="Skriv inn promillen din"
            />
          </div>
        </TabsContent>

        <TabsContent value="calculate" className="space-y-6 pt-4">
          <DrinkInput drinks={drinks} onChange={onDrinksChange} />

          <div className="grid gap-2">
            <Label htmlFor="drinking-duration">Drikkevarighet (timer)</Label>
            <Input
              id="drinking-duration"
              type="number"
              min="0"
              step="0.5"
              value={drinkingDuration || ""}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value);
                onDurationChange(value < 0 ? 0 : value || 0);
              }}
              placeholder="Hvor lenge har du drukket?"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
