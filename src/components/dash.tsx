import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Sun, Train, CalendarDays, ListTodo } from "lucide-react";

export default function HomeDashboard() {
  return (
    <div className="w-screen min-w-full bg-muted p-0 auto-rows-fr grid grid-cols-4 gap-4">
      {/* Calendar Section */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      {/* Trains Section */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="w-5 h-5" /> Trains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>08:03</span>
            <span>London Victoria</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>08:17</span>
            <span>Clapham Junction</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>08:35</span>
            <span>Brighton</span>
          </div>
        </CardContent>
      </Card>

      {/* Weather Section */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" /> Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-medium">15°C, Partly Cloudy</div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>High: 18°C</span>
            <span>Low: 10°C</span>
          </div>
          <div>Humidity: 65%</div>
        </CardContent>
      </Card>

      {/* To-Do Section */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="w-5 h-5" /> To-Do
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="task1" />
            <label htmlFor="task1" className="text-sm">Take out the trash</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task2" defaultChecked />
            <label htmlFor="task2" className="text-sm">Check train status</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task3" />
            <label htmlFor="task3" className="text-sm">Buy groceries</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
