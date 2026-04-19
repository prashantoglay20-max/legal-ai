"use client";

import * as React from "react";

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
}

export function Accordion({ className = "", children, ...props }: AccordionProps) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface AccordionItemProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  value: string;
}
export function AccordionItem({ className = "", children, value, ...props }: AccordionItemProps) {
  return (
    <details className={`rounded-2xl border border-slate-200 bg-slate-50 ${className}`} {...props}>
      {children}
    </details>
  );
}

interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {}
export function AccordionTrigger({ className = "", ...props }: AccordionTriggerProps) {
  return (
    <summary
      className={`cursor-pointer px-5 py-4 text-sm font-semibold text-slate-900 outline-none ${className}`}
      {...props}
    />
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function AccordionContent({ className = "", ...props }: AccordionContentProps) {
  return <div className={`px-5 py-4 text-sm text-slate-700 ${className}`} {...props} />;
}
