export interface LoginArguments {
  email: string;
  password: string;
}

export type UserRes = {
  firstName: string;
  email: string;
  phone: string;
  address: {
    city: string;
    country: string;
    street: string;
  };
};

export interface RegisterUserArguments {
  user: UserRes;
}
