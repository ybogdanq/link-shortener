import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Field, Formik } from "formik";
import { Button } from "app/components/ui/Button";
import { Input } from "app/components/ui/Input";
import { LoginForm } from "app/components/forms/login/LoginForm";
import { Heading } from "app/components/ui/Heading";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const LoginPage: FC<Props> = ({ className, ...props }) => {
  return (
    <DefaultLayout {...props}>
      <div className="max-w-sm mx-auto pt-20">
        <Heading size="s" className="mb-3">
          Login
        </Heading>
        <LoginForm />
      </div>
    </DefaultLayout>
  );
};
