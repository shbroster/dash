import { Footprints } from "lucide-react";
import { useTickProvider } from "../../providers/tickprovider";

const walkTimeMins = 15; // time to walk to the station in minutes

function minuteDiff(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 1000 / 60) - walkTimeMins + 1;
}

type LeaveTimeProps = {
  nextTrainTime?: Date;
};

export function LeaveTime({ nextTrainTime }: LeaveTimeProps) {
  const { everyMinute: now } = useTickProvider();

  if (!nextTrainTime) {
    return;
  }

  const minutesToLeave = minuteDiff(nextTrainTime, now);
  const leaveColour =
    minutesToLeave >= 0
      ? "text-muted-foreground"
      : minutesToLeave >= -4
      ? "text-orange-500"
      : "text-red-500";

  return (
    <span className=" text-muted-foreground">
      {minutesToLeave} {minutesToLeave === 1 ? "min" : "mins"}{" "}
      <Footprints className={`inline ${leaveColour}`} />
    </span>
  );
}
