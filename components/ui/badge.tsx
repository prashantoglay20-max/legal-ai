"use client";

import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "warning" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex rounded-full px-3 py-1 text-sm font-medium";
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-800",
    secondary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    outline: "border border-slate-300 bg-white text-slate-700",
  };

  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
