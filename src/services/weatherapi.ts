import { is } from "date-fns/locale";
import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 51.7718,
  longitude: 0.0403,
  hourly: [
    "temperature_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "wind_gusts_10m",
    "wind_direction_10m",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "cloud_cover",
    "visibility",
  ],
  current: [
    "temperature_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "wind_gusts_10m",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "cloud_cover",
    "wind_direction_10m",
    "is_day",
  ],
  daily: ["sunrise", "sunset", "uv_index_max", "uv_index_clear_sky_max"],
  timezone: "auto",
};
const url = "https://api.open-meteo.com/v1/forecast";

export async function getRoydonWeather() {
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  const current = response.current()!;
  const hourly = response.hourly()!;

  const daily = response.daily()!;
  const sunrise = daily.variables(0)!;
  const sunset = daily.variables(1)!;
  console.log("Roydon weather data fetched at", sunrise, sunset);

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    daily: {
      time: [
        ...Array(
          (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
        ),
      ].map(
        (_, i) => new Date((Number(daily.time()) + i * daily.interval()) * 1000)
      ),
      // Openmeteo seems to get this values wrong
      sunrise: [...Array(sunrise.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunrise.valuesInt64(i)) + 3600) * 1000)
      ),
      sunset: [...Array(sunset.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunset.valuesInt64(i)) - 3600) * 1000)
      ),
      uvIndexMax: daily.variables(2)!.valuesArray()!,
      uvIndexClearSkyMax: daily.variables(3)!.valuesArray()!,
    },
    current: {
      time: new Date(Number(current.time()) * 1000),
      temperature2m: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      windSpeed10m: current.variables(2)!.value(),
      windGusts10m: current.variables(3)!.value(),
      precipitation: current.variables(4)!.value(),
      rain: current.variables(5)!.value(),
      showers: current.variables(6)!.value(),
      snowfall: current.variables(7)!.value(),
      cloudCover: current.variables(8)!.value(),
      windDirection10m: current.variables(9)!.value(),
      isDay: current.variables(10)!.value() === 1, // Assuming 1 means day, 0 means night
    },
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map(
        (_, i) =>
          new Date((Number(hourly.time()) + i * hourly.interval()) * 1000)
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      apparentTemperature: hourly.variables(1)!.valuesArray()!,
      windSpeed10m: hourly.variables(2)!.valuesArray()!,
      windGusts10m: hourly.variables(3)!.valuesArray()!,
      windDirection10m: hourly.variables(4)!.valuesArray()!,
      precipitation: hourly.variables(5)!.valuesArray()!,
      rain: hourly.variables(6)!.valuesArray()!,
      showers: hourly.variables(7)!.valuesArray()!,
      snowfall: hourly.variables(8)!.valuesArray()!,
      cloudCover: hourly.variables(9)!.valuesArray()!,
      visibility: hourly.variables(10)!.valuesArray()!,
    },
  };

  console.log("Roydon weather data:", weatherData);
  return weatherData;
}

export type WeatherReasponse = Awaited<ReturnType<typeof getRoydonWeather>>;

export type CurrentWeather = WeatherReasponse["current"];
export type HourlyWeather = WeatherReasponse["hourly"];
export type DailyWeather = WeatherReasponse["daily"];
