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
import { createResourceSchema } from "@/lib/schemas";
import { useTRPC } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Resource, ToolType } from "@/lib/types";

export function CreateResourceForm({
  resource,
  clientId,
  toolType,
}: {
  resource: Resource;
  clientId?: number;
  toolType?: ToolType;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const client = useQueryClient();
  const trpc = useTRPC();
  const mutation = useMutation(trpc.resource.create.mutationOptions());
  const form = useForm<z.infer<typeof createResourceSchema>>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      type: resource,
      clientId: clientId,
      name: "",
      count: "0",
      toolType: toolType,
    },
  });

  async function handleSubmit(values: z.infer<typeof createResourceSchema>) {
    try {
      toast.loading("Creando...", { id: "create-resource" });
      await mutation.mutateAsync(values);
      await client.invalidateQueries(trpc.resource.getClients.queryFilter());
      await client.invalidateQueries(trpc.resource.getTools.queryFilter());
      router.refresh();
      setOpen(false);
      toast.success("Creado");
    } catch (_error) {
      toast.error("Error al crear");
    } finally {
      toast.dismiss("create-resource");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="size-6">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear {resource}</DialogTitle>
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
              Crear
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
