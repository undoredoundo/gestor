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
import { createClientSchema } from "@/lib/schemas";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateClientPage() {
  const mutation = api.client.create.useMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSubmit(values: z.infer<typeof createClientSchema>) {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push("/client");
      },
    });
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8">
        <h1 className="w-full text-left text-3xl">Crear Cliente</h1>
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
      </div>
    </main>
  );
}
