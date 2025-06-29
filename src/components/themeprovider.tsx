import { createContext, useContext, useEffect, useState } from "react";
import { roydonSunTimes } from "../lib/daylight";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
};

const ThemeProviderContext = createContext<ThemeProviderState>({ theme: "light"});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

 // Time-based theming
 useEffect(() => {
  const updateThemeBasedOnTime = () => {
    const now = new Date();
    const { sunset, sunrise } = roydonSunTimes(now);
    const isNight = now >= sunset || now <= sunrise;
    const newTheme = isNight ? "dark" : "light";
    
    // Update theme if it changed
    if (newTheme !== theme) {
      console.log("Set theme", newTheme)
      document.documentElement.classList.remove(theme);
      document.documentElement.classList.add(newTheme);
      setTheme(newTheme);
    }
  };

  // Initial update
  updateThemeBasedOnTime();
  
  // Update every minute
  const intervalId = setInterval(updateThemeBasedOnTime, 60 * 1000);
  return () => clearInterval(intervalId);
}, [theme]); // Only re-run if theme changes

  return (
    <ThemeProviderContext.Provider value={{ theme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

