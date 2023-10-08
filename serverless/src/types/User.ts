export type IUser = {
  id: string;
  firstName: string;
  email: string;
  password: string;
  phone: string;
  address: {
    city: string;
    country: string;
    street: string;
  };
};
