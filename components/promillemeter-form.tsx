"use client";

import { useState, useEffect, useRef } from "react";
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
import { BacInput } from "./bac-input";
import { ResultDisplay } from "./result-display";
import { ExampleDataButtons } from "./example-data";
import type { UserData, Gender, CalculationResult } from "@/lib/types";
import { calculateResults } from "@/lib/calculations";
import { saveUserData, loadUserData } from "@/lib/storage";
import { toast } from "@/components/ui/use-toast";

const initialUserData: UserData = {
  weight: 70,
  gender: "male",
  masl: 0,
  bacInput: null,
  drinks: [],
  drinkingDuration: 0,
};

export function PromillemeterForm() {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showKm, setShowKm] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadUserData();
    if (savedData) {
      setUserData(savedData);
    }
  }, []);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [result]);

  const handleCalculate = () => {
    // Validate input
    if (userData.weight <= 0) {
      toast({
        title: "Ugyldig vekt",
        description: "Vennligst skriv inn en gyldig vekt.",
        variant: "destructive",
      });
      return;
    }

    // No validation needed for MASL as it can be negative for places below sea level

    if (userData.bacInput === null && userData.drinks.length === 0) {
      toast({
        title: "Ingen BAC-data",
        description:
          "Vennligst skriv inn din BAC direkte eller legg til minst én drink.",
        variant: "destructive",
      });
      return;
    }

    // Calculate results
    const calculationResult = calculateResults(userData);
    setResult(calculationResult);

    // Save to local storage
    saveUserData(userData);
  };

  const handleInputChange = <K extends keyof UserData>(
    field: K,
    value: UserData[K]
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleSelect = (exampleData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...exampleData }));
  };

  const toggleMaslUnit = () => {
    if (showKm) {
      // Convert back to meters
      handleInputChange("masl", userData.masl * 1000);
    } else {
      // Convert to kilometers
      handleInputChange("masl", userData.masl / 1000);
    }
    setShowKm(!showKm);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Promillemeter Kalkulator</CardTitle>
          <CardDescription>Finn din promillemeter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personlig informasjon</h3>

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

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="masl">
                  {showKm ? "Kilometer over havet" : "Meter over havet"}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleMaslUnit}
                >
                  Bytt til {showKm ? "Meter" : "Kilometer"}
                </Button>
              </div>
              <Input
                id="masl"
                type="number"
                value={userData.masl || ""}
                onChange={(e) =>
                  handleInputChange(
                    "masl",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                placeholder={`Skriv inn høyde i ${
                  showKm ? "kilometer" : "meter"
                }`}
              />
            </div>
          </div>

          {/* BAC Input */}
          <BacInput
            bacInput={userData.bacInput}
            drinks={userData.drinks}
            drinkingDuration={userData.drinkingDuration}
            onBacChange={(value) => handleInputChange("bacInput", value)}
            onDrinksChange={(value) => handleInputChange("drinks", value)}
            onDurationChange={(value) =>
              handleInputChange("drinkingDuration", value)
            }
          />

          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handleCalculate}
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

      {/* Example scenarios moved to the bottom */}
      <Card>
        <CardHeader>
          <CardTitle>Eksempel-scenarier</CardTitle>
          <CardDescription>
            Prøv disse forhåndskonfigurerte eksemplene
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExampleDataButtons onSelectExample={handleExampleSelect} />
        </CardContent>
      </Card>
    </div>
  );
}
