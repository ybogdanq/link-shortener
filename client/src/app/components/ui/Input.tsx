import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cn from "classnames";
import { Field, FieldAttributes, useField } from "formik";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  FieldAttributes<Record<string, string>> & {
    label: string;
  };

export const Input: FC<Props> = ({ label, className, ...props }) => {
  const [{ value, name }, { touched, error }] = useField(props);
  return (
    <div className={cn(className, "relative")}>
      <label
        className={cn(
          "text-sm top-0 absolute left-2  bg-white px-1 transition-all duration-300",
          {
            "opacity-100 translate-y-[-50%]": !!value,
            "opacity-0 translate-y-0": !value,
          }
        )}
      >
        {label}
      </label>
      <Field
        className={cn(
          "w-full border-[1px] focus:border-black focus:ring-0 bg-white transition-[background-color] duration-[200s]",
          !!error && touched ? "border-red-500" : "border-black-500"
        )}
        placeholder={label}
        type="text"
        {...props}
      />
    </div>
  );
};
