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
import { createCodeSchema } from "@/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateCodeForm({ clientId }: { clientId: number }) {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const trpc = useTRPC();
  const mutation = useMutation(trpc.clients.createCode.mutationOptions());
  const form = useForm<z.infer<typeof createCodeSchema>>({
    resolver: zodResolver(createCodeSchema),
    defaultValues: {
      clientId: String(clientId),
      name: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof createCodeSchema>) {
    await mutation.mutateAsync(values);
    await client.invalidateQueries(trpc.clients.getAll.queryFilter());
    setOpen(false);
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
          <DialogTitle>Crear Código</DialogTitle>
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
