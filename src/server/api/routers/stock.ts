import { createTRPCRouter, permissionProcedure } from "@/server/api/trpc";
import { stock } from "@/server/db/schema";
import { createStockSchema } from "@/lib/schemas";
import z from "zod/v4";
import { inArray } from "drizzle-orm";

export const stockRouter = createTRPCRouter({
  getAll: permissionProcedure("stock.read").query(async ({ ctx }) => {
    const stocks = await ctx.db.query.stock.findMany();
    return stocks;
  }),
  getByClientId: permissionProcedure("stock.read")
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
  getCreationPrerequisites: permissionProcedure("stock.write").query(
    async ({ ctx }) => {
      const clients = await ctx.db.query.client.findMany({
        with: {
          descriptions: true,
          codes: true,
        },
      });
      return clients;
    },
  ),
  create: permissionProcedure("stock.write")
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
  bulkDelete: permissionProcedure("stock.write")
    .input(z.array(z.number().int()))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(stock).where(inArray(stock.id, input));
    }),
});
