export type Gender = "male" | "female";

export interface Drink {
  id: string;
  size: number; // in ml
  alcoholPercentage: number; // in %
}

export interface UserData {
  weight: number | undefined; // in kg
  gender: Gender;
  masl: number | undefined; // meters above sea level
  bacInput: number | null; // direct BAC input in ‰
  drinks: Drink[];
  drinkingDuration: number | undefined; // in hours
}

export interface CalculationResult {
  bac: number; // in ‰
  promillemeter: number;
  heightAboveSeaLevel: number; // in meters
}

export interface ExampleData {
  name: string;
  data: Partial<UserData>;
  description: string;
}
