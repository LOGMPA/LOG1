import React from "react";
import { cn } from "../../lib/utils";

export function SidebarProvider({ children }) {
  return <>{children}</>;
}

export function Sidebar({ className, children }) {
  return (
    <aside
      className={cn(
        "hidden md:flex w-64 flex-col bg-white/80 backdrop-blur border-r border-slate-200",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }) {
  return <div className={cn("px-4 py-4 border-b border-slate-200", className)}>{children}</div>;
}

export function SidebarContent({ className, children }) {
  return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>;
}

export function SidebarGroup({ children }) {
  return <div className="px-3 py-3">{children}</div>;
}

export function SidebarGroupLabel({ className, children }) {
  return (
    <div
      className={cn(
        "text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 px-2 mb-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

export function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>;
}

export function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({ className, asChild, children }) {
  if (asChild) return children;
  return (
    <button
      className={cn(
        "w-full text-left rounded-xl px-3 py-2.5 text-sm flex items-center gap-3 transition-all",
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.99]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SidebarTrigger({ className }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-slate-200 px-2 py-1 text-sm",
        "bg-white text-slate-700 shadow-sm",
        className
      )}
      type="button"
    >
      ☰
    </button>
  );
}
