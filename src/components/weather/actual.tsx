import {
  ArrowDown,
  ArrowUp,
  CloudFog,
  Flashlight,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";

type ActualWeatherProps = {
  Icon: LucideIcon;
  temperature: {
    current: number;
    maxTemp: number;
    minTemp: number;
    rising: boolean;
  };
  indicators: {
    rainInNextHour: boolean;
    darkInNextHour: boolean;
    fogInNextHour: boolean;
    windInNextHour: boolean;
  };
};

export function ActualWeather({
  Icon,
  temperature,
  indicators,
}: ActualWeatherProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 grid-rows-2">
        {/* Weather icon */}
        <div className="flex items-center justify-center row-span-2">
          <Icon className="h-23 w-23 text-yellow-500" />
        </div>

        {/* Temperature */}
        <CurrentTemperature temperature={temperature} />

        {/* Indicators */}
        <div className="flex items-center justify-center gap-0.5">
          <Umbrella
            className={`h-8 w-8 ${
              indicators.rainInNextHour
                ? ""
                : "text-muted-foreground brightness-190"
            }`}
          />
          <Flashlight
            className={`h-8 w-8 ${
              indicators.darkInNextHour
                ? ""
                : "text-muted-foreground brightness-190"
            }`}
          />
          <CloudFog
            className={`h-8 w-8 ${
              indicators.fogInNextHour
                ? ""
                : "text-muted-foreground brightness-190"
            }`}
          />
          <Wind
            className={`h-8 w-8 ${
              indicators.windInNextHour
                ? ""
                : "text-muted-foreground brightness-190"
            }`}
          />
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
