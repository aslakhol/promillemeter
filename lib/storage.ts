import type { UserData } from "./types";

const STORAGE_KEY = "promillemeter_user_data";

export function saveUserData(userData: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }
}

export function loadUserData(): UserData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  }
  return null;
}

export function clearUserData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
