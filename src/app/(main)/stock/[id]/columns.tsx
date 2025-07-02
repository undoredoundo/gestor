"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Stock = {
  id: number;
  date: Date;
  quantity: number;
  status: string;
  note: string | null;
  author: {
    email: string;
  };
  description: {
    name: string;
  } | null;
  code: {
    name: string;
  } | null;
  unit: string | null;
};

export const columns: ColumnDef<Stock>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar Todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
  },
  {
    header: "Descripción",
    accessorFn: (row) => row.description?.name ?? "-",
  },
  {
    header: "Código",
    accessorFn: (row) => row.code?.name ?? "-",
  },
  {
    accessorKey: "date",
    header: "Fecha",
    accessorFn: (row) => format(row.date, "dd/MM/yyyy"),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    accessorFn: (row) => row.quantity + (row.unit ? ` ${row.unit}` : ""),
  },
  {
    accessorKey: "status",
    header: "Estado",
    accessorFn: (row) => (row.status === "ingreso" ? "Ingreso" : "Egreso"),
    cell: ({ row }) => (
      <span
        className={
          row.original.status === "ingreso"
            ? "text-green-400"
            : row.original.status === "egreso"
              ? "text-destructive"
              : "text-gray-500"
        }
      >
        {row.original.status === "ingreso" ? "Ingreso" : "Egreso"}
      </span>
    ),
  },
  {
    header: "Nota",
    accessorFn: (row) => row.note,
  },
];
