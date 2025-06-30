"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteResourceButton({
  resourceId,
  resourceType,
}: {
  resourceId: number;
  resourceType: "client" | "description" | "code";
}) {
  const trpc = useTRPC();
  const client = useQueryClient();
  const mutation = useMutation(trpc.clients.deleteResource.mutationOptions());
  const router = useRouter();

  async function handleDelete() {
    try {
      toast.loading("Eliminando...", { id: "delete-resource" });
      await mutation.mutateAsync({ id: resourceId, type: resourceType });
      await client.invalidateQueries(trpc.clients.getAll.queryFilter());
      toast.success("Eliminado");
    } catch (_error) {
      toast.error("Error al eliminar");
    } finally {
      toast.dismiss("delete-resource");
      router.refresh();
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          ¿Estás seguro de eliminar este recurso?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
