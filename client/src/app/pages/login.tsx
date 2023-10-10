import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Heading } from "app/components/ui/Heading";
import { LoginForm } from "app/components/forms/login/LoginForm";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";
import { withoutAuth } from "app/utils/HOCs/withoutAuth";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const LoginPage: FC<Props> = ({ className, ...props }) => {
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

export default withoutAuth(LoginPage)