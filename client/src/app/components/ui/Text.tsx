import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  size?: "s" | "m" | "l" ;
}

export const Text: FC<Props> = ({ size = "s", children, className, ...props }) => {
  const sizeDependentStyles =
    size === "s"
      ? "text-xs sm:text-sm md:text-md"
      : size === "m"
      ? "text-sm sm:text-md md:text-lg"
      : "text-md sm:text-lg md:text-xl";
  const defaultStyles = "";

  const mergedStyles = cn(className, sizeDependentStyles, defaultStyles);
  return (
    <p className={mergedStyles} {...props}>
      {children}
    </p>
  );
};
