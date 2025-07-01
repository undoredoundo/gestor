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
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const router = useRouter();
  const sidebar = useSidebar();
  const { data: session } = authClient.useSession();

  async function signOut() {
    await authClient.signOut();
    router.replace("/auth");
  }

  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="py-4 text-center text-3xl font-semibold">
        Gestor Titec
      </SidebarHeader>
      <SidebarContent>
        {session?.user.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrativo</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => sidebar.setOpenMobile(false)}
                >
                  <Link href="/client">Listar Clientes</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => sidebar.setOpenMobile(false)}
                >
                  <Link href="/tool">Listar Herramientas</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Stock</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => sidebar.setOpenMobile(false)}
              >
                <Link href="/stock">Listar Stock</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => sidebar.setOpenMobile(false)}
              >
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
