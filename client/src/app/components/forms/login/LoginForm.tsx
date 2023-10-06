import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Formik } from "formik";
import { Input } from "app/components/ui/Input";
import { Button } from "app/components/ui/Button";
import { LoginValidationSchema } from "./validationSchema";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const LoginForm: FC<Props> = ({ className, ...props }) => {
  return (
    <Formik
      validationSchema={LoginValidationSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={async (data) => {}}
    >
      {({ values }) => (
        <div className="flex flex-col gap-3">
          <Input label="Email" name="email" />
          <Input label="Password" name="password" type="password" />
          <Button size="s" color="black">
            Login
          </Button>
        </div>
      )}
    </Formik>
  );
};
