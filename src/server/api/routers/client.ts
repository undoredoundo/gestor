import {
  createClientSchema,
  createDescriptionSchema,
  createCodeSchema,
} from "@/lib/schemas";
import { createTRPCRouter, authenticatedProcedure } from "@/server/api/trpc";
import { client, description, code } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
  create: authenticatedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(client).values(input);
    }),
  createDescription: authenticatedProcedure
    .input(createDescriptionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(description).values({
        clientId: Number(input.clientId),
        name: input.name,
      });
    }),
  createCode: authenticatedProcedure
    .input(createCodeSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(code).values({
        clientId: Number(input.clientId),
        name: input.name,
      });
    }),
  delete: authenticatedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(client).where(eq(client.id, input));
    }),
  deleteDescription: authenticatedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(description).where(eq(description.id, input));
    }),
  deleteCode: authenticatedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(code).where(eq(code.id, input));
    }),
});
