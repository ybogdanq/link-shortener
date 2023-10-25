import { format } from "date-fns";

export const dateToCron = (timestamp: number): string => {
  return (
    format(new Date(timestamp), "yyyy-MM-dd") +
    "T" +
    format(new Date(timestamp), "HH:mm:ss")
  );
};
