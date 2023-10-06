import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import { DefaultLayout } from 'app/layout/DefaultLayout';
import { Heading } from 'app/components/ui/Heading';
import { RegistrationForm } from 'app/components/forms/registration/RegistrationForm';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const RegistrationPage: FC<Props> = ({ className, ...props }) => {
  return (
    <DefaultLayout {...props}>
      <div className="max-w-sm mx-auto pt-20">
        <Heading size="s" className="mb-3">
          Registration
        </Heading>
        <RegistrationForm />
      </div>
    </DefaultLayout>
  );
};