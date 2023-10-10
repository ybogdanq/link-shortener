import * as Yup from "yup";

export const CreateLinkValidationSchema = Yup.object().shape({
  redirectLink: Yup.string()
    .matches(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Enter correct url!"
    )
    .required("Please enter website"),
  numberOfDays: Yup.number().required(),
  type: Yup.string()
});
