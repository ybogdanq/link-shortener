import { object, string, number, enum as enum_ } from "zod";

export const createLinkDto = (body) => {
  const schema = object({
    type: enum_(["SINGLE", "MULTIPLE"]),
    redirectLink: string(),
    numberOfDays: number(),
  });
  return schema.parse(body);
};
