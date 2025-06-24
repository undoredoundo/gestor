"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarMenuButton,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { authClient } from "@/server/auth/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/auth");
  }

  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="text-center text-2xl">Gestor</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Clientes</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/client">Listar Clientes</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Stock</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/stock">Listar Stock</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/stock/create">Crear Stock</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" className="w-full" onClick={signOut}>
          Cerrar Sesión
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
