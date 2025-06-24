"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateResourceForm } from "@/components/app/clients/create-resource-form";
import { DeleteResourceButton } from "@/components/app/clients/delete-resource-button";
import { type api } from "@/trpc/server";

type Client = Awaited<ReturnType<typeof api.clients.getAll>>;

export default function ClientsPage({ clients }: { clients: Client }) {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const selectedClientData = useMemo(
    () => clients?.find((client) => client.id === selectedClient),
    [clients, selectedClient],
  );

  return (
    <main className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardAction>
            <CreateResourceForm resource="client" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center gap-2">
              <Button
                className="flex-grow"
                onClick={() => setSelectedClient(client.id)}
                variant={selectedClient === client.id ? "default" : "outline"}
              >
                {client.name}
              </Button>
              <DeleteResourceButton
                resourceId={client.id}
                resourceType="client"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedClientData && (
        <Card>
          <CardHeader>
            <CardTitle>Descripciones {selectedClientData.name}</CardTitle>
            <CardAction>
              <CreateResourceForm
                key={selectedClientData.id} // react uses the same client id if the dialog was opened before, this is to force a re-render
                clientId={selectedClientData.id}
                resource="description"
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {selectedClientData.descriptions.map((description) => (
              <div key={description.id} className="flex items-center gap-2">
                <Button className="flex-grow">{description.name}</Button>
                <DeleteResourceButton
                  resourceId={description.id}
                  resourceType="description"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedClientData && (
        <Card>
          <CardHeader>
            <CardTitle>Códigos {selectedClientData.name}</CardTitle>
            <CardAction>
              <CreateResourceForm
                key={selectedClientData.id}
                clientId={selectedClientData.id}
                resource="code"
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {selectedClientData.codes.map((code) => (
              <div key={code.id} className="flex items-center gap-2">
                <Button className="flex-grow">{code.name}</Button>
                <DeleteResourceButton
                  resourceId={code.id}
                  resourceType="code"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
