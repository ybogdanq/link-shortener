import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Header } from "./Header";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const DefaultLayout: FC<Props> = ({ children, className, ...props }) => {
  return (
    <div className={cn(className, "flex flex-col min-h-screen")} {...props}>
      <Header />
      <div className="container mx-auto px-5 flex-1 pt-7">{children}</div>
    </div>
  );
};
