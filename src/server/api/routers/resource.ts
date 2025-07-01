import { createResourceSchema, updateResourceSchema } from "@/lib/schemas";
import { createTRPCRouter, permissionProcedure } from "@/server/api/trpc";
import { client, description, code, tools } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import z from "zod/v4";

export const resourceRouter = createTRPCRouter({
  getClients: permissionProcedure("stock.read").query(async ({ ctx }) => {
    const clients = await ctx.db.query.client.findMany({
      with: {
        descriptions: true,
        codes: true,
      },
    });
    return clients;
  }),
  getTools: permissionProcedure("stock.read").query(async ({ ctx }) => {
    const tools = await ctx.db.query.tools.findMany();
    return tools;
  }),
  create: permissionProcedure("*")
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
        case "tool":
          await ctx.db.insert(tools).values({
            name: input.name,
            count: Number(input.count),
            type: input.toolType,
          });
          break;
      }
    }),
  update: permissionProcedure("*")
    .input(updateResourceSchema)
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "client":
          await ctx.db
            .update(client)
            .set({
              name: input.name,
            })
            .where(eq(client.id, input.resourceId));
          break;
        case "description":
          await ctx.db
            .update(description)
            .set({
              name: input.name,
            })
            .where(eq(description.id, input.resourceId));
          break;
        case "code":
          await ctx.db
            .update(code)
            .set({
              name: input.name,
            })
            .where(eq(code.id, input.resourceId));
          break;
        case "tool":
          await ctx.db
            .update(tools)
            .set({
              name: input.name,
              count: Number(input.count),
            })
            .where(eq(tools.id, input.resourceId));
          break;
      }
    }),
  delete: permissionProcedure("*")
    .input(
      z.object({
        id: z.number().int(),
        type: z.enum(["client", "description", "code", "tool"]),
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
        case "tool":
          await ctx.db.delete(tools).where(eq(tools.id, input.id));
          break;
      }
    }),
});
