"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
