import { createClientSchema } from "@/lib/schemas";
import { createTRPCRouter, authenticatedProcedure } from "@/server/api/trpc";
import { client } from "@/server/db/schema";

export const clientRouter = createTRPCRouter({
  getAll: authenticatedProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.query.client.findMany();
    return clients;
  }),
  create: authenticatedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(client).values(input);
    }),
});
