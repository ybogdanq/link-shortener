import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Form, Formik } from "formik";
import { RegistrationValidationSchema } from "./validationSchema";
import { Input } from "app/components/ui/Input";
import { Button } from "app/components/ui/Button";
import { registerUser } from "app/store/user/asyncActions";
import { useAppDispatch } from "app/store/store";
import { useNavigate } from "react-router-dom";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const RegistrationForm: FC<Props> = ({ className, ...props }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        firstName: "",
        email: "",
        password: "",
        phone: "",
        address: { city: "", country: "", street: "" },
      }}
      onSubmit={async (data) => {
        console.log("sadas");
        const res = await dispatch(registerUser({ user: data }));
        if (res.meta.requestStatus === "rejected") {
          console.log(res.payload);
          return;
        }
        navigate("/login");
      }}
      validationSchema={RegistrationValidationSchema}
    >
      {({ errors }) => (
        <Form className="flex flex-col gap-3">
          <Input label="First name" name="firstName" />
          <Input label="Email" name="email" />
          <Input label="Password" name="password" type="password" />
          <Input label="Phone" name="phone" />
          <Input label="City" name="address.city" />
          <Input label="Country" name="address.country" />
          <Input label="Street" name="address.street" />
          <Button type="submit" size="s" color="black">
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
};
