import { HTMLAttributes } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
