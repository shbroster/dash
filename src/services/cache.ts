import type { Train } from "../components/trains";

const CACHE_KEY = "roydon-trains";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const getCachedTrains = (): Train[] | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  if (!isCacheValid(data)) return null;

  return data.data;
};

export const setCachedTrains = (data: Train[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const isCacheValid = (cached: { timestamp: number }): boolean => {
  return Date.now() - cached.timestamp < CACHE_TTL_MS;
};
