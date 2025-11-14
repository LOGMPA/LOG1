import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("px-5 py-4 border-b border-slate-100", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("font-semibold text-slate-900", className)}>{children}</h3>;
}

export function CardContent({ className, children }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
