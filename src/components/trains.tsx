import { OctagonAlert, OctagonX, RailSymbol } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useState } from "react";
import { CardFooter } from "./ui/card";
import { LeaveTime } from "./leavetime";
import { useTickProvider } from "../providers/tickprovider";
import { getRoydonTrains } from "../services/transportapi";
import { cn } from "../lib/utils";

export type Train = {
  time: Date | null;
  expectedTime: Date | null;
  from: string | null;
  to: string | null;
  status: "On Time" | "Delayed" | "Cancelled";
};

export type TrainsCardProps = {
  dataUpdatedAt: Date | null;
  trains: Array<Train>;
};

function getTime(date: Date | null): string {
  if (date === null) return "?"
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const sortAndFilterTrains = (
  trains: Array<Train>,
  timeNow: Date
): Array<Train> => {
  return trains
    .filter((t) => t.expectedTime !== null && t.time !== null)
    .filter(
      (t) =>
        t.to !== "Cambridge" &&
        t.to !== "Bishops Stortford" &&
        t.to !== "Cambridge North" &&
        t.to !== "Ely (Cambs)"
    )
    .sort((a, b) => a.expectedTime!.getTime() - b.expectedTime!.getTime())
    .filter((t) => t.expectedTime!.getTime() > timeNow.getTime())
    .slice(0, 5);
};

// TODO: Add cn from lib/utils.ts for classnames
// TODO: Testing
// TODO: Warning color scheme

export default function TrainsCard() {
  const { everyMinute: timeNow } = useTickProvider();
  const [queryTime, setQueryTime] = useState<Date>()
  const [sortedTrains, setSortedTrains] = useState<Train[]>([])

  useEffect(() => {
    const updateTrains = async () => {
      console.log("Fetching trains at", timeNow.toLocaleTimeString(), import.meta.env)
      const { trains, queriedAt} = await getRoydonTrains({
        app_id: import.meta.env.VITE_APP_ID,
        app_key: import.meta.env.VITE_APP_KEY,
        cache: import.meta.env.VITE_CACHE_MODE,
        testing: import.meta.env.VITE_TEST_MODE !== "false",
      })
      setSortedTrains(sortAndFilterTrains(trains, timeNow))
      setQueryTime(queriedAt)
    }

    updateTrains()
  }, [timeNow])

  return (
    <Card className={cn("flex flex-col h-full min-h-0 gap-3 overflow-hidden justify-between")}>
      <CardHeader className={cn("flex flex-row items-start justify-between")}>
        <CardTitle className={cn("flex items-center gap-2")}>
          <span>
            <RailSymbol className={cn("w-5 h-5 text-red-600 inline transform scale-x-150")} />{" "}
            Trains
          </span>
        </CardTitle>
        <CardAction>
          <div className={cn("text-sm text-right")}>
            <LeaveTime
              nextTrainTime={sortedTrains[0]?.expectedTime ?? undefined}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className={cn("flex-1 min-h-0 space-y-2 overflow-y-hidden")}>
        <div className={cn("grid grid-cols-3 grid-cols-[auto_auto_1fr] gap-y-1 gap-x-4 items-center")}>
          {sortedTrains.map((train, index) => (
            <Fragment key={index}>
              <div className={cn("flex flex-col leading-none")}>
                <span>{getTime(train.expectedTime)}</span>
                <span className={cn("text-xs text-muted-foreground align-bottom")}>
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
      <CardFooter className="flex w-full justify-end -mb-4 pb-0">
        {queryTime && (
          <div className="text-xs text-muted-foreground">
            last query {queryTime.toLocaleTimeString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
