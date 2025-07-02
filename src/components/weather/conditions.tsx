import {
  Sun,
  Cloudy,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudSun,
  CloudRainWind,
  SunSnow,
  CloudMoon,
  Moon,
  type LucideIcon,
} from "lucide-react";
import {
  type CurrentWeather,
  type HourlyWeather,
} from "../../services/weatherapi";

type WeatherCondition =
  | "snow"
  | "heavy-rain"
  | "rain"
  | "light-rain"
  | "cloudy"
  | "partly-cloudy"
  | "wind"
  | "light-wind"
  | "strong-wind"
  | "fog";

// Determine the weather condition
export const getCurrentWeatherConditions = (weather: CurrentWeather) => {
  const { precipitation, snowfall, cloudCover, windSpeed10m, windGusts10m } =
    weather;

  const conditions: Array<WeatherCondition> = [];
  if (snowfall > 0) conditions.push("snow");
  if (precipitation > 5) conditions.push("heavy-rain");
  if (precipitation > 0.5 && precipitation <= 5) conditions.push("rain");
  if (precipitation > 0.1 && precipitation <= 0.5)
    conditions.push("light-rain");
  if (cloudCover > 80) conditions.push("cloudy");
  if (cloudCover > 50) conditions.push("partly-cloudy");
  if (
    (windSpeed10m > 50 && windSpeed10m <= 61) ||
    (windGusts10m > 70 && windGusts10m <= 85)
  )
    conditions.push("light-wind"); // 7 On the Beaufort scale
  if (
    (windSpeed10m > 62 && windSpeed10m <= 88) ||
    (windGusts10m > 85 && windGusts10m <= 125)
  )
    conditions.push("wind"); // 8 - 9 On the Beaufort scale
  if (windSpeed10m > 89 || windGusts10m > 125) conditions.push("strong-wind"); // 10+ On the Beaufort scale

  console.log("Current weather conditions:", conditions, weather);
  return conditions;
};

export const getAvgWeatherConditions = (weather: HourlyWeather) => {
  const rain = weather.precipitation.reduce((a, b) => a + b, 0);
  const snowfall = weather.snowfall.reduce((a, b) => a + b, 0);
  const cloudCover =
    weather.cloudCover.reduce((a, b) => a + b, 0) / weather.cloudCover.length;
  const windSpeed10m =
    weather.windSpeed10m.reduce((a, b) => a + b, 0) /
    weather.windSpeed10m.length;
  const windGusts10m =
    weather.windGusts10m.reduce((a, b) => a + b, 0) /
    weather.windGusts10m.length;
  const visibility =
    weather.visibility.reduce((a, b) => a + b, 0) / weather.visibility.length;

  const conditions: Array<WeatherCondition> = [];
  if (snowfall > 0) conditions.push("snow");
  if (rain > 30) conditions.push("heavy-rain");
  if (rain > 2 && rain <= 30) conditions.push("rain");
  if (rain > 1 && rain <= 2) conditions.push("light-rain");
  if (cloudCover > 80) conditions.push("cloudy");
  if (cloudCover > 65) conditions.push("partly-cloudy");
  if (
    (windSpeed10m > 20 && windSpeed10m <= 30) ||
    (windGusts10m > 30 && windGusts10m <= 40)
  )
    conditions.push("light-wind");
  if (
    (windSpeed10m > 30 && windSpeed10m <= 40) ||
    (windGusts10m > 40 && windGusts10m <= 50)
  )
    conditions.push("wind");
  if (windSpeed10m > 40 || windGusts10m > 50) conditions.push("strong-wind");
  if (visibility < 1000) conditions.push("fog");

  const data = {
    rain,
    snowfall,
    cloudCover,
    windSpeed10m,
    windGusts10m,
    visibility,
  };
  console.log(
    `Average weather conditions ${weather.time[0].toLocaleDateString()}`,
    conditions,
    data
  );
  return conditions;
};

function getIconFromConditions({
  conditions,
  isDay,
}: {
  conditions: WeatherCondition[];
  isDay: boolean;
}): LucideIcon {
  const cloudy =
    conditions.includes("cloudy") || conditions.includes("partly-cloudy");
  const rainy =
    conditions.includes("rain") ||
    conditions.includes("light-rain") ||
    conditions.includes("heavy-rain");
  const windy =
    conditions.includes("wind") || conditions.includes("strong-wind");

  if (conditions.includes("snow")) {
    return cloudy || !isDay ? CloudSnow : SunSnow;
  }
  if (
    windy &&
    cloudy &&
    (conditions.includes("heavy-rain") || conditions.includes("rain"))
  )
    return CloudRainWind;

  if (rainy) {
    return conditions.includes("heavy-rain") || conditions.includes("rain")
      ? CloudRain
      : CloudDrizzle;
  }

  if (cloudy) {
    return !conditions.includes("partly-cloudy")
      ? Cloudy
      : isDay
      ? CloudSun
      : CloudMoon;
  }

  return isDay ? Sun : Moon;
}

export function currentWeatherIcon({ weather }: { weather: CurrentWeather }) {
  const conditions = getCurrentWeatherConditions(weather);
  const Condition = getIconFromConditions({
    conditions,
    isDay: weather.isDay,
  });
  return {
    Condition,
    color: getColor(Condition),
  };
}

export function avgWeatherIcon({ weather }: { weather: HourlyWeather }) {
  const conditions = getAvgWeatherConditions(weather);
  return getIconFromConditions({ conditions, isDay: true });
}

export const getColor = (icon: LucideIcon) => {
  switch (icon) {
    case Sun:
      return "text-yellow-500";
    case Cloudy:
      return "text-gray-500";
    case CloudRain:
      return "text-blue-600";
    case CloudSnow:
      return "text-blue-300";
    case CloudDrizzle:
      return "text-gray-500";
    case CloudSun:
      return "text-gray-500";
    case CloudRainWind:
      return "text-blue-600";
    case SunSnow:
      return "text-blue-300";
    case CloudMoon:
      return "text-gray-600";
    case Moon:
      return "text-gray-600";
    default:
      return "text-gray-500";
  }
};
