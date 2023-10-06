import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Formik } from "formik";
import { RegistrationValidationSchema } from "./validationSchema";
import { Input } from "app/components/ui/Input";
import { Button } from "app/components/ui/Button";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const RegistrationForm: FC<Props> = ({ className, ...props }) => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        phone: "",
        address: { city: "", country: "", street: "" },
      }}
      onSubmit={async (data) => {}}
      validationSchema={RegistrationValidationSchema}
    >
      {({}) => (
        <div className="flex flex-col gap-3">
          <Input label="Email" name="email" />
          <Input label="Password" name="password" type="password" />
          <Input label="Phone" name="phone" />
          <Input label="City" name="address.city" />
          <Input label="Country" name="address.country" />
          <Input label="Street" name="address.street" />
          <Button size="s" color="black">
            Register
          </Button>
        </div>
      )}
    </Formik>
  );
};
