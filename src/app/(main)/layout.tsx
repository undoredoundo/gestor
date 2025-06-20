import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarTrigger } from "@/components/app/sidebar-trigger";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex h-full w-full flex-col">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-2 size-10 md:-ml-4" />
              </div>
            </header>
            <ScrollArea className="h-full min-h-0">{children}</ScrollArea>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
