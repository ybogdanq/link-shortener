import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "s" | "m" | "l";
  color: "black" | "white";
}

export const Button: FC<Props> = ({
  size = "s",
  color,
  children,
  className,
  ...props
}) => {
  const sizeDependentStyles =
    size === "s"
      ? "text-xs sm:text-sm md:text-md"
      : size === "m"
      ? "text-sm sm:text-md md:text-lg"
      : "text-md sm:text-lg md:text-xl";
  const defaultStyles = "";

  const mergedStyles = cn(className, sizeDependentStyles, defaultStyles);
  return (
    <button className={mergedStyles} {...props}>
      {children}
    </button>
  );
};
