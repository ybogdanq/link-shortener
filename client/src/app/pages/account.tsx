import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { DefaultLayout } from "app/layout/DefaultLayout";
import { Heading } from "app/components/ui/Heading";
import { Text } from "app/components/ui/Text";
import { Button } from "app/components/ui/Button";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const AccountPage: FC<Props> = ({ className, ...props }) => {
  return (
    <DefaultLayout {...props}>
      <div className="mb-5">
        <Heading size="m" className="underline underline-offset-2 mb-2">
          Welcome back, User!
        </Heading>
        <Text>
          Here's your account pannel. Here you can manage all your recently created links
        </Text>
      </div>
      <ul>
        <li>
          <div>
            <Heading size="s">Link</Heading>
            <Button>Update</Button>
            <Button>Delete</Button>
          </div>
        </li>
      </ul>
    </DefaultLayout>
  );
};
