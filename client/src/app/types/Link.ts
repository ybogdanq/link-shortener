interface ILink {
  type: "SINGLE" | "MULTIPLE";
  redirectLink: string;
}

export type ILinkRequest = ILink & {
  numberOfDays: 1 | 3 | 7;
};
export type ILinkResponse = ILink & {
  id: string;
  userId: string;
  active: boolean;
  visits: number;
  expiredAt: number;
};
