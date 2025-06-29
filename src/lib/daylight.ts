export function roydonSunTimes(date: Date): { sunrise: Date; sunset: Date } {
  const duration = dayDayDurationHours(date);
  const hoursDiff = Math.floor(duration / 2);
  const minsDiff = Math.floor((duration / 2 - hoursDiff) * 60);
  const offset = date.getTimezoneOffset() / 60;
  return {
    sunrise: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12 - hoursDiff - offset,
      -minsDiff
    ),
    sunset: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12 + hoursDiff - offset,
      minsDiff
    ),
  };
}

function dayDayDurationHours(date: Date): number {
  return 12 + 4.06 * Math.sin((Math.PI * (dayNumber(date) - 80)) / 182.5);
}

function dayNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const thisDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return (
    Math.floor(
      (thisDate.getTime() - startOfYear.getTime()) / 1000 / 60 / 60 / 24
    ) + 1
  );
}
