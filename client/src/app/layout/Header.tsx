import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Header: FC<Props> = ({ className, ...props }) => {
  const user = useAppSelector(selectUser);

  return (
    <header className={cn(className, "border-b-[1px]")} {...props}>
      <nav className="container mx-auto px-5 py-5 flex justify-between">
        <div className="font-semibold">ST Task</div>

        <ul className="flex items-end [&>*+*]:pl-3 text-sm [&>li>a]:underline [&>li>a]:underline-offset-2">
          {user ? (
            <li>
              <Link to={"/login"}>Log out</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
              <li>
                <Link to={"/registration"}>Registration</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
