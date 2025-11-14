import React from "react";
import { Tractor, Sparkles } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-900 flex">
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-macLilac blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-macPink blur-3xl rounded-full" />
        </div>

        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-macGreen via-emerald-500 to-emerald-300">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-base">Painel Logística</h2>
                <p className="text-xs text-slate-500">Leitor de CTe boiolinha</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Visões</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="bg-slate-900 text-slate-50 shadow-md shadow-slate-900/20">
                      <Sparkles className="w-4 h-4 text-macPink" />
                      <span>Leitor de CTe</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col relative z-10">
          <header className="bg-slate-900/70 backdrop-blur border-b border-slate-800 px-4 py-3 md:hidden sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold text-slate-50">Leitor de CTe</h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
