import { object, string } from "zod";

export const LoginCustomerDto = (body: Record<string, any>) => {
  const schema = object({
    email: string().email(),
    password: string(),
  });
  return schema.parse(body);
};
