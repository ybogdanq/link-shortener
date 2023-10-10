import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Heading } from "app/components/ui/Heading";
import { RegistrationForm } from "app/components/forms/registration/RegistrationForm";
import { useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";
import { Navigate } from "react-router-dom";
import { withoutAuth } from "app/utils/HOCs/withoutAuth";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const RegistrationPage: FC<Props> = ({ className, ...props }) => {
  return (
    <DefaultLayout {...props}>
      <div className="max-w-sm mx-auto md:pt-10">
        <Heading size="s" className="mb-3">
          Registration
        </Heading>
        <RegistrationForm />
      </div>
    </DefaultLayout>
  );
};

export default withoutAuth(RegistrationPage);