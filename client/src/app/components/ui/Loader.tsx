import React, { DetailedHTMLProps, FC, HTMLAttributes, useEffect } from "react";
import cn from "classnames";
import { useAppSelector } from "app/store/store";
import { selectIsLoadingState } from "app/store/loaderSlice";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Loader: FC<Props> = ({ className, ...props }) => {
  const isLoading = useAppSelector(selectIsLoadingState);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("blocked");
    } else {
      document.body.classList.remove("blocked");
    }
  }, [isLoading]);
  return isLoading ? (
    <div className={cn(className, "loader_wrapper")} {...props}>
      <span className="loader"></span>
    </div>
  ) : (
    <></>
  );
};
