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
      <div className="mb-16">
        <Heading size="m" className="underline underline-offset-2 mb-2">
          Welcome, User!
        </Heading>
        <Text className="mb-3">
          Here's your account pannel. Here you can manage all your recently
          created links
        </Text>
        <Button size="s" color="black">Create new link</Button>
      </div>
      <div>
        <Heading className="mb-3" size="s" htmlEl="h2">
          Links collection
        </Heading>
        <ul>
          <li>
            <div className="border-[1px] border-black py-3 px-5 inline-block max-w-[40%]">
              <Text className="mb-1" size="m">
                Link
              </Text>
              <Text className="mb-3" size="s">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellendus autem quidem ratione rerum optio repellat nostrum
              </Text>
              <div className="[&>*+*]:ml-2">
                <Button color="white">Update</Button>
                <Button color="black">Delete</Button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </DefaultLayout>
  );
};
