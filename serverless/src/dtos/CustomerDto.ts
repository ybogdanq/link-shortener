import { IUser } from "../types/User";
import { object, string } from "zod";

export const CustomerDto = (user: IUser) => {
  return {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
    phone: user.phone,
    address: {
      city: user.address.city,
      country: user.address.country,
      street: user.address.street,
    },
  };
};
