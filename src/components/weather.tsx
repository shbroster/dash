import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, ArrowUp, ArrowDown, Thermometer, Wind, Sunrise, Sunset, Rainbow } from "lucide-react";
import { useEffect, useState } from "react";
import { getRoydonWeather } from "@/services/weatherapi";
import { useTickProvider } from "@/providers/tickprovider";
import { CardAction, CardFooter } from "./ui/card";
import type { CurrentWeather, HourlyWeather } from "../services/weatherapi";
import { AvgWeatherIcon } from "./weathericon";
import { LargeForecast, WeeklyForecast } from "./forecast";

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
}

const splitHourly = (
  data: HourlyWeather,
  dayStart = 7,
  dayEnd = 22
): HourlyWeather[] => {
  const splitData: HourlyWeather[] = [];
  const chunkSize = 24; // Split into 24-hour chunks

  for (let i = 0; i < data.time.length; i += chunkSize) {
    // Only look at data between 06:00 and 21:00
    const chunk: HourlyWeather = {
      time: data.time.slice(i + dayStart, i + dayEnd),
      temperature2m: data.temperature2m.slice(i + dayStart, i + dayEnd),
      apparentTemperature: data.apparentTemperature.slice(i, i + dayEnd),
      windSpeed10m: data.windSpeed10m.slice(i + dayStart, i + dayEnd),
      windGusts10m: data.windGusts10m.slice(i + dayStart, i + dayEnd),
      windDirection10m: data.windDirection10m.slice(i + dayStart, i + dayEnd),
      precipitation: data.precipitation.slice(i + dayStart, i + dayEnd),
      rain: data.rain.slice(i + dayStart, i + dayEnd),
      showers: data.showers.slice(i + dayStart, i + dayEnd),
      snowfall: data.snowfall.slice(i + dayStart, i + dayEnd),
      cloudCover: data.cloudCover.slice(i + dayStart, i + dayEnd),
      visibility: data.visibility.slice(i + dayStart, i + dayEnd),
    };
    splitData.push(chunk);
  }

  return splitData;
};

export default function WeatherCard() {
  const { everyMinute: timeNow } = useTickProvider();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // TODO: fix intermittent loading screens
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getRoydonWeather();
        setWeatherData(data as unknown as WeatherData);
        setError(null);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeNow]);

  if (loading && !weatherData) {
    return <WeatherCardSkeleton />;
  }

  if (error || !weatherData) {
    return (
      <Card >
        <CardHeader>
          <CardTitle className="text-lg">Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error || "No weather data available"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { current, hourly } = weatherData;

  // Calculate temperature trend (compare with 1 hour ago)
  const currentTemp = current.temperature2m;
  const oneHourAgoIndex = hourly.time.findIndex(
    (time) => time.getTime() <= current.time.getTime() - 3600000
  );
  const oneHourAgoTemp =
    oneHourAgoIndex >= 0 ? hourly.temperature2m[oneHourAgoIndex] : currentTemp;
  const tempTrend =
    currentTemp > oneHourAgoTemp
      ? "rising"
      : currentTemp < oneHourAgoTemp
      ? "falling"
      : "steady";

  // Find min/max for the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTemps = Array.from(hourly.temperature2m).filter((_, i) => {
    const time = hourly.time[i];
    return time >= today && time < tomorrow;
  });

  const minTemp = Math.min(...todayTemps);
  const maxTemp = Math.max(...todayTemps);

  // Check if it will rain in the next hour
  const nextHourIndex = hourly.time.findIndex(
    (time) => time.getTime() > current.time.getTime()
  );
  const willRain =
    nextHourIndex >= 0 &&
    (hourly.rain[nextHourIndex] > 0 ||
      (hourly.rain.length > nextHourIndex + 1 &&
        hourly.rain[nextHourIndex + 1] > 0));

  const forecast = splitHourly(hourly, 0, 23).map((chunk) => ({
    date: chunk.time[0],
    maxTemp: Math.max(...chunk.temperature2m),
    minTemp: Math.min(...chunk.temperature2m),
    icon: <AvgWeatherIcon weather={hourly} size={26} />,
  }));

  // TODO FIX ME
  const largeForecast = {
    date: timeNow,
    maxTemp: forecast[0].maxTemp,
    minTemp: forecast[0].minTemp,
    icon: forecast[0].icon,
    temperature: currentTemp,
    termperatureRising: false,
    sunrise: new Date(),
    sunset: new Date(),
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Rainbow className="h-5 w-5" />
          Weather
        </CardTitle>
        <CardAction>
          <div className="text-muted-foreground flex gap-0.5">
            <Sunrise className="inline h-4.5 w-4.5" /> 10:41
            <Sunset className="inline h-4.5 w-4.5 ml-3" /> 10:41
            </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-1 space-y-1">
        <div className="flex items-center justify-between">
          <LargeForecast forecast={largeForecast} />
        </div>

        <div className="flex items-center justify-between text-sm"></div>
      </CardContent>
      <CardFooter>
        <WeeklyForecast forecasts={forecast} />
      </CardFooter>
    </Card>
  );
}

function WeatherCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
      </CardContent>
    </Card>
  );
}
