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

export type Train = {
  time: Date;
  expectedTime: Date;
  from: string;
  to: string;
  status: "On Time" | "Delayed" | "Cancelled";
};

export type TrainsCardProps = {
  timeNow: Date;
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

export default function TrainsCard({ trains, timeNow }: TrainsCardProps) {
  const sortedTrains = trains
    .sort((a, b) => a.expectedTime.getTime() - b.expectedTime.getTime())
    .filter((t) => t.expectedTime.getTime() > timeNow.getTime())
    .slice(0, 5);
  const minutesToLeave = minuteDiff(sortedTrains[0].expectedTime, timeNow);
  const leaveColour =
    minutesToLeave >= 0
      ? "text-gray-600"
      : minutesToLeave >= -4
      ? "text-orange-400"
      : "text-red-500";

  return (
    <Card className="flex flex-col h-full overflow-y-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>
            <RailSymbol className="w-5 h-5 text-red-600 inline transform scale-x-150" />{" "}
            Trains
          </span>
        </CardTitle>
        <CardAction>
          <span className={`text-sm ${leaveColour}`}>
            {minutesToLeave} mins{" "}
            <Footprints className={`inline ${leaveColour}`} />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 grid-cols-[auto_auto_1fr] gap-y-1 gap-x-4 items-center">
          {sortedTrains.map((train, index) => (
            <Fragment key={index}>
              <div className="flex flex-col leading-tight">
                <span>{getTime(train.expectedTime)}</span>
                <span className="text-xs text-gray-400 align-bottom">
                  {train.expectedTime.getTime() !== train.time.getTime()
                    ? getTime(train.time)
                    : null}
                </span>
              </div>
              <span
                className={`text-left ${
                  train.status === "Cancelled" && "line-through text-gray-400"
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
    </Card>
  );
}
