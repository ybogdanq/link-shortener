import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "app/store/store";
import { selectUser } from "app/store/user/slice";
import { logoutUser } from "app/store/user/asyncActions";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Header: FC<Props> = ({ className, ...props }) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <header className={cn(className, "border-b-[1px]")} {...props}>
      <nav className="container mx-auto px-5 py-5 flex justify-between">
        <div className="font-semibold">ST Task</div>

        <ul className="flex items-end [&>*+*]:ml-3 text-sm [&>li>a]:underline [&>li>a]:underline-offset-2">
          {user ? (
            <li
              onClick={async () => {
                await dispatch(logoutUser());
                navigate("/login");
              }}
            >
              Log out
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
