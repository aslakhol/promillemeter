"use client";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Drink } from "@/lib/types";

interface DrinkInputProps {
  drinks: Drink[];
  onChange: (drinks: Drink[]) => void;
}

export function DrinkInput({ drinks, onChange }: DrinkInputProps) {
  const addDrink = () => {
    const newDrink: Drink = {
      id: `drink-${Date.now()}`,
      size: 0,
      alcoholPercentage: 0,
    };
    onChange([...drinks, newDrink]);
  };

  const updateDrink = (
    id: string,
    field: keyof Omit<Drink, "id">,
    value: number
  ) => {
    const updatedDrinks = drinks.map((drink) =>
      drink.id === id ? { ...drink, [field]: value } : drink
    );
    onChange(updatedDrinks);
  };

  const removeDrink = (id: string) => {
    const updatedDrinks = drinks.filter((drink) => drink.id !== id);
    onChange(updatedDrinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Drinker</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDrink}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Legg til drink
        </Button>
      </div>

      {drinks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Ingen drinker lagt til ennå. Klikk på knappen over for å legge til en
          drink.
        </p>
      )}

      {drinks.map((drink) => (
        <div
          key={drink.id}
          className="grid grid-cols-12 gap-4 items-end border p-4 rounded-md"
        >
          <div className="col-span-12 md:col-span-5">
            <Label htmlFor={`size-${drink.id}`}>Størrelse (ml)</Label>
            <Input
              id={`size-${drink.id}`}
              type="number"
              min="0"
              value={drink.size || ""}
              onChange={(e) =>
                updateDrink(
                  drink.id,
                  "size",
                  Number.parseFloat(e.target.value) || 0
                )
              }
            />
          </div>

          <div className="col-span-12 md:col-span-5">
            <Label htmlFor={`alcohol-${drink.id}`}>Alkohol (%)</Label>
            <Input
              id={`alcohol-${drink.id}`}
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={drink.alcoholPercentage || ""}
              onChange={(e) =>
                updateDrink(
                  drink.id,
                  "alcoholPercentage",
                  Number.parseFloat(e.target.value) || 0
                )
              }
            />
          </div>

          <div className="col-span-12 md:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeDrink(drink.id)}
              className="h-10 w-10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Fjern drink</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
