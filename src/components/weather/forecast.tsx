import {
  ArrowDown,
  ArrowUp,
  CloudFog,
  Flashlight,
  Sun,
  Sunrise,
  Sunset,
  Umbrella,
  Wind,
} from "lucide-react";

type SmallForecast = {
  date: Date;
  maxTemp: number;
  minTemp: number;
  icon: React.ReactNode;
};

type LargeForecast = SmallForecast & {
  temperature: number;
  temperatureRising: boolean;
  sunset: Date;
  sunrise: Date;
};

type WeeklyForecastProps = {
  forecasts: SmallForecast[];
};

type SmallForecastProps = {
  idx: string;
  forecast: SmallForecast;
};

type LargeForecastProps = {
  forecast: LargeForecast;
};

function formatTime(date: Date): string {
  return date.toLocaleString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function WeeklyForecast({ forecasts: forecast }: WeeklyForecastProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto py-2 px-1 -mx-1">
      {forecast.slice(0, 4).map((day, idx) => (
        <SmallForecast key={idx} idx={idx.toString()} forecast={day} />
      ))}
    </div>
  );
}

export function SmallForecast({ forecast, idx }: SmallForecastProps) {
  // Format date to be more compact (e.g., "Mon 1")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-UK", {
      weekday: "short",
      day: "numeric",
    });
  };

  const { date, maxTemp, minTemp, icon } = forecast;

  return (
    <div key={idx} className="flex flex-col items-center min-w-[60px]">
      <p className="text-sm font-bold text-gray-600 mb-1">{formatDate(date)}</p>

      <div className="grid grid-cols-[auto_auto] grid-rows-2 items-center w-full">
        {/* Icon - spans both rows in first column */}
        <div className="row-span-2">{icon}</div>
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

// Wind direciton
// Umbrella or not
// real data
// Bigger>
// Start from today for history
export function LargeForecast({ forecast }: LargeForecastProps) {
  const { date, maxTemp, minTemp, icon, sunrise, sunset } = forecast;
  const temperature = {
    current: forecast.temperature,
    maxTemp: maxTemp,
    minTemp: minTemp,
    rising: forecast.temperatureRising,
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-7">
        {/* <div className="flex justify-between">
          <span className="text-xs flex items-centre font-light">
            <Sunrise className="h-4 w-4 mr-0.5" />
            {formatTime(new Date())}
          </span>
          <span className="text-xs flex items-centre font-light ">
            <Sunset className="h-4 w-4 mr-0.5" />
            {formatTime(new Date())}
          </span>
        </div> */}
        <div className="grid grid-cols-2 grid-rows-2">
          {/* Weather icon */}
          <div className="flex items-center justify-center row-span-2">
            <Sun className="h-23 w-23 text-yellow-500" />
          </div>

          {/* Temperature */}
          <CurrentTemperature temperature={temperature} />

          {/* Indicators */}
          <div className="flex items-center justify-center gap-0.5">
            <Umbrella className="h-8 w-8 text-muted-foreground brightness-190 s" />
            <Flashlight className="h-8 w-8 text-muted-foreground brightness-190" />
            <CloudFog className="h-8 w-8" />
            <Wind className="h-8 w-8 text-muted-foreground brightness-190" />
          </div>
        </div>
      </div>
    </div>
  );
}

type CurrentTemperatureProps = {
  temperature: {
    current: number;
    maxTemp: number;
    minTemp: number;
    rising: boolean;
  };
};

export function CurrentTemperature({ temperature }: CurrentTemperatureProps) {
  return (
    <div className="grid grid-cols-[auto_auto_auto_auto] items-end justify-start">
      <div className="flex justify-center">
        {/* Arrow icon based on temperature rising */}
        {temperature.rising ? (
          <ArrowUp className="h-8 w-8 text-red-500" />
        ) : (
          <ArrowDown className="h-8 w-8 text-blue-500" />
        )}
      </div>

      {/* Main temperature */}
      <div className="text-5xl font-bold">
        {Math.round(temperature.current)}
      </div>

      {/* High and low temperatures */}
      <div className="flex flex-col h-12 justify-between py-1">
        <span className="text-sm flex items-centre font-medium">
          {Math.round(temperature.maxTemp)}
        </span>
        <span className="text-sm flex items-centre font-medium text-muted-foreground">
          {Math.round(temperature.minTemp)}
        </span>
      </div>

      {/* Unit */}
      <div className="text-3xl text-muted-foreground ml-1.5 items-start">
        °C
      </div>
    </div>
  );
}

export function XXXForecast() {
  // Placeholder for future implementation
  return (
    <div className="flex flex-col h-12 justify-between py-1">
      <span className="text-xs flex items-centre font-light">
        <Sunrise className="h-4 w-4 mr-0.5" />
        {formatTime(new Date())}
      </span>
      <span className="text-xs flex items-centre font-light ">
        <Sunset className="h-4 w-4 mr-0.5" />
        {formatTime(new Date())}
      </span>
    </div>
  );
}
