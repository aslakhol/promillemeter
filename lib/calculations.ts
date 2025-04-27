import type { Gender, Drink, UserData, CalculationResult } from "./types";

export function calculateBAC(
  drinks: Drink[],
  weight: number,
  gender: Gender,
  drinkingDuration: number
): number {
  // r is 0.55 for women and 0.68 for men
  const r = gender === "female" ? 0.55 : 0.68;

  // Calculate total alcohol in grams
  const totalAlcohol = drinks.reduce((sum, drink) => {
    // Convert ml * percentage to grams of pure alcohol
    // Density of alcohol is approximately 0.789 g/ml
    // return sum + drink.size * (drink.alcoholPercentage / 100) * 0.789;
    // I cut the density reduction to make the numbers more like what we caluclated at the party.
    return sum + drink.size * (drink.alcoholPercentage / 100);
  }, 0);

  // Calculate BAC
  let bac = totalAlcohol / (weight * r) - 0.15 * drinkingDuration;

  // Ensure BAC is not negative
  bac = Math.max(0, bac);

  return bac;
}

export function calculatePromillemeter(bac: number, masl: number): number {
  // This formula works with both positive and negative MASL values
  return bac * masl;
}

export function calculateResults(userData: UserData): CalculationResult {
  let bac: number;

  if (userData.bacInput !== null) {
    // Use direct BAC input
    bac = userData.bacInput;
  } else {
    // Calculate BAC from drinks
    if (
      userData.weight === undefined ||
      userData.drinkingDuration === undefined ||
      userData.drinks.length === 0
    ) {
      throw new Error(
        "Weight, drinking duration, and at least one drink are required for BAC calculation"
      );
    }
    bac = calculateBAC(
      userData.drinks,
      userData.weight,
      userData.gender,
      userData.drinkingDuration
    );
  }

  if (userData.masl === undefined) {
    throw new Error("Height above sea level (masl) is required");
  }

  const promillemeter = calculatePromillemeter(bac, userData.masl);

  return {
    bac,
    promillemeter,
    heightAboveSeaLevel: userData.masl,
  };
}
