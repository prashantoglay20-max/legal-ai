"use client";

import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Card({ className = "", ...props }: CardProps) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`} {...props} />;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className = "", ...props }: CardHeaderProps) {
  return <div className={`border-b border-slate-200 px-6 py-4 ${className}`} {...props} />;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className = "", ...props }: CardContentProps) {
  return <div className={`p-6 ${className}`} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export function CardTitle({ className = "", ...props }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />;
}
