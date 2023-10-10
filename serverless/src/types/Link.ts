export type Link = {
  id: string;
  userId: string;
  type: "SINGLE" | "MULTIPLE";
  active: boolean;
  redirectLink: string;
  visits: number;
  expiredAt: number;
};
