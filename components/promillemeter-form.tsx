"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrinkInput } from "./drink-input";
import { ResultDisplay } from "./result-display";
import { ExampleDataButtons } from "./example-data";
import type { UserData, Gender, CalculationResult } from "@/lib/types";
import { calculateResults } from "@/lib/calculations";
import { saveUserData, loadUserData, clearUserData } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
const initialUserData: UserData = {
  weight: undefined,
  gender: "male",
  masl: undefined,
  bacInput: null,
  drinks: [],
  drinkingDuration: undefined,
};

export function PromillemeterForm() {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showKm, setShowKm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("calculate");
  const resultRef = useRef<HTMLDivElement>(null);
  const shouldCalculateRef = useRef(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadUserData();
    if (savedData) {
      setUserData(savedData);
      // Don't automatically switch tabs based on saved data
    }
  }, []);

  const handleCalculate = useCallback(() => {
    // Validate input
    if (
      activeTab === "calculate" &&
      (!userData.weight || userData.weight <= 0)
    ) {
      toast({
        title: "Ugyldig vekt",
        description: "Vennligst skriv inn en gyldig vekt.",
        variant: "destructive",
      });
      return;
    }

    if (userData.bacInput === null && userData.drinks.length === 0) {
      toast({
        title: "Ingen BAC-data",
        description:
          "Vennligst skriv inn din BAC direkte eller legg til minst én drink.",
        variant: "destructive",
      });
      return;
    }

    const relevantData =
      activeTab === "direct"
        ? {
            bacInput: userData.bacInput,
            masl: userData.masl,
            drinks: [],
            weight: undefined,
            drinkingDuration: undefined,
            gender: userData.gender,
          }
        : {
            bacInput: null,
            masl: userData.masl,
            drinks: userData.drinks,
            weight: userData.weight,
            drinkingDuration: userData.drinkingDuration,
            gender: userData.gender,
          };

    const calculationResult = calculateResults(relevantData);
    setResult(calculationResult);
    saveUserData(userData);
  }, [activeTab, userData]);

  // Effect to handle calculation after state updates
  useEffect(() => {
    if (shouldCalculateRef.current) {
      handleCalculate();
      shouldCalculateRef.current = false;
    }
  }, [userData, activeTab, handleCalculate]);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [result]);

  const handleInputChange = <K extends keyof UserData>(
    field: K,
    value: UserData[K]
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleSelect = (exampleData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...exampleData }));
    // Only switch tabs if the example data explicitly contains bacInput
    if (exampleData.bacInput !== undefined) {
      setActiveTab(exampleData.bacInput !== null ? "direct" : "calculate");
    }
    shouldCalculateRef.current = true;
  };

  const toggleMaslUnit = () => {
    setShowKm(!showKm);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "direct") {
      handleInputChange("bacInput", 0);
      handleInputChange("drinks", []);
    } else {
      handleInputChange("bacInput", null);
    }
  };

  const isFormValid = () => {
    if (activeTab === "calculate") {
      const allDrinksValid = userData.drinks.every(
        (drink) => drink.size > 0 && drink.alcoholPercentage > 0
      );

      return (
        userData.weight !== undefined &&
        userData.weight > 0 &&
        userData.masl !== undefined &&
        userData.drinkingDuration !== undefined &&
        userData.drinks.length > 0 &&
        allDrinksValid
      );
    } else {
      return (
        userData.bacInput !== null &&
        userData.bacInput > 0 &&
        userData.masl !== undefined &&
        userData.masl >= 0
      );
    }
  };

  const handleReset = () => {
    setUserData(initialUserData);
    setResult(null);
    setActiveTab("calculate");
    clearUserData();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Promillemeter Kalkulator</CardTitle>
            <CardDescription>Finn din promillemeter</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleMaslUnit}
            >
              Bytt til {showKm ? "Meter" : "Kilometer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Nullstill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculate">Drikke</TabsTrigger>
              <TabsTrigger value="direct">‰</TabsTrigger>
            </TabsList>

            <TabsContent value="calculate" className="space-y-6 pt-4">
              {/* Personal Information for Drinks tab */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kropp</h3>

                <div className="grid gap-2">
                  <Label htmlFor="weight">Vekt (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="1"
                    value={userData.weight || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "weight",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Skriv inn din vekt i kilogram"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Kjønn</Label>
                  <RadioGroup
                    value={userData.gender}
                    onValueChange={(value: Gender) =>
                      handleInputChange("gender", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Mann</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Kvinne</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <DrinkInput
                drinks={userData.drinks}
                onChange={(drinks) => handleInputChange("drinks", drinks)}
              />

              <div className="grid gap-2">
                <Label htmlFor="drinking-duration">
                  Drikkevarighet (timer)
                </Label>
                <Input
                  id="drinking-duration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={userData.drinkingDuration ?? ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : Number.parseFloat(e.target.value);
                    handleInputChange(
                      "drinkingDuration",
                      value !== undefined && value < 0 ? 0 : value
                    );
                  }}
                  placeholder="Hvor lenge har du drukket?"
                />
              </div>
            </TabsContent>

            <TabsContent value="direct" className="space-y-6 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="bac-direct">Promille (‰)</Label>
                <Input
                  id="bac-direct"
                  type="number"
                  min="0"
                  step="0.1"
                  value={userData.bacInput ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "bacInput",
                      e.target.value === ""
                        ? null
                        : Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="Skriv inn promillen din"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* MASL Input - Common for both tabs */}
          <div className="grid gap-2">
            <Label htmlFor="masl">
              {showKm ? "Kilometer over havet" : "Meter over havet"}
            </Label>
            <Input
              id="masl"
              type="number"
              value={
                userData.masl !== undefined
                  ? showKm
                    ? userData.masl / 1000
                    : userData.masl
                  : ""
              }
              onChange={(e) =>
                handleInputChange(
                  "masl",
                  e.target.value === ""
                    ? undefined
                    : showKm
                    ? Number.parseFloat(e.target.value) * 1000
                    : Number.parseFloat(e.target.value)
                )
              }
              placeholder={`Skriv inn høyde i ${
                showKm ? "kilometer" : "meter"
              }`}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handleCalculate}
            disabled={!isFormValid()}
          >
            Regn ut
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div ref={resultRef}>
          <ResultDisplay result={result} showKm={showKm} />
        </div>
      )}

      <ExampleDataButtons onSelectExample={handleExampleSelect} />
    </div>
  );
}
