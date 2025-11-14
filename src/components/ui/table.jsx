import React from "react";

export function Table({ children }) {
  return <table className="min-w-full text-left text-sm">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-slate-50/80 text-slate-600">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={
        "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap " +
        className
      }
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", colSpan }) {
  return (
    <td className={"px-3 py-2 align-top text-sm text-slate-900 " + className} colSpan={colSpan}>
      {children}
    </td>
  );
}
