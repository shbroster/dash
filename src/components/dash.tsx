import { Button } from "./ui/button";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import TrainsCard from "./trains/trains";
import WeatherCard from "./weather/weather";
import { CalendarCard } from "./calender/calendar";
import styled, { keyframes } from "styled-components";


const kenburns = keyframes`
  0%   { transform: scale(0.82) translate(5%,-28%); }
  100% { transform: scale(1.9) translate(4%, -8%); }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  animation: ${kenburns} 60s ease-in-out infinite alternate;
`;

export default function HomeDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-[1480px] h-[320px] bg-muted p-4 grid grid-cols-4 gap-4 overflow-hidden"
      style={{ margin: 0 }}
    >
      {/* Fullscreen */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? undefined : <Maximize2 className="h-5 w-5" />}
      </Button>

      {/* Calendar Section */}
      <CalendarCard />

      {/* Trains Section */}
      <TrainsCard />

      {/* Weather Section */}
      <WeatherCard />

      {/* Photo Section */}
      <div className="relative rounded-lg overflow-hidden h-full">
        <Img 
          src="/src/assets/dog.jpg"
          alt="Cute Dog"
          className="w-full h-full object-cover scale-135 filter grayscale-70 contrast-100 brightness-125"
        />
      </div>
    </div>
  );
}
