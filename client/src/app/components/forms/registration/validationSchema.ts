import * as Yup from "yup";

export const RegistrationValidationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().label("Password"),
  phone: Yup.string().required().label("Phone"),
  address: Yup.object().shape({
    city: Yup.string().label("City"),
    country: Yup.string().label("Country"),
    street: Yup.string().label("Street"),
  }),
});
