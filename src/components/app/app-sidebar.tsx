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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/clients">Listado de Clientes</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/stock">Carga de Stock</Link>
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
