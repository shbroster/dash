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
  const { everyMinute: timeNow } = useTickProvider();
  const [theme, setTheme] = useState<Theme>("light");
  console.log("@@@ThemeProvider", theme);

  // Time-based theming
  useEffect(() => {
    console.log("@@@ThemeProvider useEffect", theme);
    const { sunset, sunrise } = roydonSunTimes(timeNow);
    const isNight = timeNow >= sunset || timeNow <= sunrise;
    const newTheme = isNight ? "dark" : "light";
    const oldTheme = isNight ? "light" : "dark";

    if (!document.documentElement.classList.contains(newTheme)) {
      document.documentElement.classList.add(newTheme);
    }
    if (document.documentElement.classList.contains(oldTheme)) {
      document.documentElement.classList.remove(oldTheme);
    } 
    setTheme(newTheme);
  }, [theme, timeNow]);

  return (
    <ThemeProviderContext.Provider value={{ theme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
