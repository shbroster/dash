import { Footprints } from "lucide-react";
import { use, useEffect, useState } from "react";

const walkTimeMins = 15; // time to walk to the station in minutes

function minuteDiff(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 1000 / 60) - walkTimeMins + 1; 
}

type LeaveTimeProps = {
  nextTrainTime?: Date;
};

export function LeaveTime({ nextTrainTime }: LeaveTimeProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // tick every 5 seconds
    const interval = setInterval(() => {
      setNow(new Date());
    }, 5_000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  if (!nextTrainTime) {
    return 
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
      {minutesToLeave} {minutesToLeave === 1 ? "min" : "mins"} <Footprints className={`inline ${leaveColour}`} />
    </span>
  );
}
