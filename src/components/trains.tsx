import { Footprints, OctagonAlert, OctagonX, RailSymbol } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";
import { CardFooter } from "./ui/card";

export type Train = {
  time: Date | null;
  expectedTime: Date | null;
  from: string | null;
  to: string | null;
  status: "On Time" | "Delayed" | "Cancelled";
};

export type TrainsCardProps = {
  timeNow: Date;
  dataUpdatedAt: Date | null;
  trains: Array<Train>;
};

function getTime(date: Date): string {
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function minuteDiff(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 1000 / 60) - 15;
}

// TODO: Add a last updated at timestamp
// TODO: Add cn from lib/utils.ts for classnames
// TODO: Dark mode
// TODO: Testing
// TODO: Warning color scheme

export default function TrainsCard({
  trains,
  timeNow,
  dataUpdatedAt,
}: TrainsCardProps) {
  const sortedTrains = trains
    .filter((t) => t.expectedTime !== null && t.time !== null)
    .filter((t) => t.to !== "Cambridge" && t.to !== "Bishops Stortford")
    .sort((a, b) => a.expectedTime!.getTime() - b.expectedTime!.getTime())
    .filter((t) => t.expectedTime!.getTime() > timeNow.getTime())
    .slice(0, 7);

  const minutesToLeave =
    sortedTrains.length > 0
      ? minuteDiff(sortedTrains[0].expectedTime, timeNow)
      : 0;
  const leaveColour =
    minutesToLeave >= 0
      ? "text-muted-foreground"
      : minutesToLeave >= -4
      ? "text-orange-500"
      : "text-red-500";

  return (
    <Card className="flex flex-col h-full gap-3 overflow-y-hidden">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="flex items-center gap-2">
          <span>
            <RailSymbol className="w-5 h-5 text-red-600 inline transform scale-x-150" />{" "}
            Trains
          </span>
        </CardTitle>
        <CardAction>
          <div className="text-right">
            <div className="text-sm text-right text-muted-foreground">
              {minutesToLeave} mins{" "}
              <Footprints className={`inline ${leaveColour}`} />
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-hidden">
        <div className="grid grid-cols-3 grid-cols-[auto_auto_1fr] gap-y-1 gap-x-4 items-center">
          {sortedTrains.map((train, index) => (
            <Fragment key={index}>
              <div className="flex flex-col leading-none">
                <span>{getTime(train.expectedTime)}</span>
                <span className="text-xs text-muted-foreground align-bottom">
                  {train.expectedTime.getTime() !== train.time.getTime()
                    ? getTime(train.time)
                    : null}
                </span>
              </div>
              <span
                className={`text-left ${
                  train.status === "Cancelled" &&
                  "line-through text-muted-foreground"
                }`}
              >
                {train.to}
              </span>
              <span
                className={`text-sm flex justify-end ${
                  train.status === "Delayed"
                    ? "text-orange-500"
                    : train.status === "Cancelled"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {train.status === "Delayed" && <OctagonAlert />}
                {train.status === "Cancelled" && <OctagonX />}
              </span>
              {index < sortedTrains.length - 1 && (
                <Separator className="col-span-3 my-1" />
              )}
            </Fragment>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        {dataUpdatedAt && (
          <div className="text-xs text-muted-foreground">
            updated at {dataUpdatedAt.toLocaleTimeString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
