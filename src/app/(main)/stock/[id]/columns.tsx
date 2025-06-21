"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

type Stock = {
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
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2">
          Fecha
          <Button
            size="icon"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    accessorFn: (row) => format(row.date, "dd/MM/yyyy"),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
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
    header: "Creado por",
    accessorFn: (row) => row.author.email,
  },
  // {
  //   header: "Acciones",
  //   cell: () => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button size="icon" variant="ghost">
  //           <Trash className="h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
