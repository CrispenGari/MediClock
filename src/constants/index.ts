export const COLORS = {
  main: "#FDFBEE",
  primary: "#57B4BA",
  secondary: "#FE4F2D",
  tertiary: "#096B68",
  black: "#000000",
  white: "#ffffff",
  red: "#FB2576",
  gray: "#758694",
  transparent: "transparent",
  gray100: "#DDDDDD",
  gray200: "#7F8CAA",
  google: "#4285F4",
};

export const Fonts = {
  "EBGaramond-Bold": require("@/assets/fonts/EBGaramond-Bold.ttf"),
  "EBGaramond-Regular": require("@/assets/fonts/EBGaramond-Regular.ttf"),
};
export const FONTS = {
  regular: "EBGaramond-Regular",
  bold: "EBGaramond-Bold",
};

export const STORAGE_NAME = {
  ME: "mediclock:me",
  SETTINGS: "mediclock:settings",
};

export const APP_NAME = "Medi Clock";

export const relativeTimeObject = {
  future: "in %s",
  past: "%s",
  s: "now",
  m: "1m",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "1d",
  dd: "%dd",
  M: "1M",
  MM: "%dM",
  y: "1y",
  yy: "%dy",
};

export const LANDING_MESSAGES = [
  {
    id: 1,
    image: require("@/assets/images/landing_1.png"),
    title: "Welcome to MediClock!",
    message:
      "It's pill o'clock somewhere — and we've got your back! Let's keep your health right on time.",
  },
  {
    id: 2,
    image: require("@/assets/images/landing_0.png"),
    title: "Hello, healthy human!",
    message:
      "MediClock is here to remind you when it's time to pop a pill and power up your wellness! Let's get started!",
  },
  {
    id: 3,
    title: "You made it to MediClock!",
    image: require("@/assets/images/landing_2.png"),
    message:
      "Say goodbye to missed meds and hello to perfectly timed doses! Your health routine just got smarter.",
  },
];
