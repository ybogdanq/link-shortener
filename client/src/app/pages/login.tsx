import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Field, Formik } from "formik";
import { Heading } from "app/components/ui/Heading";
import { LoginForm } from "app/components/forms/login/LoginForm";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const LoginPage: FC<Props> = ({ className, ...props }) => {
  const user = useAppSelector(selectUser);

  if (user) {
    return <Navigate to="/account" replace />;
  }
  return (
    <DefaultLayout {...props}>
      <div className="max-w-sm mx-auto md:pt-10">
        <Heading size="s" className="mb-3">
          Login
        </Heading>
        <LoginForm />
      </div>
    </DefaultLayout>
  );
};
