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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { createStockSchema } from "@/lib/schemas";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export default function CreateStockPage() {
  const trpc = useTRPC();
  const { data: prerequisites } = useSuspenseQuery(
    trpc.stock.getCreationPrerequisites.queryOptions(),
  );
  const mutation = useMutation(trpc.stock.create.mutationOptions());
  const router = useRouter();
  const form = useForm<z.infer<typeof createStockSchema>>({
    resolver: zodResolver(createStockSchema),
    defaultValues: {
      clientId: "",
      descriptionId: "",
      codeId: "",
      date: undefined,
      quantity: "0",
      status: "ingreso",
      note: "",
      unit: "none",
    },
  });

  function handleSubmit(values: z.infer<typeof createStockSchema>) {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push(`/stock/${form.watch("clientId")}`);
      },
    });
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-8">
        <h1 className="w-full text-left text-3xl">Carga de Stock</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {prerequisites.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id.toString()}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Producto</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("clientId")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {prerequisites
                          .find(
                            (client) =>
                              client.id === Number(form.watch("clientId")),
                          )
                          ?.descriptions?.map((description) => (
                            <SelectItem
                              key={description.id}
                              value={description.id.toString()}
                            >
                              {description.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código del Producto</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("clientId")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar código" />
                      </SelectTrigger>
                      <SelectContent>
                        {prerequisites
                          .find(
                            (client) =>
                              client.id === Number(form.watch("clientId")),
                          )
                          ?.codes?.map((code) => (
                            <SelectItem
                              key={code.id}
                              value={code.id.toString()}
                            >
                              {code.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yy")
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input placeholder="Cantidad" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
                        <SelectItem value="pcs">pcs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingreso">Ingreso</SelectItem>
                        <SelectItem value="egreso">Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              loading={mutation.isPending}
              disabled={form.watch("clientId") === ""}
            >
              Cargar
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
