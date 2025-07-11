"use client";

import { useForm } from "react-hook-form";
import { type z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateResourceSchema } from "@/lib/schemas";
import { useTRPC } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Resource, ToolType } from "@/lib/types";

export function EditResourceForm({
  original,
  resource,
  resourceId,
  count,
  toolType,
}: {
  resource: Resource;
  resourceId?: number;
  original?: string;
  count?: string;
  toolType?: ToolType;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const client = useQueryClient();
  const trpc = useTRPC();
  const mutation = useMutation(trpc.resource.update.mutationOptions());
  const form = useForm<z.infer<typeof updateResourceSchema>>({
    resolver: zodResolver(updateResourceSchema),
    defaultValues: {
      type: resource,
      name: original ?? "",
      resourceId: resourceId,
      count: count ?? "0",
      toolType: toolType,
    },
  });

  async function handleSubmit(values: z.infer<typeof updateResourceSchema>) {
    try {
      toast.loading("Editando...", { id: "edit-resource" });
      await mutation.mutateAsync(values);
      await client.invalidateQueries(trpc.resource.getClients.queryFilter());
      await client.invalidateQueries(trpc.resource.getTools.queryFilter());
      router.refresh();
      setOpen(false);
      toast.success("Editado");
    } catch (_error) {
      toast.error("Error al editar");
    } finally {
      toast.dismiss("edit-resource");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {resource}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {resource === "tool" && (
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cantidad"
                        type="number"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="w-full"
              loading={mutation.isPending}
            >
              Editar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
