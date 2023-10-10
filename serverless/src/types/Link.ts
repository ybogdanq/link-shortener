export type Link = {
  id: string;
  userId: string;
  type: "SINGLE" | "MULTIPLE";
  active: boolean;
  redirectLink: string;
  visists: number;
  expiredAt: number;
};
