import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import cn from 'classnames';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Header: FC<Props> = ({ className, ...props }) => {
  return (
    <header className={cn(className, "border-b-[1px]")} {...props}>
      <nav className="container mx-auto px-5 py-5 flex justify-between">
        <div className="font-semibold">ST Task</div>

        <ul className="flex items-end [&>*+*]:pl-2 [&>li>a]:underline [&>li>a]:underline-offset-2">
          <li>
            <a href="">item1</a>
          </li>
          <li>
            <a href="">item2</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};