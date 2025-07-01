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

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-UK", {
    weekday: "short",
    day: "numeric",
  });
};

function formatTime(date: Date): string {
  return date.toLocaleString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function CalendarCard() {
  const { everyMinute: timeNow } = useTickProvider();

  return (
    <Card className={cn("flex flex-col h-full")}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2")}>
          <CalendarDays className={cn("w-5 h-5")} /> Calendar
        </CardTitle>
        <CardAction>
          <div className="text-muted-foreground">
            {formatTime(timeNow)} {formatDate(timeNow)}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
