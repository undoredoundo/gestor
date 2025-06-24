import { api } from "@/trpc/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Params = Promise<{
  id: string;
}>;

export default async function StockPage({ params }: { params: Params }) {
  const { id } = await params;

  const stocks = await api.stock.getByClientId({ clientId: Number(id) });

  const client = stocks[0]?.client.name;

  return (
    <main className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        {client && <h1 className="text-3xl">Stock {client}</h1>}
      </div>
      <div>
        <DataTable client={client ?? ""} columns={columns} data={stocks} />
      </div>
    </main>
  );
}
