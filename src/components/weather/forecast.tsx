import { ArrowDown, ArrowUp } from "lucide-react";
import type { HourlyWeather } from "../../services/weatherapi";
import { AvgWeatherIcon } from "./weathericon";

type SmallForecast = {
  date: Date;
  maxTemp: number;
  minTemp: number;
  hourly: HourlyWeather;
};

type WeeklyForecastProps = {
  forecasts: SmallForecast[];
};

export function WeeklyForecast({ forecasts: forecast }: WeeklyForecastProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto py-2 px-1 -mx-1">
      {forecast.slice(0, 4).map((day, idx) => (
        <SmallForecast key={idx} idx={idx.toString()} forecast={day} />
      ))}
    </div>
  );
}

type SmallForecastProps = {
  idx: string;
  forecast: SmallForecast;
};

export function SmallForecast({ forecast, idx }: SmallForecastProps) {
  // Format date to be more compact (e.g., "Mon 1")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-UK", {
      weekday: "short",
      day: "numeric",
    });
  };

  const { date, maxTemp, minTemp, hourly } = forecast;

  return (
    <div key={idx} className="flex flex-col items-center min-w-[60px]">
      <p className="text-sm font-bold text-gray-600 mb-1">{formatDate(date)}</p>

      <div className="grid grid-cols-[auto_auto] grid-rows-2 items-center w-full">
        {/* Icon - spans both rows in first column */}
        <div className="row-span-2">
          <AvgWeatherIcon weather={hourly} size={26} />
        </div>
        {/* Max temp - top right */}
        <span className="text-xs font-medium flex items-centre">
          <ArrowUp className="inline h-3 w-3 self-center" />{" "}
          {Math.round(maxTemp)}°
        </span>
        {/* Min temp - bottom left */}
        <span className="text-xs font-medium flex items-centre text-muted-foreground">
          <ArrowDown className="inline h-3 w-3 self-center" />{" "}
          {Math.round(minTemp)}°
        </span>
      </div>
    </div>
  );
}
