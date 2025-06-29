import { describe, expect, it } from "vitest";
import { roydonSunTimes } from "./daylight";

describe("suntimes", () => {
  const tests = [
    {
      date: new Date("2025-12-01"),
      expectedSunrise: "07:56:00",
      expectedSunset: "16:04:00",
    },
    {
      date: new Date("2025-11-01"),
      expectedSunrise: "07:22:00",
      expectedSunset: "16:38:00",
    },
    {
      date: new Date("2025-10-01"),
      expectedSunrise: "07:22:00",
      expectedSunset: "18:38:00",
    },
    {
      date: new Date("2025-09-01"),
      expectedSunrise: "06:20:00",
      expectedSunset: "19:40:00",
    },
    {
      date: new Date("2025-08-01"),
      expectedSunrise: "05:27:00",
      expectedSunset: "20:33:00",
    },
    {
      date: new Date("2025-07-01"),
      expectedSunrise: "05:00:00",
      expectedSunset: "21:00:00",
    },
    {
      date: new Date("2025-06-01"),
      expectedSunrise: "05:06:00",
      expectedSunset: "20:54:00",
    },
    {
      date: new Date("2025-05-01"),
      expectedSunrise: "05:43:00",
      expectedSunset: "20:17:00",
    },
    {
      date: new Date("2025-04-01"),
      expectedSunrise: "06:40:00",
      expectedSunset: "19:20:00",
    },
    {
      date: new Date("2025-03-01"),
      expectedSunrise: "06:42:00",
      expectedSunset: "17:18:00",
    },
    {
      date: new Date("2025-02-01"),
      expectedSunrise: "07:30:00",
      expectedSunset: "16:30:00",
    },
    {
      date: new Date("2025-01-01"),
      expectedSunrise: "08:00:00",
      expectedSunset: "16:00:00",
    },
  ];

  it.each(tests)(
    "test for $date",
    ({ date, expectedSunrise, expectedSunset }) => {
      const { sunset, sunrise } = roydonSunTimes(date);
      expect(sunrise.toLocaleTimeString()).toEqual(expectedSunrise);
      expect(sunset.toLocaleTimeString()).toEqual(expectedSunset);
    }
  );
});
