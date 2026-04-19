"use client";

import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
}

const variants: Record<string, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-600 text-white hover:bg-slate-700",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
};

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
