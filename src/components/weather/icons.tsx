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
} from "lucide-react";
import styled from "styled-components";

const twc = {
  "grey-500": "#6a7282",
  "blue-500": "#2b7fff",
  "blue-800": "#193cb8",
  "yellow-500": "#f0b100",
  "amber-500": "#fe9a00",
  "orange-500": "#ff6900",
  "red-500": "#fb2c36",
  "sky-100": "#dff2fe",
  "sky-200": "#b8e6fe",
  "sky-300": "#74d4ff",
  "slate-500": "#62748e",
  "zinc-500": "#71717b",
};

const getCloudy = ({ cloud }: { cloud: string }) => styled(Cloudy)`
  --cloud-color: ${cloud};

  /* moon shape */
  path {
    stroke: var(--cloud-color);
  }
`;

const getCloudRain = ({
  cloud,
  rain,
}: {
  cloud: string;
  rain: string;
}) => styled(CloudRain)`
  --cloud-color: ${cloud};
  --rain-color: ${rain};

  /* cloud shape */
  path:nth-of-type(1) {
    stroke: var(--cloud-color);
  }

  /* raindrops */
  path:nth-of-type(n + 2),
  line {
    stroke: var(--rain-color);
  }
`;

const getCloudDrizzle = ({
  cloud,
  rain,
}: {
  cloud: string;
  rain: string;
}) => styled(CloudDrizzle)`
  --cloud-color: ${cloud};
  --rain-color: ${rain};

  /* cloud shape */
  path:nth-of-type(1) {
    stroke: var(--cloud-color);
  }

  /* raindrops */
  path:nth-of-type(n + 2),
  line {
    stroke: var(--rain-color);
  }
`;

const getCloudRainWind = ({
  cloud,
  rain,
}: {
  cloud: string;
  rain: string;
}) => styled(CloudRainWind)`
  --cloud-color: ${cloud};
  --rain-color: ${rain};

  /* cloud shape */
  path:nth-of-type(7) {
    stroke: var(--cloud-color);
  }

  /* raindrops */
  path:nth-of-type(n + 2),
  line {
    stroke: var(--rain-color);
  }
`;

const getCloudSun = ({
  cloud,
  sun,
  ray,
}: {
  cloud: string;
  sun: string;
  ray: string;
}) => styled(CloudSun)`
  --cloud-color: ${cloud};
  --sun-color: ${sun};
  --ray-color: ${ray};

  /* rays */
  path:nth-of-type(n) {
    stroke: var(--ray-color);
  }

  /* sun */
  path:nth-of-type(5) {
    stroke: var(--sun-color);
  }

  /* cloud shape */
  path:nth-of-type(6),
  line {
    stroke: var(--cloud-color);
  }
`;

const getCloudMoon = ({
  cloud,
  moon,
}: {
  cloud: string;
  moon: string;
}) => styled(CloudMoon)`
  --cloud-color: ${cloud};
  --moon-color: ${moon};

  /* moon */
  path:nth-of-type(1) {
    stroke: var(--moon-color);
  }

  /* cloud shape */
  path:nth-of-type(2),
  line {
    stroke: var(--cloud-color);
  }
`;

const getCloudSnow = ({
  cloud,
  snow,
}: {
  cloud: string;
  snow: string;
}) => styled(CloudSnow)`
  --cloud-color: ${cloud};
  --snow-color: ${snow};

  /* snow */
  path:nth-of-type(n + 1) {
    stroke: var(--snow-color);
  }

  /* cloud shape */
  path:nth-of-type(1),
  line {
    stroke: var(--cloud-color);
  }
`;

const getSunSnow = ({ sun, snow }: { sun: string; snow: string }) => styled(
  SunSnow
)`
  --snow-color: ${snow};
  --sun-color: ${sun};

  /* snow shape */
  path:nth-of-type(n),
  line {
    stroke: var(--snow-color);
  }

  /* sun */
  path:nth-of-type(1),
  path:nth-of-type(2),
  path:nth-of-type(3),
  path:nth-of-type(8),
  path:nth-of-type(10),
  path:nth-of-type(11) {
    stroke: var(--sun-color);
  }
`;

const getSun = ({
  sun,
  ray,
  ray1,
  ray2,
  ray3,
}: {
  sun: string;
  ray: string;
  ray1?: string;
  ray2?: string;
  ray3?: string;
}) => styled(Sun)`
  --sun: ${sun};
  --ray: ${ray};
  --ray-1: ${ray1 ?? ray};
  --ray-2: ${ray2 ?? ray};
  --ray-3: ${ray3 ?? ray};

  /* sun core (circle) */
  circle {
    stroke: var(--sun);
  }

  path:nth-of-type(n) {
    stroke: var(--ray-1);
  }
  /* first three rays */
  path:nth-of-type(1) {
    stroke: var(--ray-1);
  }
  /* second three rays */
  path:nth-of-type(8) {
    stroke: var(--ray-2);
  }
  /* third three rays */
  path:nth-of-type(6) {
    stroke: var(--ray-3);
  }
`;

const getMoon = ({ moon }: { moon: string }) => styled(Moon)`
  --moon-color: ${moon};

  /* moon shape */
  path {
    stroke: var(--moon-color);
  }
`;

const cloud = twc["zinc-500"];
const rain = twc["blue-500"];
const sun = twc["yellow-500"];
const hotSun = twc["amber-500"];
const veryHotSun = twc["orange-500"];
const ray = twc["yellow-500"];
const moon = twc["slate-500"];
const snow = twc["sky-300"];

export const ColouredCloudRain = getCloudRain({ cloud, rain });
export const ColouredCloudDrizzle = getCloudDrizzle({ cloud, rain });
export const ColouredCloudRainWind = getCloudRainWind({ cloud, rain });
export const ColouredCloudy = getCloudy({ cloud });
export const ColouredCloudSun = getCloudSun({ cloud, sun, ray });
export const ColouredHotCloudSun = getCloudSun({ cloud, sun: hotSun, ray });
export const ColouredVeryHotCloudSun = getCloudSun({
  cloud,
  sun: veryHotSun,
  ray,
});
export const ColouredSun = getSun({ sun, ray });
export const ColouredHotSun = getSun({ sun: hotSun, ray });
export const ColouredVeryHotSun = getSun({ sun: veryHotSun, ray });
export const ColouredMoon = getMoon({ moon });
export const ColouredCloudMoon = getCloudMoon({ cloud, moon });
export const ColouredCloudSnow = getCloudSnow({ cloud, snow });
export const ColouredSunSnow = getSunSnow({ sun, snow });

export const all_icons = [
  ColouredSunSnow,
  ColouredCloudSnow,
  ColouredCloudMoon,
  ColouredCloudSun,
  ColouredHotCloudSun,
  ColouredVeryHotCloudSun,
  ColouredCloudRain,
  ColouredCloudDrizzle,
  ColouredCloudRainWind,
  ColouredSun,
  ColouredHotSun,
  ColouredVeryHotSun,
  ColouredMoon,
  ColouredCloudy,
];

export type WeatherIcon =
  | typeof Sun
  | typeof Cloudy
  | typeof CloudRain
  | typeof CloudSnow
  | typeof CloudDrizzle
  | typeof CloudSun
  | typeof CloudRainWind
  | typeof SunSnow
  | typeof CloudMoon
  | typeof Moon;

  export const colouredIcon = (icon: WeatherIcon) => {
    switch (icon) {
      case Sun:
        return ColouredSun
      case Cloudy:
        return ColouredCloudy
      case CloudRain:
        return ColouredCloudRain
      case CloudSnow:
        return ColouredCloudSnow
      case CloudDrizzle:
        return ColouredCloudDrizzle
      case CloudSun:
        return ColouredCloudSun
      case CloudRainWind:
        return ColouredCloudRainWind
      case SunSnow:
        return ColouredSunSnow
      case CloudMoon:
        return ColouredCloudMoon
      case Moon:
        return ColouredMoon
      default:
        throw new Error(`Unknown icon ${icon}`);
    }
  };