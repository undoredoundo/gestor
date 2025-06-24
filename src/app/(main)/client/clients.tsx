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
import CreateClientForm from "@/components/app/clients/create-client-form";
import CreateDescriptionForm from "@/components/app/clients/create-description-form";
import CreateCodeForm from "@/components/app/clients/create-code-form";
import { DeleteClientButton } from "@/components/app/clients/delete-client-button";
import { DeleteDescriptionButton } from "@/components/app/clients/delete-description-button";
import { DeleteCodeButton } from "@/components/app/clients/delete-code-button";
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
            <CreateClientForm />
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
              <DeleteClientButton clientId={client.id} />
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedClientData && (
        <Card>
          <CardHeader>
            <CardTitle>Descripciones {selectedClientData.name}</CardTitle>
            <CardAction>
              <CreateDescriptionForm
                key={selectedClientData.id} // react uses the same client id if the dialog was opened before, this is to force a re-render
                clientId={selectedClientData.id}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {selectedClientData.descriptions.map((description) => (
              <div key={description.id} className="flex items-center gap-2">
                <Button className="flex-grow">{description.name}</Button>
                <DeleteDescriptionButton descriptionId={description.id} />
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
              <CreateCodeForm
                key={selectedClientData.id}
                clientId={selectedClientData.id}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {selectedClientData.codes.map((code) => (
              <div key={code.id} className="flex items-center gap-2">
                <Button className="flex-grow">{code.name}</Button>
                <DeleteCodeButton codeId={code.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
