import z from "zod";

const CACHE_KEY = "roydon-trains";

const createTime = (date: Date, hours: number, minutes: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);

const getCacheExpiryTime = (now: Date): number => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours < 5 || (hours === 5 && minutes < 30)) {
    // Use cached data until 5.30
    return createTime(now, 5, 30).getTime();
  } else if ((hours === 6 && minutes >= 30) || (hours === 7 && minutes < 30)) {
    // Between 6:30 and 7:30, use 15 minute cache
    return createTime(now, now.getHours(), now.getMinutes() + 15).getTime();
  } else {
    // Use cached data for the next hour
    return createTime(now, now.getHours() + 1, now.getMinutes()).getTime();
  }
};
const zTrain = z.object({
  time: z.coerce.date().nullable(),
  expectedTime: z.coerce.date().nullable(),
  from: z.string().nullable(),
  to: z.string().nullable(),
  status: z.enum(["On Time", "Delayed", "Cancelled"]),
});
type Train = z.infer<typeof zTrain>;

const zCache = z.object({
  expiryTime: z.number(),
  cacheTime: z.number(),
  trains: zTrain.array(),
});
type Cache = z.infer<typeof zCache>;

export const getCachedTrains = (): Cache | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  if (!isCacheValid(data)) return null;

  return zCache.parse(data);
};

export const setCachedTrains = (trains: Train[]): void => {
  if (typeof window === "undefined");
  const now = new Date();
  const cache: Cache = {
    trains,
    expiryTime: getCacheExpiryTime(now),
    cacheTime: now.getTime(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

const isCacheValid = (cache: { expiryTime: number }): boolean => {
  return Date.now() < cache.expiryTime;
};
