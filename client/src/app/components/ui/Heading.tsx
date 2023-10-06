import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";

interface Props
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  htmlEl?: "h1" | "h2" | "h3";
  size: "s" | "m" | "l";
}

export const Heading: FC<Props> = ({
  htmlEl,
  size,
  children,
  className,
  ...props
}) => {
  const sizeDependentStyles =
    size === "s"
      ? "text-sm sm:text-md md:text-lg lg:text-xl"
      : size === "m"
      ? "text-md sm:text-lg md:text-xl lg:text-2xl"
      : "text-lg sm:text-xl md:text-2xl lg:text-3xl";
  const defaultStyles = "font-semibold";

  const mergedStyles = cn(className, sizeDependentStyles, defaultStyles);

  switch (htmlEl) {
    case "h1":
      return (
        <h1 className={mergedStyles} {...props}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={mergedStyles} {...props}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={mergedStyles} {...props}>
          {children}
        </h3>
      );
    default:
      return (
        <h1 className={mergedStyles} {...props}>
          {children}
        </h1>
      );
  }
};
