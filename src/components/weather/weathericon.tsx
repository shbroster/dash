import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Wind,
  CloudSun,
  CloudSunRain,
  CloudRainWind,
  SunSnow,
  CloudMoon,
  CloudMoonRain,
  Moon,
} from "lucide-react";
import {
  type CurrentWeather,
  type HourlyWeather,
} from "../../services/weatherapi";

type BaseWeatherProps = {
  size?: number;
  className?: string;
};

type ConditionWeatherIconProps = BaseWeatherProps & {
  conditions: WeatherCondition[];
  isDay?: boolean;
};

type CurrentWeatherIconProp = BaseWeatherProps & {
  weather: CurrentWeather;
  hourlyWeather: HourlyWeather;
};

type AvgWeatherIconProp = BaseWeatherProps & {
  weather: HourlyWeather;
};

type WeatherCondition =
  | "snow"
  | "heavy-rain"
  | "rain"
  | "light-rain"
  | "heavy-showers"
  | "showers"
  | "light-showers"
  | "cloudy"
  | "partly-cloudy"
  | "wind"
  | "light-wind"
  | "strong-wind"
  | "fog";

// Determine the weather condition
const getCurrentWeatherConditions = (weather: CurrentWeather) => {
  const { rain, showers, snowfall, cloudCover, windSpeed10m, windGusts10m } =
    weather;

  const conditions: Array<WeatherCondition> = [];
  if (snowfall > 0) conditions.concat("snow");
  if (rain > 5) conditions.concat("heavy-rain");
  if (rain > 0.5 && rain <= 5) conditions.concat("rain");
  if (rain > 0 && rain <= 0.5) conditions.concat("light-rain");
  if (showers > 5) conditions.concat("heavy-showers");
  if (showers > 0.5 && showers <= 5) conditions.concat("showers");
  if (showers > 0 && showers <= 0.5) conditions.concat("light-showers");
  if (cloudCover > 80) conditions.concat("cloudy");
  if (cloudCover > 40) conditions.concat("partly-cloudy");
  if (
    (windSpeed10m > 20 && windSpeed10m <= 30) ||
    (windGusts10m > 30 && windGusts10m <= 40)
  )
    conditions.concat("light-wind");
  if (
    (windSpeed10m > 30 && windSpeed10m <= 40) ||
    (windGusts10m > 40 && windGusts10m <= 50)
  )
    conditions.concat("wind");
  if (windSpeed10m > 40 || windGusts10m > 50) conditions.concat("strong-wind");

  console.log("Current weather conditions:", conditions, weather);
  return conditions;
};

const getAvgWeatherConditions = (weather: HourlyWeather) => {
  const rain = weather.rain.reduce((a, b) => a + b, 0);
  const showers = weather.showers.reduce((a, b) => a + b, 0);
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
  if (snowfall > 0) conditions.concat("snow");
  if (rain > 5) conditions.concat("heavy-rain");
  if (rain > 0.5 && rain <= 5) conditions.concat("rain");
  if (rain > 0 && rain <= 0.5) conditions.concat("light-rain");
  if (showers > 5) conditions.concat("heavy-showers");
  if (showers > 0.5 && showers <= 5) conditions.concat("showers");
  if (showers > 0 && showers <= 0.5) conditions.concat("light-showers");
  if (cloudCover > 80) conditions.concat("cloudy");
  if (cloudCover > 40) conditions.concat("partly-cloudy");
  if (
    (windSpeed10m > 20 && windSpeed10m <= 30) ||
    (windGusts10m > 30 && windGusts10m <= 40)
  )
    conditions.concat("light-wind");
  if (
    (windSpeed10m > 30 && windSpeed10m <= 40) ||
    (windGusts10m > 40 && windGusts10m <= 50)
  )
    conditions.concat("wind");
  if (windSpeed10m > 40 || windGusts10m > 50) conditions.concat("strong-wind");
  if (visibility < 1000) conditions.concat("fog");

  const data = {
    rain,
    showers,
    snowfall,
    cloudCover,
    windSpeed10m,
    windGusts10m,
    visibility,
  };
  console.log(
    `Average weather conditions ${weather.time[0].toLocaleDateString()}`,
    conditions,
    data,
    weather
  );
  return conditions;
};

export function ConditionWeatherIcon({
  conditions,
  isDay,
  size = 24,
  className = "",
}: ConditionWeatherIconProps) {
  const iconProps = { size, className };

  const cloudy =
    conditions.includes("cloudy") || conditions.includes("partly-cloudy");
  const rainy =
    conditions.includes("rain") ||
    conditions.includes("showers") ||
    conditions.includes("heavy-rain") ||
    conditions.includes("heavy-showers");
  const windy =
    conditions.includes("wind") || conditions.includes("strong-wind");

  if (conditions.includes("snow")) {
    return cloudy || !isDay ? (
      <CloudSnow {...iconProps} />
    ) : (
      <SunSnow {...iconProps} />
    );
  }
  if (windy && cloudy && conditions.includes("heavy-rain")) {
    return <CloudRainWind {...iconProps} />;
  }
  if (rainy) {
    return conditions.includes("heavy-rain") ? (
      <CloudRain {...iconProps} />
    ) : conditions.includes("heavy-showers") ||
      conditions.includes("showers") ? (
      isDay ? (
        <CloudSunRain {...iconProps} />
      ) : (
        <CloudMoonRain {...iconProps} />
      )
    ) : (
      <CloudDrizzle {...iconProps} />
    );
  }
  if (conditions.includes("fog")) {
    return <CloudFog {...iconProps} />;
  }
  if (windy) {
    return <Wind {...iconProps} />;
  }
  if (cloudy) {
    return !conditions.includes("partly-cloudy") ? (
      <Cloud {...iconProps} />
    ) : isDay ? (
      <CloudSun {...iconProps} />
    ) : (
      <CloudMoon {...iconProps} />
    );
  }
  // TODO: Sun size based on temp
  return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
}

export function CurrentWeatherIcon({
  weather,
  hourlyWeather,
  size = 24,
  className = "",
}: CurrentWeatherIconProp) {
  const conditions = getCurrentWeatherConditions(weather);
  return (
    <ConditionWeatherIcon
      conditions={conditions}
      isDay={weather.isDay}
      size={size}
      className={className}
    />
  );
}

export function AvgWeatherIcon({
  weather,
  size = 24,
  className = "",
}: AvgWeatherIconProp) {
  const conditions = getAvgWeatherConditions(weather);
  return (
    <ConditionWeatherIcon
      conditions={conditions}
      isDay={true} // Average doesn't have day/night distinction
      size={size}
      className={className}
    />
  );
}
