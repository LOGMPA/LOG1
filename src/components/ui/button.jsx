import React from "react";
import { cn } from "../../lib/utils";

export function Button({
  asChild = false,
  className,
  children,
  variant = "default",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50";
  const variants = {
    default:
      "bg-gradient-to-r from-macPink via-macLilac to-sky-400 text-slate-900 shadow hover:brightness-105 active:scale-[0.98]",
    outline:
      "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98]",
    ghost: "text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
  };
  const cls = cn(base, variants[variant], className);

  if (asChild) {
    const Child = React.Children.only(children);
    return React.cloneElement(Child, { className: cn(Child.props.className, cls), ...props });
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
