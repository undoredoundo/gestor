import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateResourceForm } from "@/components/app/clients/create-resource-form";
import { DeleteResourceButton } from "@/components/app/clients/delete-resource-button";
import { EditResourceForm } from "@/components/app/clients/edit-resource-form";
import { type api } from "@/trpc/server";

type Tool = Awaited<ReturnType<typeof api.resource.getTools>>;

const types = [
  { type: "mecha", name: "Mecha" },
  { type: "macho", name: "Macho" },
  { type: "fresa", name: "Fresa" },
] as const;

export default function Tools({ tools }: { tools: Tool }) {
  return (
    <main className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {types.map((type) => (
        <Card key={type.type}>
          <CardHeader>
            <CardTitle>{type.name}</CardTitle>
            <CardAction>
              <CreateResourceForm
                key={type.type}
                resource="tool"
                toolType={type.type}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {tools
              .filter((tool) => tool.type === type.type)
              .map((tool) => (
                <div
                  key={`${type.type}-${tool.id}`}
                  className="flex items-center gap-2"
                >
                  <Button className="flex-grow">{tool.name}</Button>
                  <Button variant="outline">{tool.count}</Button>
                  <EditResourceForm
                    key={`edit-${type.type}-${tool.id}`}
                    original={tool.name}
                    resource="tool"
                    resourceId={tool.id}
                    count={tool.count.toString()}
                    toolType={type.type}
                  />
                  <DeleteResourceButton
                    key={`delete-${type.type}-${tool.id}`}
                    resourceId={tool.id}
                    resourceType="tool"
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
