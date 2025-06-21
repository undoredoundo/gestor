"use client";

import type { ColumnDef } from "@tanstack/react-table";

type Client = {
  id: number;
  name: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
];
