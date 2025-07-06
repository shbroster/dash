import { Bird, Cat, Squirrel } from "lucide-react";
import type { Identity } from "./attendee";

type Attendee = "Sam" | "Kat";
type Event = {
  summary: string;
  attendees: Set<Attendee | null>;
  startDate: Date;
  endDate: Date;
  time?: readonly [Date, Date];
  location?: string;
};

const isSameDay = (dateA: Date, dateB: Date) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

function formatTime(date: Date): string {
  return date.toLocaleString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-UK", {
    month: "short",
    day: "numeric",
  });
};

type AttendeeProps = {
  attendees: Event["attendees"];
};

function Attendees({ attendees }: AttendeeProps) {
  return (
    <>
      {[...attendees].toSorted().map((attendee, i) => {
        const Icon = attendeeIcon(attendee);
        const colour = attendeeColour(attendee);
        return (
          <span
            key={i}
            className={`${colour} rounded-full w-5 h-5 flex items-center justify-center`}
          >
            <Icon className="h-4 w-4 text-gray-200" />
          </span>
        );
      })}
    </>
  );
}

type EventTimeProps = {
  startDate: Event["startDate"];
  endDate: Event["endDate"];
  time?: Event["time"];
};

function EventTime({ startDate, endDate, time }: EventTimeProps) {
  return (
    <div className="w-10 text-right">
      {!isSameDay(startDate, endDate) ? (
        <div className="grid grid-cols-[auto]">
          <div className="text-xs brightness-80 whitespace-nowrap">
            {formatDate(startDate)}
          </div>
          <div className="text-xs brightness-60 whitespace-nowrap">
            {formatDate(endDate)}
          </div>
        </div>
      ) : time !== undefined ? (
        <div className="grid grid-cols-[auto]">
          <div className="text-xs brightness-80 whitespace-nowrap">
            {formatTime(time[0])}
          </div>
          <div className="text-xs brightness-60 whitespace-nowrap">
            {formatTime(time[1])}
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground brightness-140 whitespace-nowrap">
          All day
        </div>
      )}
    </div>
  );
}

type CalendarEventProps = {
  event: Event;
};

export function CalendarEvent({ event }: CalendarEventProps) {
  const isActive = event.startDate.getTime() <= Date.now();
  const startDate =
    event.startDate.getTime() >= Date.now() ? event.startDate : new Date();

  return (
    <div className="flex items-start gap-2 py-0.5">
      {/* Date Column */}
      <div className="text-center w-12 flex-shrink-0">
        <div
          className={`text-xs ${
            isActive ? "text-sky-600" : "text-muted-foreground"
          }`}
        >
          {startDate.toLocaleDateString("en-UK", { weekday: "short" })}
        </div>

        <div
          className={`text-base font-bold ${isActive ? "text-sky-600" : ""}`}
        >
          {startDate.getDate()}
        </div>
      </div>

      {/* Event Details */}
      <div
        className={`flex-1 rounded-lg p-1 text-sm min-w-0 ${
          isActive ? "bg-sky-50" : "bg-muted/90"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className={`font-medium line-clamp-1 text-left ml-1 ${
              event.summary.length > 18 ? "text-xs" : "text-sm"
            }`}
          >
            {event.summary}
          </div>
          <div className="flex gap-1 items-center">
            <Attendees attendees={event.attendees} />
            <div className="mr-2 ml-1">
              <EventTime {...event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const attendeeIcon = (id: Identity | null) => {
  switch (id) {
    case "Kat":
      return Cat;
    case "Sam":
      return Squirrel;
    default:
      return Bird;
  }
};

const attendeeColour = (attendee: Attendee | null) => {
  switch (attendee) {
    case "Kat":
      return "bg-teal-500";
    case "Sam":
      return "bg-indigo-500";
    default:
      return "bg-grey-500";
  }
};
