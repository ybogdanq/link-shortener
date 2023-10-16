import { object, string } from "zod";

export const registerCustomerDto = (body: Record<string, any>) => {
  const schema = object({
    user: object({
      firstName: string(),
      email: string().email(),
      password: string(),
      phone: string(),
      address: object({
        city: string(),
        country: string(),
        street: string(),
      }),
    }),
  });
  return schema.parse(body);
};
