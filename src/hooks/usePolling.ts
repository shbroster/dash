import { useEffect, useRef, useState } from "react";

export const getNextInterval = (now: Date) => {
  const intervalTimes = [
    [5, 30],
    [6, 30],
    [6, 45],
    [7, 0],
    [7, 15],
    [7, 30],
    [8, 30],
    [9, 30],
    [10, 30],
    [11, 30],
    [12, 30],
    [13, 30],
    [14, 30],
    [15, 30],
    [16, 30],
    [17, 30],
    [18, 30],
    [19, 30],
    [20, 30],
    [21, 30],
    [22, 30],
    [23, 30],
  ];
  const nextPollTime = intervalTimes.find(([hour, minute]) => {
    const nextTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
    return nextTime > now;
  });

  const firstInterval = intervalTimes[0];
  const nextPollDate = nextPollTime
    ? new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        nextPollTime[0],
        nextPollTime[1]
      )
    : new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        firstInterval[0],
        firstInterval[1]
      );

  return nextPollDate.getTime() - now.getTime();
};

export function usePolling<T>(
  fetchData: () => Promise<T>,
  interval: (now: Date) => number | undefined,
  immediate: boolean = true
): { data: T | null; pollTime: Date | null; loading: boolean } {
  const [pollData, setData] = useState<{ data: T; pollTime: Date } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(immediate);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      if (!isMounted) return;

      try {
        const pollTime = new Date();
        const result = await fetchData();
        if (isMounted) {
          setData({ data: result, pollTime });
        }
      } catch (err) {
        console.error("Polling error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          const nextInterval = interval(new Date());
          if (nextInterval !== undefined) {
            timeoutRef.current = setTimeout(poll, nextInterval);
          }
        }
      }
    };

    if (immediate) {
      poll();
    }

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchData, interval, immediate]);

  const { data, pollTime } = pollData ?? { data: null, pollTime: null };
  return { data, pollTime, loading };
}
