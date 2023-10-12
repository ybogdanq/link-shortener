import { Link } from "../Link";

export interface CreateLinkArguments {
  redirectLink: string;
  numberOfDays: 1 | 3 | 7;
  type: "SINGLE" | "MULTIPLE";
}

export type GetAllLinks = Link[];
