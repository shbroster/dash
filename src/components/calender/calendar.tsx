import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTickProvider } from "../../providers/tickprovider";
import GoogleOfflineAuth from "./auth";
import { useEffect, useState } from "react";
import z from "zod";
import { CalendarEvent } from "./event";
import { identify } from "./attendee";

const zEmail = z
  .object({
    email: z.string(),
  })
  .transform((o) => o.email);

const zDate = z
  .object({
    date: z
      .string()
      .optional()
      .transform((d) => (d !== undefined ? new Date(d) : undefined)),
    dateTime: z
      .string()
      .optional()
      .transform((d) => (d !== undefined ? new Date(d) : undefined)),
  })
  .refine((d) => d.date || d.dateTime);

const zEvent = z
  .object({
    id: z.string(),
    summary: z.string(),
    creator: zEmail,
    organizer: zEmail,
    start: zDate,
    end: zDate,
    attendees: zEmail.array(),
  })
  .transform((e) => ({
    id: e.id,
    summary: e.summary,
    attendees: new Set(e.attendees.map(identify)),
    startDate: (e.start.date ?? e.start.dateTime) as Date,
    endDate: (e.end.date ?? e.end.dateTime) as Date,
    time:
      e.start.dateTime && e.end.dateTime
        ? ([e.start.dateTime, e.end.dateTime] as const)
        : undefined,
    location: undefined,
  }));
type Event = z.infer<typeof zEvent>;

const formatDatetime = (date: Date) => {
  return date.toLocaleDateString("en-UK", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function CalendarCard() {
  const { everyMinute: timeNow } = useTickProvider();
  const [token, setToken] = useState<string>(null);
  const [events, setEvents] = useState<Event[]>([]);

  async function callCalendarWithFetch(accessToken: string, timeMin: Date) {
    const params = new URLSearchParams({
      orderBy: "startTime",
      singleEvents: "true",
      timeMin: timeMin.toISOString(),
      maxResults: "10",
    });
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log("Upcoming events:", data.items);
    return zEvent.array().parse(data.items);
  }

  useEffect(() => {
    if (!token) return;

    const getEvents = async () => {
      const newEvents = await callCalendarWithFetch(token, new Date());
      console.log(newEvents);
      setEvents(newEvents);
    };

    getEvents();
  }, [token]);

  return (
    <Card
      className={cn(
        "flex flex-col h-full min-h-0 gap-3 overflow-hidden justify-between"
      )}
    >
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2")}>
          <CalendarDays className={cn("w-5 h-5")} /> Calendar
        </CardTitle>
        <CardAction>
          <div className="text-muted-foreground">{formatDatetime(timeNow)}</div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <GoogleOfflineAuth setAccessToken={setToken} />
        <div>
          {events && events.map((e) => <CalendarEvent key={e.id} event={e} />)}
        </div>
      </CardContent>
    </Card>
  );
}
