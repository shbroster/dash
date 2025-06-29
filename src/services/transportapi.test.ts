import { getRoydonTrains } from "./transportapi";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("transportapi", () => {
  const mockResponse = {
    departures: {
      all: [
        {
          origin_name: "London Liverpool Street",
          destination_name: "Cambridge",
          aimed_departure_time: "08:30",
          expected_departure_time: "08:35",
          status: "LATE",
        },
        {
          origin_name: "London Liverpool Street",
          destination_name: "Stansted Airport",
          aimed_departure_time: "08:45",
          expected_departure_time: "08:45",
          status: "ON TIME",
        },
        {
          origin_name: "London Liverpool Street",
          destination_name: "Cambridge",
          aimed_departure_time: "09:00",
          expected_departure_time: null,
          status: "CANCELLED",
        },
      ],
    },
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should make a request with correct parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await getRoydonTrains({
      app_id: "test_app_id",
      app_key: "test_app_key",
      cache: "off",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get("app_id")).toBe("test_app_id");
    expect(url.searchParams.get("app_key")).toBe("test_app_key");
    expect(url.searchParams.get("live")).toBe("true");
    expect(url.searchParams.get("to_offset")).toBe("PT10:00:00");
  });

  it("should transform API response correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getRoydonTrains({
      app_id: "test_app_id",
      app_key: "test_app_key",
      cache: "off",
    });

    expect(result).toHaveLength(3);

    // Test first train (delayed)
    expect(result[0].from).toBe("London Liverpool Street");
    expect(result[0].to).toBe("Cambridge");
    expect(result[0].status).toBe("Delayed");
    expect(result[0].time).toBeInstanceOf(Date);
    expect(result[0].expectedTime).toBeInstanceOf(Date);
    expect(result[0].time!.getHours()).toBe(8);
    expect(result[0].time!.getMinutes()).toBe(30);

    // Test second train (on time)
    expect(result[1].status).toBe("On Time");

    // Test third train (cancelled)
    expect(result[2].status).toBe("Cancelled");
    expect(result[2].expectedTime).toBeNull();
  });

  it("should handle API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    await expect(
      getRoydonTrains({
        app_id: "test_app_id",
        app_key: "test_app_key",
        cache: "off",
      })
    ).rejects.toThrow("Error fetching data: Not Found");
  });
});
