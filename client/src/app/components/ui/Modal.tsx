import React, {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import cn from "classnames";

interface ModalSettings {
  onClose: () => void;
  spaces?: "s" | "m" | "l";
  isActive: boolean;
  maxWidth?: boolean;
}

type ModalProps = ModalSettings &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Modal: FC<ModalProps> = ({
  onClose,
  spaces = "m",
  isActive,
  maxWidth,
  children,
  className,
  ...props
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const onCloseBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (isActive) {
      document.querySelector("html")?.classList.add("blocked");
    } else {
      document.querySelector("html")?.classList.remove("blocked");
    }
  }, [isActive]);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    const portalRoot = document.getElementById("modal-root");
    return ReactDOM.createPortal(
      <div
        className={cn(
          isActive? "opacity-100 visible pointer-events-auto": "opacity-0 invisible pointer-events-none",
          "bg-[rgba(0,0,0,0.15)] z-10 fixed left-0 top-0 min-h-screen w-screen flex items-center justify-center flex-col [transition:_opacity_0.35s_ease-in,_visibility_0.35s_ease-in] px-4"
        )}
      >
        <div
          className={
            "relative w-full border-[1px] border-gray-500 bg-white p-[40px_27px_30px] max-w-[450px]"
          }
          {...props}
        >
          <button
            className={
              "outline-none p-1 text-md absolute right-1 top-1 block cursor-pointer border-none hover:scale-125"
            }
            onClick={onCloseBtn}
          >
            &#x2715;
          </button>

          {children}
        </div>
      </div>,
      portalRoot! //<< -- div with 'modal-root' id must be included inside custom pages/_document
    );
  }
  return <></>;
};
