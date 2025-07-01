import { api } from "@/trpc/server";
import Tools from "./tools";

export default async function ToolsPage() {
  const tools = await api.resource.getTools();

  return <Tools tools={tools} />;
}
