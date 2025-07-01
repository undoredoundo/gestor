import { api } from "@/trpc/server";
import Clients from "./clients";

export default async function ClientsPage() {
  const clients = await api.resource.getClients();

  return <Clients clients={clients} />;
}
