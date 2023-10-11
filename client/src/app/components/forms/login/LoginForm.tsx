import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Form, Formik } from "formik";
import { Input } from "app/components/ui/Input";
import { Button } from "app/components/ui/Button";
import { LoginValidationSchema } from "./validationSchema";
import { useAppDispatch } from "app/store/store";
import { loginUser } from "app/store/user/asyncActions";
import { Link, redirect, useNavigate } from "react-router-dom";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const LoginForm: FC<Props> = ({ className, ...props }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Formik
      validationSchema={LoginValidationSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={async (data) => {
        const res = await dispatch(
          loginUser({ email: data.email, password: data.password })
        );
        if (res.meta.requestStatus === "rejected") {
          return alert(res.payload);
        }
        navigate("/account");
      }}
    >
      {({ errors }) => (
        <Form className="flex flex-col gap-3">
          <Input label="Email" name="email" />
          <Input label="Password" name="password" type="password" />
          <Button type="submit" size="s" color="black">
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};
