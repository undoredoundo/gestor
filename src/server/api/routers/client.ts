import { createResourceSchema } from "@/lib/schemas";
import { createTRPCRouter, authenticatedProcedure } from "@/server/api/trpc";
import { client, description, code } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import z from "zod/v4";

export const clientRouter = createTRPCRouter({
  getAll: authenticatedProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.query.client.findMany({
      with: {
        descriptions: true,
        codes: true,
      },
    });
    return clients;
  }),
  createResource: authenticatedProcedure
    .input(createResourceSchema)
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "client":
          await ctx.db.insert(client).values({
            name: input.name,
          });
          break;
        case "description":
          await ctx.db.insert(description).values({
            clientId: input.clientId,
            name: input.name,
          });
          break;
        case "code":
          await ctx.db.insert(code).values({
            clientId: input.clientId,
            name: input.name,
          });
          break;
      }
    }),
  deleteResource: authenticatedProcedure
    .input(
      z.object({
        id: z.number().int(),
        type: z.enum(["client", "description", "code"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "client":
          await ctx.db.delete(client).where(eq(client.id, input.id));
          break;
        case "description":
          await ctx.db.delete(description).where(eq(description.id, input.id));
          break;
        case "code":
          await ctx.db.delete(code).where(eq(code.id, input.id));
          break;
      }
    }),
});
