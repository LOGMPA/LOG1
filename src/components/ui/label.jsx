import React from "react";

export function Label({ className = "", ...props }) {
  return (
    <label
      className={
        "text-xs font-medium tracking-wide text-slate-700 uppercase mb-1 inline-block " +
        className
      }
      {...props}
    />
  );
}
