import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ListTodo, Maximize2 } from "lucide-react";
import { useState } from "react";
import TrainsCard from "./trains/trains";
import { cn } from "../lib/utils";
import WeatherCard from "./weather/weather";
import { CalendarCard } from "./calender/calendar";

export default function HomeDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-[1480px] h-[320px] bg-muted p-4 grid grid-cols-4 gap-4 overflow-hidden"
      style={{ margin: 0 }}
    >
      {/* Fullscreen */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? undefined : <Maximize2 className="h-5 w-5" />}
      </Button>

      {/* Calendar Section */}
      <CalendarCard />

      {/* Trains Section */}
      <TrainsCard />

      {/* Weather Section */}
      <WeatherCard />

      {/* To-Do Section */}
      <Card className={cn("flex flex-col h-full")}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2")}>
            <ListTodo className={cn("w-5 h-5")} /> To-Do
          </CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-2")}>
          {/*} <div className="flex items-center space-x-2">
            <Checkbox id="task1" />
            <label htmlFor="task1" className="text-sm">
              Take out the trash
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task2" defaultChecked />
            <label htmlFor="task2" className="text-sm">
              Check train status
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task3" />
            <label htmlFor="task3" className="text-sm">
              Buy groceries
            </label>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
