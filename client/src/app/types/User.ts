interface IUser {
  firstName: string;
  email: string;
  phone: string;
  address: {
    city: string;
    country: string;
    street: string;
  };
}

export type IUserRequest = IUser & {
  password: string;
};
export type IUserResponse = IUser & {
  id: string;
};
