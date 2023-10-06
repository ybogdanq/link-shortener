import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().label("Password"),
});
