import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, FileText, CheckCircle, Presentation, Truck } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarProvider, SidebarTrigger
} from "../components/ui/sidebar";

const navigationItems = [
  { title: "Painel Logística 2026", url: "LOG1/#/painel", icon: LayoutDashboard },
  { title: "Calendário", url: "LOG1/#/calendario", icon: Calendar },
  { title: "Solicitações de Transporte", url: "LOG1/#/solicitacoes", icon: FileText },
  { title: "Transportes Concluídos", url: "LOG1/#/concluidos", icon: CheckCircle },
  { title: "Demonstrações", url: "LOG1/#/demos", icon: Presentation },
];

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAFAF9]">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Logística</h2>
                <p className="text-xs text-gray-500">Sistema 2026</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 mb-1">Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mb-1 ${location.hash.includes(item.url.split('#/')[1]) ? "bg-blue-50 text-blue-700 font-medium" : ""}`}>
                        <a href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors" />
              <h1 className="text-lg font-semibold text-gray-900">Logística 2026</h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
