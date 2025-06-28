import type { Train } from "../components/trains";
import { z } from "zod";

const timestringToDate = (timeString: string | null): Date | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(":");
  if (!hours || !minutes) return null;
  // Create a date object with today's date and the provided time
  const today = new Date();
  today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return today;
};

const zTransportApiTrainStatus = z.enum([
  "ARRIVED",
  "CANCELLED",
  "CHANGE OF IDENTITY",
  "CHANGE OF ORIGIN",
  "EARLY",
  "LATE",
  "NO REPORT",
  "OFF ROUTE",
  "ON TIME",
  "REINSTATEMENT",
  "STARTS HERE",
  "DELAYED",
  "BUS",
]);

const zTransportApiTrain = z
  .object({
    origin_name: z.string().nullable(),
    destination_name: z.string().nullable(),
    aimed_departure_time: z.string().nullable().transform(timestringToDate),
    expected_departure_time: z.string().nullable().transform(timestringToDate),
    status: zTransportApiTrainStatus.nullable().transform((status) => {
      switch (status) {
        case "ARRIVED":
        case "EARLY":
        case "NO REPORT":
        case "STARTS HERE":
        case "ON TIME":
        case "OFF ROUTE":
        case "REINSTATEMENT":
        case "CHANGE OF ORIGIN":
        case "CHANGE OF IDENTITY":
        case null:
          return "On Time" as const;
        case "CANCELLED":
        case "BUS":
          return "Cancelled" as const;
        case "DELAYED":
        case "LATE":
          return "Delayed" as const;
        default:
          console.error(`Unexpected status: ${status}`);
          return "On Time" as const;
      }
    }),
  })
  .transform((train) => ({
    time: train.aimed_departure_time,
    expectedTime: train.expected_departure_time,
    from: train.origin_name,
    to: train.destination_name,
    status: train.status,
  }));

const zTransportApiResp = z.object({
  depatures: z.object({
    all: z.array(zTransportApiTrain),
  }),
});

type Parameters = {
  live?: boolean;
  to_offset?: string;
  app_id: string;
  app_key: string;
};

const defaultParams: Partial<Parameters> = {
  live: true,
  to_offset: "PT10:00:00",
};

export async function getRoydonTrains(params: Parameters): Promise<Train[]> {
  const queryParams = { ...defaultParams, ...params };
  const url = new URL(
    "https://transportapi.com/v3/uk/train/station/Roydon.json"
  );
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] !== undefined) {
      url.searchParams.append(key, queryParams[key]);
    }
  });

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error(`Error fetching data: ${resp.statusText}`);
  }
  const data = await resp.json();
  const parsedData = zTransportApiResp.parse(data);
  return parsedData.depatures.all;
}
