import { MouseEventHandler, ReactNode } from "react";

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}
interface ButtonProps {
  type?: ButtonType;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}
export default function Button({type, children, className, onClick}: ButtonProps) {
  return (  
    <button type={type} className={`rounded-full h-8 flex items-center p-4 justify-center bg-slate-200 text-dark-100 ${className}`} onClick={onClick}>{children}</button>
  )
}
