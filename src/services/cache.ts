import z from "zod";

const CACHE_KEY = "roydon-trains";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const zTrain = z.object({
  time: z.coerce.date().nullable(),
  expectedTime: z.coerce.date().nullable(),
  from: z.string().nullable(),
  to: z.string().nullable(),
  status: z.enum(["On Time", "Delayed", "Cancelled"]),
});
type Train = z.infer<typeof zTrain>;

export const getCachedTrains = (): Train[] | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  if (!isCacheValid(data)) return null;

  return zTrain.array().parse(data.data);
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
