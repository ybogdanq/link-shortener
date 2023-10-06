import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "s" | "m" | "l";
  color?: "black" | "white";
}

export const Button: FC<Props> = ({
  size = "s",
  color = "white",
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

  const colorDependentStyles =
    color === "black"
      ? "text-white border-black bg-black hover:text-black  hover:bg-white"
      : color === "white"
      ? "text-black border-black bg-white hover:text-white  hover:bg-black"
      : "";

  const defaultStyles = "font-semibold border-[1px] py-2 px-5 transition-all transition-duration-300";

  const mergedStyles = cn(
    className,
    colorDependentStyles,
    sizeDependentStyles,
    defaultStyles
  );
  return (
    <button className={mergedStyles} {...props}>
      {children}
    </button>
  );
};
