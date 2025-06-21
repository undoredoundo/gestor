import { DataTable } from "@/components/app/data-table";
import { columns } from "./columns";
import { api } from "@/trpc/server";

export default async function ClientsPage() {
  const clients = await api.client.getAll();

  return (
    <main>
      <DataTable columns={columns} data={clients} />
    </main>
  );
}
