"use client";

import * as React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Spinner({ className = "", ...props }: SpinnerProps) {
  return (
    <span
      className={`inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="loading"
      {...props}
    />
  );
}
