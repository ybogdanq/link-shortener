import React, {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  useEffect,
  useMemo,
} from "react";
import cn from "classnames";
import { Header } from "./Header";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "app/store/store";
import { getUser } from "app/store/user/asyncActions";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const DefaultLayout: FC<Props> = ({ children, className, ...props }) => {
  const location = useLocation();
  const pathname = useMemo(() => location.pathname, [location]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("fetch user");
    (async function fetchUserData() {
      await dispatch(getUser());
    })();
  }, [pathname, dispatch]);
  return (
    <div className={cn(className, "flex flex-col min-h-screen")} {...props}>
      <Header />
      <div className="container mx-auto px-5 flex-1 pt-10">{children}</div>
    </div>
  );
};
