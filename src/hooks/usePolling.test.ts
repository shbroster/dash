import { renderHook, waitFor } from "@testing-library/react";
import { getNextInterval, usePolling } from "./usePolling";
import { vi, describe, beforeEach, it, expect } from "vitest";

const getIntervalFunc = () => {
  let count = 0;
  return () => {
    count += 1;
    if (count === 3) {
      return undefined;
    }
    return 50;
  };
};

describe("usePolling", () => {
  const mockFetchData = vi.fn();
  const mockInterval = 1000;

  beforeEach(() => {
    mockFetchData.mockClear();
  });

  it("should fetch data immediately when immediate is true", async () => {
    mockFetchData.mockResolvedValue("test data");
    const intervalFunc = getIntervalFunc();

    const { result } = renderHook(() =>
      usePolling(mockFetchData, intervalFunc, true)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(mockFetchData).toHaveBeenCalledTimes(1);
    });

    expect(result.current.data).toBe("test data");
    expect(result.current.pollTime).toBeInstanceOf(Date);

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(2);
    });
  });

  it("should not fetch immediately when immediate is false", () => {
    const intervalFunc = getIntervalFunc();

    const { result } = renderHook(() =>
      usePolling(mockFetchData, intervalFunc, false)
    );

    expect(result.current.loading).toBe(false);
    expect(mockFetchData).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Failed to fetch");
    mockFetchData.mockResolvedValueOnce("test data");
    mockFetchData.mockRejectedValueOnce(error);
    console.error = vi.fn();

    const { result } = renderHook(() =>
      usePolling(mockFetchData, () => mockInterval)
    );

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(2);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("test data");
    expect(console.error).toHaveBeenCalledWith("Polling error:", error);
  });

  it("should clean up interval on unmount", async () => {
    mockFetchData.mockResolvedValue("test data");
    const intervalFunc = getIntervalFunc();

    const { unmount } = renderHook(() =>
      usePolling(mockFetchData, intervalFunc, true)
    );
    unmount();

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFetchData).toHaveBeenCalledTimes(1);
  });
});

describe("getNextInterval", () => {
  it("should return correct time until next interval", () => {
    // Set a known date: June 28, 2025 08:00:00
    const mockDate = new Date(2025, 5, 28, 8, 0, 0);

    // Next interval should be at 08:30
    const result = getNextInterval(mockDate);
    expect(result).toBe(0.5 * 60 * 60 * 1000); // 0.5 hours in milliseconds
  });

  it("should wrap around to next day if past last interval", () => {
    // Set time to 23:45, past the last interval of 23:30
    const mockDate = new Date(2025, 5, 28, 23, 45, 0);

    // Next interval should be at 05:30 next day
    const result = getNextInterval(mockDate);
    // 0.25 hours until midnight + 5.5 hours = 5.75 hours = 40500000 ms
    expect(result).toBe(5.75 * 60 * 60 * 1000); // 5.75 hours in milliseconds
  });
});
