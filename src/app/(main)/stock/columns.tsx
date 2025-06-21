"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type Stock = {
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
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) =>
            row.toggleSelected(value === "indeterminate" ? false : value)
          }
        />
      );
    },
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(
              value === "indeterminate" ? false : value,
            )
          }
        />
      );
    },
    id: "select",
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning: false,
  },
  {
    accessorKey: "description.name",
    header: "Descripción",
  },
  {
    accessorKey: "code.name",
    header: "Código",
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.original.date;
      return format(date, "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "author.email",
    header: "Creado por",
  },
];
