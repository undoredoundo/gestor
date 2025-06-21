import { createTRPCRouter, authenticatedProcedure } from "@/server/api/trpc";
import { stock } from "@/server/db/schema";
import { createStockSchema } from "@/lib/schemas";
import { z } from "zod";
import { inArray } from "drizzle-orm";

export const stockRouter = createTRPCRouter({
  getAll: authenticatedProcedure.query(async ({ ctx }) => {
    const stocks = await ctx.db.query.stock.findMany();
    return stocks;
  }),
  getByClientId: authenticatedProcedure
    .input(z.object({ clientId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const stocks = await ctx.db.query.stock.findMany({
        with: {
          author: true,
          client: true,
          description: true,
          code: true,
        },
        where: (stock, { eq }) => eq(stock.clientId, input.clientId),
      });
      return stocks;
    }),
  getCreationPrerequisites: authenticatedProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.query.client.findMany({
      with: {
        descriptions: true,
        codes: true,
      },
    });
    return clients;
  }),
  create: authenticatedProcedure
    .input(createStockSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(stock).values({
        clientId: Number(input.clientId),
        descriptionId:
          input.descriptionId === "" ? null : Number(input.descriptionId),
        codeId: input.codeId === "" ? null : Number(input.codeId),
        date: input.date,
        quantity: Number(input.quantity),
        status: input.status,
        note: input.note,
        createdBy: ctx.session.user.id,
      });
    }),
  bulkDelete: authenticatedProcedure
    .input(z.array(z.number().int()))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(stock).where(inArray(stock.id, input));
    }),
});
