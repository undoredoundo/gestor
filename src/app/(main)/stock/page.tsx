import { api } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StockPage() {
  const clients = await api.clients.getAll();

  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl">Seleccionar Cliente</h1>
        <div className="flex flex-col gap-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/stock/${client.id}`}>
              <Button className="w-full">{client.name}</Button>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
