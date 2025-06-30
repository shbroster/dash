import { createContext, useEffect, useState } from "react";
import { roydonSunTimes } from "../lib/daylight";
import { useTickProvider } from "./tickprovider";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { everyHour: timeNow } = useTickProvider();
  const [theme, setTheme] = useState<Theme>("light");

  // Time-based theming
  useEffect(() => {
    const { sunset, sunrise } = roydonSunTimes(timeNow);
    const isNight = timeNow >= sunset || timeNow <= sunrise;
    const newTheme = isNight ? "dark" : "light";

    // Update theme if it changed
    if (newTheme !== theme) {
      console.log("Set theme", newTheme);
      document.documentElement.classList.remove(theme);
      document.documentElement.classList.add(newTheme);
      setTheme(newTheme);
    }
  }, [theme, timeNow]);

  return (
    <ThemeProviderContext.Provider value={{ theme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
