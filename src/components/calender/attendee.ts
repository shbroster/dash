export type Identity = "Sam" | "Kat";

export const identify = (email: string): Identity | null => {
  switch (email.split("@")[0]) {
    case "katrinaebroster":
    case "skbroster":
      return "Kat" as const;
    case "samuel.broster":
    case "sam":
    case "s.h.broster":
      return "Sam" as const;
    default:
      return null;
  }
};
