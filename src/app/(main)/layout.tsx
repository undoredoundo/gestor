import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarTrigger } from "@/components/app/sidebar-trigger";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/auth");
  }

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full w-full flex-col">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              <div className="relative flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-2 size-10 md:-ml-4" />
                <h2 className="absolute left-1/2 -translate-x-1/2 text-center font-semibold">
                  Bienvenido {session.user.name}
                </h2>
              </div>
            </header>
            <div className="h-full overflow-auto p-4">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
