import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-macLilac focus:border-transparent " +
        className
      }
      {...props}
    />
  );
}
